import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'
import { from, map, Observable, switchMap } from 'rxjs';
import { Repository } from 'typeorm';
import { UserEntity } from '../model/user.entity';
import { User } from '../model/user.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) 
        private readonly userRepository: Repository<UserEntity>,
        private jwtService: JwtService
    ) {}

    hashPassword(password: string): Observable<string> {
      return from(bcrypt.hash(password, 12))
    }
   
    registerUser(user:User): Observable<User> {
        const {firstName, lastName, email, password, role} = user;
        return this.hashPassword(password).pipe(
            switchMap((hashedPassword: string) => {
                return from(this.userRepository.save({ 
                    firstName,
                    lastName,
                    email,
                    password:hashedPassword,
                    role
                })).pipe(
                    map((user: User) => {
                        delete user.password;
                        return user
                    })
                )
            })
        )
    }

    validateUser(email: string, password: string): Observable<User> {
        return from(this.userRepository.findOne({email}, {select: ['id', 'firstName', 'lastName',
    'email', 'password', 'role']})).pipe(
        switchMap((user: User) => 
            from(bcrypt.compare(password, user.password)).pipe(
                map((isValidPassword: boolean) => {
                    if(isValidPassword) {
                        delete user.password;
                        return user;
                    }
                })
            )
        )
    )
    }

    loginUser(user: User): Observable<string> {
        const {email, password} = user;
        return this.validateUser(email, password).pipe(
            switchMap((user: User) => {
                if (user) {
                    // create JWT - credential
                    return from(this.jwtService.signAsync({user}));
                }
            })
        )
    }

    findUserById(id: number): Observable<User> {
        return from(this.userRepository.findOne({ id }, { relations: ['feedPosts'] })
        ).pipe(
            map((user: User) => {
                delete user.password;
                return user;
            })
        )
    }
}
