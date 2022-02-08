import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
const httpMocks = require('node-mocks-http');

import { User } from '../auth/model/user.class';
import { FeedService } from './feed.service';
import { FeedPostEntity } from './models/post.entity';
import { FeedPost } from './models/post.Interface';

describe('FeedService', () => {
  let feedService: FeedService;

  const mockRequest = httpMocks.createRequest();
  mockRequest.user = new User();
  mockRequest.user.firstName = 'john';

  const mockFeedPost: FeedPost = {
    body: 'post body',
    createdAt: new Date(),
    author: mockRequest.user,
  };

  const mockFeedPostRepository = {
    createPost: jest.fn().mockImplementation((user: User, feedPost: FeedPost) => {
      return {
        ...feedPost,
        author: user
      }
    }),

    save: jest.fn().mockImplementation((feedPost: FeedPost) => Promise.resolve({id: 1, ...feedPost}))
  };


  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        FeedService,
        {
            provide: getRepositoryToken(FeedPostEntity),
            useValue: mockFeedPostRepository
        }
      ],
    })
      .compile();
    feedService = moduleRef.get<FeedService>(FeedService);
  });

  it('should be defined', () => {
    expect(feedService).toBeDefined();
  });
  // in case of async js and so on
//   it('shoule create a feed post', (done: jest.DoneCallback) => {
  it('shoule create a feed post', () => {
    feedService.createPost(mockRequest.user, mockFeedPost).subscribe((feedPost: FeedPost) => {
        expect(feedPost).toEqual({
            id: expect.any(Number),
            ...mockFeedPost
        });
        // in case of async js 
        // done();
    })
  });

//   it('shoule create a get 2 feed posts skipping the first', () => {
//     expect(feedController.getSelected(2, 1)).toEqual(mockFeedPosts.slice(1));
//   });

//   it('shoule update the feed post', () => {
//     expect(feedController.update(1, {...mockFeedPost, body: 'updated body'})).toEqual(mockUpdateResult);
//   });

//   it('shoule delete the feed post', () => {
//     expect(feedController.delete(1)).toEqual(mockDeleteResult);
//   });
});
