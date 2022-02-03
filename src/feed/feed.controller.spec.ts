// import { ModuleRef } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../auth/model/user.class';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UserService } from '../auth/services/user.service';

const httpMocks = require('node-mocks-http');

import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { IsCreatorGuard } from './guards/is-creator.guard';
import { FeedPost } from './models/post.Interface';

describe('FeedController', () => {
  let feedController: FeedController;
  let feedService: FeedService;
  let userService: UserService;

  const mockRequest = httpMocks.createRequest();
  mockRequest.user = new User();
  mockRequest.user.firstName = 'john';

  const mockFeedPost: FeedPost = {
    body: 'post body',
    createdAt: new Date(),
    author: mockRequest.user,
  };

  const mockFeedPosts: FeedPost[] = [
    mockFeedPost,
    {...mockFeedPost, body: "second feed post"},
    {...mockFeedPost, body: "third feed post"}
  ]

  const mockFeedService = {
    createPost: jest.fn().mockImplementation((user: User, feedPost: FeedPost) => {
      return {
        id: 1,
        ...feedPost
      }
    }),
    findPosts: jest.fn().mockImplementation(((take: number, skip: number) => {
      const feedPostsAfterSkipping = mockFeedPosts.slice(skip);
      const filteredFeedPosts = feedPostsAfterSkipping.slice(0, take);
      return filteredFeedPosts;
    }))
  };

  const mockUserService = {};

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [FeedController],
      providers: [
        FeedService,
        { provide: UserService, useValue: mockUserService },
        {
          provide: JwtGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
        {
          provide: IsCreatorGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
      ],
    })
      .overrideProvider(FeedService)
      .useValue(mockFeedService)
      .compile();
    feedService = moduleRef.get<FeedService>(FeedService);
    userService = moduleRef.get<UserService>(UserService);

    feedController = moduleRef.get<FeedController>(FeedController);
  });

  it('should be defined', () => {
    expect(FeedController).toBeDefined();
  });

  it('shoule create a feed post', () => {
    expect(feedController.create(mockFeedPost, mockRequest)).toEqual(
      {
        id: expect.any(Number),
        ...mockFeedPost
      }
    );
  });

  it('shoule create a get 2 feed posts skipping the first', () => {
    expect(feedController.getSelected(2, 1)).toEqual(mockFeedPosts.slice(1));
  });
});
