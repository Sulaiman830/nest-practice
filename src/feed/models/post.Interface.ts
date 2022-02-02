import { User } from '../../auth/model/user.class';

export interface FeedPost {
  id?: number;
  body?: string;
  createdAt?: Date;
  author?: User;
}
