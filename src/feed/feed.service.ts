import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { FeedPostEntity } from './models/post.entity';
import { FeedPost } from './models/post.Interface';

@Injectable()
export class FeedService {
    constructor(
        @InjectRepository(FeedPostEntity)
        private readonly feedPostRepository:Repository<FeedPostEntity>
    ) {}

    createPost(feedPost: FeedPost):Observable<FeedPost> {
        return from(this.feedPostRepository.save(feedPost))
    }

    // getPosts(): Promise<FeedPost[]> {
    //     return this.feedPostRepository.find();
    //   }
    getAllPosts():Observable<FeedPost[]> {
        return from(this.feedPostRepository.find())
    }
}