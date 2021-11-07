import { ApiProperty } from '@nestjs/swagger';
import { SponsorshipLevel } from '../../sponsorships/sponsorshipLevel.entity';

export class SubscribedResponse {
  @ApiProperty()
  subscribed: boolean;

  @ApiProperty({ nullable: true })
  sponsorshipLevel?: SponsorshipLevel | null;
}
