import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl, IsIn } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  previewContent: string;

  @ApiProperty()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ enum: ['image', 'video'] })
  @IsNotEmpty()
  @IsIn(['image', 'video'])
  mediaType: string;

  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  mediaUrl: string;

  @ApiProperty()
  isForSponsors: boolean;
}
