import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { User } from 'src/auth/model/user.interface';
import { Repository, UpdateResult } from 'typeorm';
import { FeedPostEntity } from './models/post.entity';
import { FeedPost } from './models/post.Interface';

@Injectable()
export class FeedService {
    constructor(
        @InjectRepository(FeedPostEntity)
        private readonly feedPostRepository: Repository<FeedPostEntity>
    ) { }

    createPost(user: User, feedPost: FeedPost): Observable<FeedPost> {
        feedPost.author = user;
        return from(this.feedPostRepository.save(feedPost))
    }

    getSinglePost(id: number): Observable<FeedPost> {
        return from(this.feedPostRepository.findOne({id}, {relations: ['author']}))
    }

    // pagination
    getSelectedPosts(take:number = 10, skip: number = 0): Observable<FeedPost[]> {
        return from (this.feedPostRepository.findAndCount({take, skip}).then(([posts]) => {
            // console.log("posts", [...posts])
            // or with from 
            return <FeedPost[]> posts
        }))
    }
    findAllPosts(): Observable<FeedPost[]> {
        return from(this.feedPostRepository.find());
    }

    updatePost(id: number, feedPost: FeedPost): Observable<UpdateResult> {
        return from(this.feedPostRepository.update(id, feedPost))
    }

    deletePost(id: number) {
        return from(this.feedPostRepository.delete(id))
    }
}