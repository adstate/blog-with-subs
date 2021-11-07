import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class MakeDonateDto {
  @ApiProperty()
  @IsNotEmpty()
  sum: number;

  @ApiProperty({ required: false })
  comment: string;
}
