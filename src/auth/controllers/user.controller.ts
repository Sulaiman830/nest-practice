import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
  Get,
  Req,
  Res,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import 'multer';
import { join } from 'path';

import { Observable, of, switchMap } from 'rxjs';
import { UpdateResult } from 'typeorm';
// import { Observable } from 'rxjs';
import { JwtGuard } from '../guards/jwt.guard';
import { isFileExtensionSafe, removeFile, saveImageToStorage } from '../helpers/image-storage';
import { FriendRequest } from '../model/friend-request.interface';
import { User } from '../model/user.interface';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', saveImageToStorage))
  uploadImage(
    @UploadedFile() file: Express.Multer.File, //ignore it now
    @Request() req,
  ): Observable<UpdateResult | {error: string}> {
    const fileName = file?.filename;
    if (!fileName) return of({ error: 'File must be a png, jpg/jpeg' });

    const imagesFolderPath = join(process.cwd(), 'images');
    const fullImagePath = join(imagesFolderPath + "/" + file.filename);

    return isFileExtensionSafe(fullImagePath).pipe(
        switchMap((isFileLegit: boolean) => {
            if(isFileLegit) {

            const userId = req.user.id;
            return this.userService.updateUserImageById(userId, fileName);
            }
            removeFile(fullImagePath);
            return of({error: "File content does not match extension!"})
        })
    );
   
  }


  @UseGuards(JwtGuard)
  @Get('image')
  findImage(@Request() req, @Res() res): Observable<Object> {
    const userId = req.user.id;
    return this.userService.findImageNameByUserId(userId).pipe(
        switchMap((imageName: string) => {
            return of(res.sendFile(imageName, {root: './images'}))
        })
    )

  }

  @UseGuards(JwtGuard)
  @Get(':userId')
  findUserById(@Param('userId') userId: string): Observable<User> {
    // const userId = parseInt(userStringId);
    return this.userService.findUserById(+userId)
  }

  @UseGuards(JwtGuard)
  @Post('friend_request/send/:recieverId')
  sendFriendRequest(
    @Param('recieverId') recieverId: string,
    @Request() req
    )
    : Observable<FriendRequest | {error:
  string }> {
    // const recieverId = parseInt(recieverStringId);
    return this.userService.sendFriendRequest(+recieverId, req.user)
  }


  // @Get('get')
  // getHello(): string {
  //   return this.userService.getHello();
  // }
}
