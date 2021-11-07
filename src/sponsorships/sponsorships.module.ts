import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SponsorshipRepository } from './sponsorship.repository';
import { SponsorshipsController } from './sponsorships.controller';
import { SponsorshipsService } from './sponsorships.service';

@Module({
  imports: [TypeOrmModule.forFeature([SponsorshipRepository])],
  controllers: [SponsorshipsController],
  providers: [SponsorshipsService],
})
export class SponsorshipsModule {}
