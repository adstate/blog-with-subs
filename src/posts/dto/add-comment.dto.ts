import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddCommentDto {
  @ApiProperty()
  @IsNotEmpty()
  comment: string;
}
