import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User } from '../auth/user.entity';
import { MediaPost } from '../posts/media-post.entity';
import { Publisher } from '../publishers/publisher.entity';
import {
  Column,
  Entity,
  CreateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { SponsorshipLevel } from './sponsorshipLevel.entity';

@Entity('sponsorships')
export class Sponsorship {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((_type) => Publisher)
  publisher: Publisher;

  @OneToMany(
    (_type) => SponsorshipLevel,
    (sponsorshipLevel) => sponsorshipLevel.sponsorship,
    { eager: false },
  )
  sponsorshipLevels: SponsorshipLevel[];

  @ApiProperty()
  @Column({ nullable: true })
  title: string;

  @ApiProperty()
  @Column()
  preview: string;

  @ApiProperty()
  @Column()
  description: string;

  @CreateDateColumn()
  @Exclude({ toPlainOnly: true })
  created: Date;
}
