import { FeedPost } from 'src/feed/models/post.Interface';
import { Role } from './role.enum';

export interface User {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  confirmed: boolean;
  password?: string;
  imagePath?: string;
  role?: Role;
  posts?: FeedPost;
}
