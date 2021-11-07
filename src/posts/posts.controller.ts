import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MediaPost } from './media-post.entity';
import { Comment } from './comment.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { Logger } from '@nestjs/common';
import { GetPostsDto } from './dto/get-posts.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { AddCommentDto } from './dto/add-comment.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LikePostResponse } from './responses/like-post.res';
import { ApplyUser } from '../auth/apply-user.guard';
import { GetCommentsResponse } from './responses/get-comments.res';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  private logger = new Logger('PostsController');

  constructor(private postService: PostsService) {}

  @ApiResponse({ type: [MediaPost] })
  @UseGuards(ApplyUser)
  @Get()
  getPosts(
    @Query() getPostsDto: GetPostsDto,
    @GetUser() user: User | null,
  ): Promise<MediaPost[]> {
    return this.postService.getPosts(getPostsDto, user);
  }

  @ApiResponse({ type: MediaPost })
  @Get('/:id')
  getPostById(@Param('id') id: number): Promise<MediaPost> {
    return this.postService.getPostById(id);
  }

  @ApiBearerAuth()
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({ type: MediaPost })
  @UseGuards(AuthGuard())
  @Post()
  createPost(
    @Body() createPostDto: CreatePostDto,
    @GetUser() user: User,
  ): Promise<MediaPost> {
    return this.postService.createPost(createPostDto, user);
  }

  @ApiResponse({ type: [GetCommentsResponse] })
  @Get('/:id/comments')
  getComments(@Param('id') id: number): Promise<GetCommentsResponse[]> {
    return this.postService.getComments(id);
  }

  @ApiBearerAuth()
  @ApiBody({ type: AddCommentDto })
  @ApiResponse({ type: Comment })
  @UseGuards(AuthGuard())
  @Post('/:id/comments')
  addComment(
    @Param('id') id: number,
    @Body() addCommentDto: AddCommentDto,
    @GetUser() user: User,
  ): Promise<Comment> {
    return this.postService.addComment(addCommentDto, id, user);
  }

  @ApiBearerAuth()
  @ApiResponse({ type: LikePostResponse })
  @UseGuards(AuthGuard())
  @Post('/:id/like')
  likePost(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<LikePostResponse> {
    return this.postService.likePost(id, user);
  }

  @ApiBearerAuth()
  @ApiResponse({ type: LikePostResponse })
  @UseGuards(AuthGuard())
  @Post('/:id/dislike')
  dislikePost(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<LikePostResponse> {
    return this.postService.dislikePost(id, user);
  }
}
