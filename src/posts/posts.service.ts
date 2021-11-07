import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsRepository } from './posts.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { MediaPost } from './media-post.entity';
import { GetPostsDto } from './dto/get-posts.dto';
import { User } from '../auth/user.entity';
import { AddCommentDto } from './dto/add-comment.dto';
import { Comment } from './comment.entity';
import { LikePostResponse } from './responses/like-post.res';
import { GetCommentsResponse } from './responses/get-comments.res';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsRepository)
    private postsRepository: PostsRepository,
  ) {}

  getPosts(getPostsDto: GetPostsDto, user: User | null): Promise<MediaPost[]> {
    return this.postsRepository.getPosts(getPostsDto, user);
  }

  async getPostById(id: number): Promise<MediaPost> {
    const found = await this.postsRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }

    return found;
  }

  createPost(createPostDto: CreatePostDto, user: User): Promise<MediaPost> {
    return this.postsRepository.createPost(createPostDto, user);
  }

  async getComments(postId: number): Promise<GetCommentsResponse[]> {
    const comments = await this.postsRepository.getComments(postId);

    return comments.map((comment) => {
      const res: GetCommentsResponse = {
        ...comment,
        isSponsor: comment['subs'] ? true : false,
      };

      return res;
    });
  }

  async addComment(
    addCommentDto: AddCommentDto,
    postId: number,
    user: User,
  ): Promise<Comment> {
    return this.postsRepository.addComment(addCommentDto, postId, user);
  }

  async likePost(postId: number, user: User): Promise<LikePostResponse> {
    const result = await this.postsRepository.likePost(postId, user);

    return {
      success: result.affected > 0,
    };
  }

  async dislikePost(postId: number, user: User): Promise<LikePostResponse> {
    const result = await this.postsRepository.dislikePost(postId, user);

    return {
      success: result.affected > 0,
    };
  }
}
