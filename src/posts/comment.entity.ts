import { ApiProperty } from '@nestjs/swagger';
import { User } from '../auth/user.entity';
import {
  Column,
  Entity,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MediaPost } from './media-post.entity';

@Entity('comments')
export class Comment {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((_type) => MediaPost, (post) => post.comments, {
    eager: false,
  })
  post: MediaPost;

  @ApiProperty()
  @ManyToOne((_type) => User)
  user: User;

  @ApiProperty()
  @Column()
  comment: string;

  @ApiProperty()
  @Column({ default: 0 })
  likes: number;

  @ApiProperty()
  @Column({ default: 0 })
  dislikes: number;

  @ApiProperty()
  @CreateDateColumn()
  created: Date;
}
