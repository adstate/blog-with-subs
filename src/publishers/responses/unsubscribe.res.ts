import { ApiProperty } from '@nestjs/swagger';

export class UnsubscribeResponse {
  @ApiProperty()
  unsubscribed: boolean;
}
