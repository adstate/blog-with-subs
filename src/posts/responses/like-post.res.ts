import { ApiProperty } from '@nestjs/swagger';

export class LikePostResponse {
  @ApiProperty()
  success: boolean;
}
