import { Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { Repository, UpdateResult } from 'typeorm';
import { FriendRequestEntity } from '../model/friend-request.entity';
import {
  FriendRequest,
  FriendRequestStatus,
  friend_request_status,
} from '../model/friend-request.interface';
import { UserEntity } from '../model/user.entity';
import { User } from '../model/user.class';

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

  hasRequestBeenSentOrRecieved(
    creator: User,
    receiver: User,
  ): Observable<boolean> {
    return from(
      this.friendRequestRepository.findOne({
        where: [
          { creator, receiver },
          { creator: receiver, receiver: creator },
        ],
      }),
    ).pipe(
      switchMap((friendRequest: FriendRequest) => {
        if (!friendRequest) return of(false);
        return of(true);
      }),
    );
  }

  // handle Friend Request.
  sendFriendRequest(
    recieverId: number,
    creator: User,
  ): Observable<FriendRequest | { error: string }> {
    if (recieverId === creator.id) {
      return of({ error: 'it is not possible to add yourself!' });
    }

    return this.findUserById(recieverId).pipe(
      switchMap((receiver: User) => {
        return this.hasRequestBeenSentOrRecieved(creator, receiver).pipe(
          switchMap((hasRequestBeenSentOrRecieved: boolean) => {
            if (hasRequestBeenSentOrRecieved)
              return of({
                error: 'A friend request has already been sent!',
              });
            const friendRequest: FriendRequest = {
              creator,
              receiver,
              status: 'pending',
            };

            return from(this.friendRequestRepository.save(friendRequest));
          }),
        );
      }),
    );
  }

  getFriendRequestStatus(
    recieverId: number,
    currentUser: User,
  ): Observable<FriendRequestStatus> {
    return this.findUserById(recieverId).pipe(
      switchMap((receiver: User) => {
        return from(
          this.friendRequestRepository.findOne({
            creator: currentUser,
            receiver,
          }),
        );
      }),
      switchMap((friendRequest: FriendRequest) => {
        return of({ status: friendRequest.status });
      }),
    );
  }

  getFriendRequestUserById(friendRequestId: number): Observable<FriendRequest> {
    return from(
      this.friendRequestRepository.findOne({
        where: [{ id: friendRequestId }],
      }),
    );
  }

  respondToFriendRequest(
    statusResponse: friend_request_status,
    friendRequestId: number,
  ): Observable<FriendRequestStatus> {
    return this.getFriendRequestUserById(friendRequestId).pipe(
      switchMap((friendRequest: FriendRequest) => {
        return from(
          this.friendRequestRepository.save({
            ...friendRequest,
            status: statusResponse,
          }),
        );
      }),
    );
  }

  getFriendRequestsFromRecipients(
    currentUser: User,
  ): Observable<FriendRequest[]> {
    return from(
      this.friendRequestRepository.find({
        where: [{ receiver: currentUser }],
      }),
    );
  }

  getHello(): string {
    return 'Hello World!';
  }
}
