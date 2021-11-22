import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type UserType = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeit',
    },
    {
      userId: 2,
      username: 'khan',
      password: 'changing',
    },
  ];

  async findOne(username: string): Promise<UserType | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
