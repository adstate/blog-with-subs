import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddLevelDto } from './dto/add-level.dto';
import { Sponsorship } from './sponsorship.entity';
import { SponsorshipLevel } from './sponsorshipLevel.entity';
import { SponsorshipsService } from './sponsorships.service';

@ApiTags('Sponsorships')
@Controller('sponsorships')
export class SponsorshipsController {
  constructor(private sponsorshipsService: SponsorshipsService) {}

  @ApiResponse({ type: [Sponsorship] })
  @Get()
  getSponsorships(): Promise<Sponsorship[]> {
    return this.sponsorshipsService.getSponsorships();
  }

  @ApiResponse({ type: [SponsorshipLevel] })
  @Get('/:id/levels')
  getSponsorshipLevels(@Param('id') id: number): Promise<SponsorshipLevel[]> {
    return this.sponsorshipsService.getSponsorshipLevels(id);
  }

  @ApiResponse({ type: Sponsorship })
  @Post('/:id/levels')
  addSponsorshipLevel(
    @Param('id') id: number,
    @Body() addLevelDto: AddLevelDto,
  ): Promise<SponsorshipLevel> {
    return this.sponsorshipsService.addLevel(addLevelDto, id);
  }
}
