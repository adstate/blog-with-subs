import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '../comment.entity';

export class GetCommentsResponse extends Comment {
  @ApiProperty()
  isSponsor: boolean;
}
