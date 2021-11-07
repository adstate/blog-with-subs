import { EntityRepository, Repository, getManager } from 'typeorm';
import { AddLevelDto } from './dto/add-level.dto';
import { Sponsorship } from './sponsorship.entity';
import { SponsorshipLevel } from './sponsorshipLevel.entity';

@EntityRepository(Sponsorship)
export class SponsorshipRepository extends Repository<Sponsorship> {
  async getSponsorships(): Promise<Sponsorship[]> {
    const query = await this.createQueryBuilder('s').leftJoinAndSelect(
      's.publisher',
      'publishers',
    );

    return query.getMany();
  }

  async addSponsorship({ preview, description, publisherId }) {
    const sponsorship = await this.create({
      preview,
      description,
      publisher: { id: publisherId },
    });

    await this.save(sponsorship);

    return sponsorship;
  }

  async getSponsorshipLevels(
    sponsorshipId: number,
  ): Promise<SponsorshipLevel[]> {
    const entityManager = getManager();

    const query = await entityManager
      .createQueryBuilder(SponsorshipLevel, 'l')
      .where('l.sponsorship = :sponsorshipId', { sponsorshipId });

    return query.getMany();
  }

  async addSponsorshipLevel(
    addLevelDto: AddLevelDto,
    sponsorshipId: number,
  ): Promise<SponsorshipLevel> {
    const { name, description, price } = addLevelDto;
    const entityManager = getManager();

    const sponsorship = await entityManager.create(SponsorshipLevel, {
      name,
      description,
      price,
      sponsorship: { id: sponsorshipId },
    });

    await entityManager.save(sponsorship);

    return sponsorship;
  }
}
