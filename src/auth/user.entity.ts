import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Publisher } from '../publishers/publisher.entity';
import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';

@Entity('users')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((_type) => Publisher, (publisher) => publisher.user, {
    eager: true,
  })
  publisher: Publisher;

  @ApiProperty()
  @Column({ unique: true })
  profileId: string;

  @ApiProperty()
  @Column({ unique: true })
  username: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @ApiProperty()
  @Column()
  avatar: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  accessToken: string;

  @CreateDateColumn()
  @Exclude({ toPlainOnly: true })
  created: Date;
}
