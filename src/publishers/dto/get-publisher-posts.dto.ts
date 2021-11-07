import { ApiProperty } from '@nestjs/swagger';

export class GetPublisherPostsDto {
  @ApiProperty({ required: false })
  is_for_sponsors: boolean;
}
