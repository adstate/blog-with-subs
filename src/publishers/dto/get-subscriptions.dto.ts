import { ApiProperty } from '@nestjs/swagger';

export class GetSubscriptionsDto {
  @ApiProperty({ required: false })
  is_sponsor: boolean;
}
