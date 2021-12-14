import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { from, map, Observable, of, switchMap, tap } from 'rxjs';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.class';
import { MailService } from 'src/mail/mail.service';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private mailService:MailService,
  ) {}

  hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 12));
  }

  doesUserExist(email: string): Observable<boolean> {
    return from(this.userRepository.findOne({ email })).pipe(
      switchMap((user: User) => {
        return of(!!user);
      }),
    );
  }

  registerUser(user: User): Observable<User> {
    const { firstName, lastName, email, password } = user;
    const token = Math.floor(1000 + Math.random() * 9000).toString();
    return this.doesUserExist(email).pipe(
      tap((doesUserExist: boolean) => {
        if (doesUserExist)
          throw new HttpException(
            'A user has already been created with this email address',
            HttpStatus.BAD_REQUEST,
          );
      }),
      switchMap(() => {
      this.mailService.sendUserConfirmation(user, token);
        return this.hashPassword(password).pipe(
          switchMap((hashedPassword: string) => {
            return from(
              this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                token
              }),
            ).pipe(
              map((user: User) => {
                delete user.password;
                return user;
              }),
            );
          }),
        );
      }),
    );
  
  }


  validateUser(email: string, password: string): Observable<User> {
    return from(
      this.userRepository.findOne(
        { email },
        {
          select: ['id', 'firstName', 'lastName', 'email', 'password', 'confirmed'],
        },
      ),
    ).pipe(
      switchMap((user: User) => {
        if (!user) {
          // throw new HttpException("Not found",HttpStatus.NOT_FOUND);
          throw new HttpException(
            { status: HttpStatus.NOT_FOUND, error: 'invalid credentials' },
            HttpStatus.NOT_FOUND,
          );
        }
        return from(bcrypt.compare(password, user.password)).pipe(
          map((isValidPassword: boolean) => {
            if (isValidPassword) {
              delete user.password;
              return user;
            } 
            else {
                // throw new HttpException("Not found",HttpStatus.NOT_FOUND);
                throw new HttpException(
                  { status: HttpStatus.NOT_FOUND, error: 'invalid credentials' },
                  HttpStatus.NOT_FOUND,
                );
            }
          }),
        );
      }),
    );
  }

  loginUser(user: User): Observable<string> {
    const { email, password } = user;
    return this.validateUser(email, password).pipe(
      switchMap((user: User) => {
        if(!user.confirmed) {
          throw new HttpException(
            { status: HttpStatus.NOT_FOUND, error: 'Pending Account. Please Verify Your Email!' },
            HttpStatus.NOT_FOUND,
          );
        } 
        if (user) {
          // create JWT - credential
          return from(this.jwtService.signAsync({ user }));
        }
      }),
    );
  }

  async verifyEmail(token: string, user:User): Promise<User> {
    await this.userRepository.findOne({ where: { token } });
    this.userRepository.update(token, {confirmed :true})
    return user;
}
  // verifyEmail(token: string): Observable<boolean> {
  //   return from(this.userRepository.findOne({ token })).pipe(
  //     switchMap((user: User) => {
  //       console.log('user', user)
  //       return of(!!user);
  //     }),
  //   );
  // }
}
