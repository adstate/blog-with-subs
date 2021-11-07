import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { User } from '../../auth/user.entity';

export class CreatePublisherDto {
  @ApiProperty()
  @IsNotEmpty()
  user: User;
}
