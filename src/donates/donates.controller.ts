import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';
import { Donate } from './donate.entity';
import { DonatesService } from './donates.service';
import { MakeDonateDto } from './dto/make-donate.dto';

@ApiTags('Donates')
@Controller('donates')
export class DonatesController {
  constructor(private donatesService: DonatesService) {}

  @ApiResponse({ type: [Donate] })
  @Get()
  getDonates(): Promise<Donate[]> {
    return this.donatesService.getDonates();
  }

  @ApiBearerAuth()
  @ApiResponse({ type: Donate })
  @UseGuards(AuthGuard())
  @Post('/:id')
  makeDonate(
    @Param('id') id: number,
    @Body() makeDonateDto: MakeDonateDto,
    @GetUser() user,
  ) {
    return this.donatesService.makeDonate(makeDonateDto, id, user);
  }
}
