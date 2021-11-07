import {
  EntityRepository,
  Repository,
  getManager,
  UpdateResult,
} from 'typeorm';
import { MediaPost } from './media-post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsDto } from './dto/get-posts.dto';
import { User } from '../auth/user.entity';
import { AddCommentDto } from './dto/add-comment.dto';
import { Comment } from './comment.entity';
import { Subscription } from '../publishers/subscription.entity';

@EntityRepository(MediaPost)
export class PostsRepository extends Repository<MediaPost> {
  async getPosts(
    getPostsDto: GetPostsDto,
    user: User | null,
  ): Promise<MediaPost[]> {
    const { offset, limit } = getPostsDto;

    let postsQuery = this.createQueryBuilder('posts')
      .leftJoinAndSelect('posts.publisher', 'publishers')
      .select([
        'posts.id',
        'posts.title',
        'posts.previewContent',
        'posts.mediaType',
        'posts.mediaUrl',
        'posts.likes',
        'posts.isForSponsors',
        'posts.created',
        'publishers',
      ])
      .where('(posts.isForSponsors = false or posts.isForSponsors is null)');

    if (user) {
      postsQuery = this.createQueryBuilder('posts')
        .leftJoinAndSelect('posts.publisher', 'publishers')
        .leftJoinAndSelect(
          'subscriptions',
          's',
          `s.publisher = posts.publisher and s.user = ${user.id}`,
        )
        .select([
          'posts.id',
          'posts.title',
          'posts.previewContent',
          'posts.mediaType',
          'posts.mediaUrl',
          'posts.likes',
          'posts.isForSponsors',
          'posts.created',
          'publishers',
          's.id',
        ])
        .where(
          '(posts.isForSponsors = false or posts.isForSponsors is null) or (posts.isForSponsors and s.id is not null)',
        );
    }

    postsQuery.skip(offset).take(limit);

    return postsQuery.getMany();
  }

  async createPost(
    createPostDto: CreatePostDto,
    user: User,
  ): Promise<MediaPost> {
    const {
      title,
      previewContent,
      content,
      mediaType,
      mediaUrl,
      isForSponsors,
    } = createPostDto;

    const post = this.create({
      title,
      previewContent,
      content,
      mediaType,
      mediaUrl,
      publisher: user.publisher,
      isForSponsors,
    });

    await this.save(post);
    return post;
  }

  async getComments(postId: number): Promise<Comment[]> {
    const entityManager = getManager();

    const commentsQuery = entityManager
      .createQueryBuilder(Comment, 'c')
      .innerJoinAndSelect('c.user', 'u')
      .leftJoinAndSelect('c.post', 'posts')
      .leftJoinAndSelect('posts.publisher', 'p')
      .leftJoinAndMapOne(
        'c.subs',
        Subscription,
        's',
        `s.publisher = posts.publisher and s.user = c.user`,
      )
      .select(['c', 'u', 's.id'])
      .where('c.post = :postId', { postId })
      .orderBy('CASE WHEN s.id is not null THEN 0 ELSE 1 END', 'ASC')
      .addOrderBy('c.created', 'DESC');

    return commentsQuery.getMany();
  }

  async addComment(
    addCommentDto: AddCommentDto,
    postId: number,
    user: User,
  ): Promise<Comment> {
    const { comment: text } = addCommentDto;

    const entityManager = getManager();
    const comment = entityManager.create(Comment, {
      post: { id: postId },
      user: { id: user.id },
      comment: text,
    });

    await entityManager.save(comment);
    return comment;
  }

  async likePost(postId: number, user: User): Promise<UpdateResult> {
    return this.increment({ id: postId }, 'likes', 1);
  }

  async dislikePost(postId: number, user: User) {
    return this.decrement({ id: postId }, 'likes', 1);
  }
}
