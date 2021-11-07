import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddSponsorshipDto {
  @ApiProperty()
  @IsNotEmpty()
  preview: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;
}
