import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { from, Observable } from "rxjs";
import { UpdateResult } from "typeorm";
import { FeedService } from "./feed.service";
import { FeedPost } from "./models/post.Interface";

@Controller('feed')
export class FeedController {
    constructor(private feedService: FeedService) { }
    @Post()
    create(
        @Body()
        post: FeedPost): Observable<FeedPost> {
        return this.feedService.createPost(post)
    }

    @Get()
    findAll(): Observable<FeedPost[]> {
        return this.feedService.findAllPosts();
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