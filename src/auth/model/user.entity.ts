import { FeedPostEntity } from 'src/feed/models/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FriendRequestEntity } from './friend-request.entity';
import { Role } from './role.enum';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({default: false})
  confirmed:boolean

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  imagePath: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @OneToMany(() => FeedPostEntity, (feedPostEntity) => feedPostEntity.author)
  feedPosts: FeedPostEntity[];

  @OneToMany(() => FriendRequestEntity, (friendRequestEntity) => friendRequestEntity.creator)
  sentFrientRequests: FriendRequestEntity[];

  @OneToMany(() => FriendRequestEntity, (friendRequestEntity) => friendRequestEntity.reciever)
  recievedFrientRequests: FriendRequestEntity[];
}
