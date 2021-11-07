import { Exclude } from 'class-transformer';
import { User } from '../auth/user.entity';
import { Publisher } from '../publishers/publisher.entity';
import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Donate } from './donate.entity';

@Entity('donate_history')
export class DonateHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((_type) => Donate)
  donate: Donate;

  @ManyToOne((_type) => User)
  user: User;

  @Column()
  sum: number;

  @Column({ nullable: true })
  comment: string;

  @CreateDateColumn()
  @Exclude({ toPlainOnly: true })
  created: Date;
}
