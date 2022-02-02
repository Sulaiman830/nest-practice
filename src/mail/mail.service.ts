import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../auth/model/user.class';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `example.com/auth/confirm?token=${token}`;
    console.log('user', user.email, token);
    await this.mailerService.sendMail({
      to: user.email,
      from: 'noreply@nestjs.com', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.firstName + user.lastName,
        url,
      },
    });
  }
}

//steps
// first registeration
// send email to the provided email
// prevent user from loggin in without verification
// by clicking the link sent to email address redirect to login page
// coding steps
// add confirmed field in db with default value false (type bool)
// in login fn() check is confirmed or not
// if not ==> please confirm your email address to login
