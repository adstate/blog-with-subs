import {
  Column,
  Entity,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Publisher } from '../publishers/publisher.entity';
import { Comment } from './comment.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('posts')
export class MediaPost {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @ManyToOne((_type) => Publisher, (publisher) => publisher.posts, {
    eager: true,
  })
  publisher: Publisher;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  previewContent: string;

  @ApiProperty({ required: false })
  @Column()
  content: string;

  @ApiProperty()
  @Column()
  mediaType: string;

  @ApiProperty()
  @Column()
  mediaUrl: string;

  @ApiProperty()
  @Column({ default: 0 })
  likes: number;

  @ApiProperty()
  @Column({ nullable: true })
  isForSponsors: boolean;

  @CreateDateColumn()
  created: Date;

  @OneToMany((_type) => Comment, (comment) => comment.post, { eager: false })
  comments: Comment[];
}
