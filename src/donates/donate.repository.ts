import { EntityRepository, getManager, Repository } from 'typeorm';
import { Donate } from './donate.entity';
import { Publisher } from '../publishers/publisher.entity';
import { MakeDonateDto } from './dto/make-donate.dto';
import { DonateHistory } from './donateHistory.entity';
import { User } from '../auth/user.entity';

@EntityRepository(Donate)
export class DonateRepository extends Repository<Donate> {
  async getDonates(): Promise<Donate[]> {
    const query = await this.createQueryBuilder('d').leftJoinAndSelect(
      'd.publisher',
      'publishers',
    );

    return query.getMany();
  }

  async makeDonate(
    makeDonateDto: MakeDonateDto,
    donateId: number,
    user: User,
  ): Promise<DonateHistory> {
    const { sum, comment } = makeDonateDto;
    const entityManager = getManager();

    const donateHistory = await entityManager.create(DonateHistory, {
      sum,
      comment,
      donate: { id: donateId },
      user,
    });

    await entityManager.save(donateHistory);

    return donateHistory;
  }

  async updateDonateCurrentSum(donateId: number, sum: number): Promise<void> {
    const donate = await this.findOne(donateId);

    donate.currentSum += sum;

    await this.save(donate);
  }
}
