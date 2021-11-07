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
import { Sponsorship } from './sponsorship.entity';

@Entity('sponsorship_levels')
export class SponsorshipLevel {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    (_type) => Sponsorship,
    (sponsorship) => sponsorship.sponsorshipLevels,
  )
  sponsorship: Sponsorship;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column('simple-json', { nullable: true })
  features: string[];

  @ApiProperty()
  @Column()
  price: number;

  @CreateDateColumn()
  @Exclude({ toPlainOnly: true })
  created: Date;
}
