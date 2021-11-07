import { ApiProperty } from '@nestjs/swagger';

export class SubscribeDto {
  @ApiProperty({ required: false })
  sponsorshipLevelId: number;
}
