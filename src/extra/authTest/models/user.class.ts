import { IsEmail, IsString } from "class-validator";

export class User {
  id?: string;
  firstName?: string;
  lastName?: string;
  @IsEmail()
  email?: string;
  @IsString()
  password?: string;
  imagePath?: string;
  token?: string;
  confirmed?:boolean;
}
