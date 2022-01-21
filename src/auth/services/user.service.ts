import { Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { Repository, UpdateResult } from 'typeorm';
import { FriendRequestEntity } from '../model/friend-request.entity';
import { FriendRequest } from '../model/friend-request.interface';
import { UserEntity } from '../model/user.entity';
import { User } from '../model/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>, // private jwtService: JwtService
    @InjectRepository(FriendRequestEntity)
    private readonly friendRequestRepository: Repository<FriendRequestEntity>,
  ) {}

  findUserById(id: number): Observable<User> {
    return from(
      this.userRepository.findOne({ id }, { relations: ['feedPosts'] }),
    ).pipe(
      map((user: User) => {
        delete user.password;
        return user;
      }),
    );
  }

  updateUserImageById(id: number, imagePath: string): Observable<UpdateResult> {
    const user: User = new UserEntity();
    user.id = id;
    user.imagePath = imagePath;
    return from(this.userRepository.update(id, user));
  }

  findImageNameByUserId(id: number): Observable<string> {
    return from(this.userRepository.findOne({ id })).pipe(
      map((user: User) => {
        delete user.password;
        return user.imagePath;
      }),
    );
  }


  hasRequestBeenSentOrRecieved(creator: User, reciever: User) : Observable<boolean> {
    return from(this.friendRequestRepository.findOne({
      where: [
        {creator, reciever},
        {creator: reciever, reciever: creator},
      ]
    })).pipe(
      switchMap((friendRequest: FriendRequest) => {
        if(!friendRequest) return of(false)
        return of(true)
      })
    )
  }


  // handle Friend Request.
  sendFriendRequest(recieverId: number, creator: User):Observable<FriendRequest | {error:
    string }> {
      if(recieverId === creator.id) {
        return of({error: 'it is not possible to add yourself!'})
      }
      
      return this.findUserById(recieverId).pipe(
        switchMap((reciever: User) => {
          return this.hasRequestBeenSentOrRecieved(creator, reciever).pipe(
            switchMap((hasRequestBeenSentOrRecieved: boolean) => {
              if(hasRequestBeenSentOrRecieved) return of({
                error: 'A friend request has already been sent to your account!'
              })
              let friendRequest: FriendRequest = {
                creator,
                reciever,
                status: 'pending'
              }

              return from(this.friendRequestRepository.save(friendRequest))
            })
          )
        })
      )
  }


  getHello(): string {
    return 'Hello World!';
  }
}
