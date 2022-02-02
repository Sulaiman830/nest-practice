import { User } from './user.class';

export type friend_request_status = 'pending' | 'accepted' | 'declined';

export interface FriendRequestStatus {
  status?: friend_request_status;
}

export interface FriendRequest {
  id?: number;
  creator?: User;
  receiver?: User;
  status?: friend_request_status;
}
