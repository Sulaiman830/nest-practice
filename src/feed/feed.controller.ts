import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, Request } from "@nestjs/common";
import { Observable } from "rxjs";
import { Roles } from "src/auth/decorators/roles.decorator";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { Role } from "../auth/model/role.enum";
import { UpdateResult } from "typeorm";
import { FeedService } from "./feed.service";
import { FeedPost } from "./models/post.Interface";
import { RolesGuard } from "src/auth/guards/roles.guard";

@Controller('feed')
export class FeedController {
    constructor(private feedService: FeedService) { }

    @Roles(Role.ADMIN, Role.PREMIUM)
    @UseGuards(JwtGuard, RolesGuard)
    @Post()
    create(
        @Body()
        post: FeedPost, @Request() req): Observable<FeedPost> {
        return this.feedService.createPost(req.user, post)
    }

    // @Get()
    // findAll(): Observable<FeedPost[]> {
    //     return this.feedService.findAllPosts();
    // }

    @Get(':id')
    getPost(
        @Param('id') id:number
    ): Observable<FeedPost> {
        return this.feedService.getSinglePost(id)
    }

    // request with pagination
    @Get()
    getSelected(
        @Query('take') take: number = 1,
        @Query('skip') skip: number = 1
    ) : Observable<FeedPost[]> {
        take = take > 20 ? 20 : take;
        return this.feedService.getSelectedPosts(take, skip)
    }

    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() feedPost: FeedPost
    ): Observable<UpdateResult> {
        return this.feedService.updatePost(id, feedPost)
    }

    @Delete(':id')
    delete(
        @Param('id') id: number
    ) {
        return this.feedService.deletePost(id)
    }
}