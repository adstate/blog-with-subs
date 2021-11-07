import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Publisher } from './publisher.entity';
import { User } from '../auth/user.entity';
import { SponsorshipLevel } from '../sponsorships/sponsorshipLevel.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('subscriptions')
@Unique('UQ_PUBLISHER_SUBSCRIBER', ['publisher', 'user', 'sponsorshipLevel'])
export class Subscription {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ required: false })
  @ManyToOne((_type) => Publisher)
  publisher: Publisher;

  @ApiProperty({ required: false })
  @ManyToOne((_type) => User)
  user: User;

  @ApiProperty()
  @ManyToOne((_type) => SponsorshipLevel, { eager: true })
  sponsorshipLevel: SponsorshipLevel;

  @CreateDateColumn()
  created: Date;
}
