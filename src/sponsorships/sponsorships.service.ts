import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sponsorship } from './sponsorship.entity';
import { SponsorshipRepository } from './sponsorship.repository';
import { SponsorshipLevel } from './sponsorshipLevel.entity';

@Injectable()
export class SponsorshipsService {
  constructor(
    @InjectRepository(SponsorshipRepository)
    private sponsorshipRepository: SponsorshipRepository,
  ) {}

  async getSponsorships(): Promise<Sponsorship[]> {
    return this.sponsorshipRepository.getSponsorships();
  }

  async getSponsorshipLevels(id: number): Promise<SponsorshipLevel[]> {
    return this.sponsorshipRepository.getSponsorshipLevels(id);
  }

  async addLevel(addLevelDto, sponsorshipId): Promise<SponsorshipLevel> {
    return this.sponsorshipRepository.addSponsorshipLevel(
      addLevelDto,
      sponsorshipId,
    );
  }
}
