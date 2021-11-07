import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { DonateRepository } from './donate.repository';
import { DonateHistory } from './donateHistory.entity';
import { MakeDonateDto } from './dto/make-donate.dto';

@Injectable()
export class DonatesService {
  constructor(
    @InjectRepository(DonateRepository)
    private donateRepository: DonateRepository,
  ) {}

  getDonates() {
    return this.donateRepository.getDonates();
  }

  async makeDonate(
    makeDonateDto: MakeDonateDto,
    donateId: number,
    user: User,
  ): Promise<DonateHistory> {
    const donateHistory = await this.donateRepository.makeDonate(
      makeDonateDto,
      donateId,
      user,
    );

    await this.donateRepository.updateDonateCurrentSum(
      donateId,
      makeDonateDto.sum,
    );

    return donateHistory;
  }
}
