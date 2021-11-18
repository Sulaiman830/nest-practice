import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { UpdateResult } from "typeorm";
import { FeedService } from "./feed.service";
import { FeedPost } from "./models/post.Interface";

@Controller('feed')
export class FeedController {
    constructor(private feedService: FeedService) { }

    @UseGuards(JwtGuard)
    @Post()
    create(
        @Body()
        post: FeedPost): Observable<FeedPost> {
        return this.feedService.createPost(post)
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