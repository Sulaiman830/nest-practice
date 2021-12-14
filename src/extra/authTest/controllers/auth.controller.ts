import {
  Controller,
  Post,
  Body,
  Get,
  Param,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { User } from '../models/user.class';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() user: User): Observable<User> {
    return this.authService.registerUser(user);
  }

  @Post('login')
  login(@Body() user: User): Observable<{ token: string }> {
    return this.authService
      .loginUser(user)
      .pipe(map((jwt: string) => ({ token: jwt })));
  }

  @Get('confirm/:token')
  verify(@Param('token') token: string, user:User) {
    return this.authService.verifyEmail(token, user);
  }
}

