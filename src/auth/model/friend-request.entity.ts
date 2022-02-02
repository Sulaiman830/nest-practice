import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { friend_request_status } from './friend-request.interface';
import { UserEntity } from './user.entity';

@Entity('friend_requests')
export class FriendRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.sentFrientRequests)
  creator: UserEntity;

  @ManyToOne(
    () => UserEntity,
    (userEntity) => userEntity.recievedFrientRequests,
  )
  receiver: UserEntity;

  @Column()
  status: friend_request_status;
}
