import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User } from '../auth/user.entity';
import { MediaPost } from '../posts/media-post.entity';
import {
  Column,
  Entity,
  CreateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('publishers')
export class Publisher {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((_type) => User, (user) => user.publisher)
  @JoinColumn()
  @Exclude({ toPlainOnly: true })
  user: User;

  @OneToMany((_type) => MediaPost, (post) => post.publisher, { eager: false })
  posts: MediaPost[];

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  avatar: string;

  @ApiProperty()
  @Column({ default: 0 })
  subscribersCount: number;

  @ApiProperty()
  @Column({ default: 0 })
  sponsorsCount: number;

  @CreateDateColumn()
  @Exclude({ toPlainOnly: true })
  created: Date;
}
