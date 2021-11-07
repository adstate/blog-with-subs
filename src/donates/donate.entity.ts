import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Publisher } from '../publishers/publisher.entity';
import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

@Entity('donates')
export class Donate {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @ManyToOne((_type) => Publisher)
  publisher: Publisher;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column({ default: 0 })
  currentSum: number;

  @ApiProperty()
  @Column()
  targetSum: number;

  @CreateDateColumn()
  @Exclude({ toPlainOnly: true })
  created: Date;
}
