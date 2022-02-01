import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { IsCreatorGuard } from './guards/is-creator.guard';
import { FeedPostEntity } from './models/post.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([FeedPostEntity])],
  controllers: [FeedController],
  providers: [FeedService, IsCreatorGuard],
})
export class FeedModule {}
