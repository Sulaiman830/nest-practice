import { Body, Controller, Post, Get } from "@nestjs/common";
import { Observable } from "rxjs";
import { FeedService } from "./feed.service";
import { FeedPost } from "./models/post.Interface";

@Controller('feed')
export class FeedController {
    constructor(private feedService: FeedService) {}
    @Post() 
    create(
        @Body()
        post:FeedPost): Observable<FeedPost> {
        return this.feedService.createPost(post)
    }

  //   @Get()
  //   getPosts(): any {
  //   return this.feedService.getPosts();
  // }

    @Get()
    getAllPosts(): Observable<FeedPost[]> {
      return this.feedService.getAllPosts()
    }
}