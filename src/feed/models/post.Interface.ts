import { User } from 'src/auth/model/user.interface';

export interface FeedPost {
  id?: number;
  body?: string;
  createdAt?: Date;
  author?: User;
}
