import { EntityRepository, getManager, Repository } from 'typeorm';
import { Publisher } from './publisher.entity';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { AddSponsorshipDto } from '../sponsorships/dto/add-sponsorship.dto';
import { Sponsorship } from '../sponsorships/sponsorship.entity';
import { MediaPost } from '../posts/media-post.entity';
import { AddDonateDto } from '../donates/dto/add-donate.dto';
import { Donate } from '../donates/donate.entity';
import { GetPublisherPostsDto } from './dto/get-publisher-posts.dto';

@EntityRepository(Publisher)
export class PublisherRepository extends Repository<Publisher> {
  async createPublisherForUser(
    createPublisherDto: CreatePublisherDto,
  ): Promise<Publisher> {
    const { user } = createPublisherDto;

    const publisher = this.create({
      name: `${user.firstName} ${user.lastName}`,
      avatar: user.avatar,
      user,
    });

    await this.save(publisher);
    return publisher;
  }

  getPublisherById(id: string) {
    return this.createQueryBuilder('publishers')
      .select('user.id as userId', 'publishers.*')
      .leftJoinAndSelect('publishers.user', 'users')
      .where('publisher.id = :publisherId')
      .setParameter('publisherId', id)
      .getOne();
  }

  async getPublisherPosts(
    id: number,
    getPublisherPostsDto: GetPublisherPostsDto,
  ): Promise<MediaPost[]> {
    const entityManager = getManager();
    const { is_for_sponsors } = getPublisherPostsDto;

    const query = await entityManager
      .createQueryBuilder(MediaPost, 'posts')
      .select([
        'posts.id',
        'posts.title',
        'posts.previewContent',
        'posts.mediaType',
        'posts.mediaUrl',
        'posts.created',
        'posts.isForSponsors',
      ])
      .where('posts.publisher = :id', { id });

    if (is_for_sponsors) {
      query.andWhere('posts.isForSponsors = true');
    } else {
      query.andWhere(
        '(posts.isForSponsors = false or posts.isForSponsors is null)',
      );
    }

    return query.getMany();
  }

  async getPublisherSponsorPosts(id: number): Promise<MediaPost[]> {
    const entityManager = getManager();

    const query = await entityManager
      .createQueryBuilder(MediaPost, 'posts')
      .select([
        'posts.id',
        'posts.title',
        'posts.previewContent',
        'posts.mediaType',
        'posts.mediaUrl',
        'posts.created',
        'posts.isForSponsors',
      ])
      .where('posts.publisher = :id', { id })
      .andWhere('posts.isForSponsors = true');

    return query.getMany();
  }

  async getSponsorships(publisherId: number): Promise<Sponsorship[]> {
    const entityManager = getManager();

    const sponsorships = await entityManager.find(Sponsorship, {
      publisher: { id: publisherId },
    });

    return sponsorships;
  }

  async getDonates(publisherId: number): Promise<Donate[]> {
    const entityManager = getManager();

    const donates = await entityManager.find(Donate, {
      publisher: { id: publisherId },
    });

    return donates;
  }

  async addSponsorship(
    addSponsorshipDto: AddSponsorshipDto,
    publisher: Publisher,
  ) {
    const { preview, description } = addSponsorshipDto;
    const entityManager = getManager();

    const sponsorship = await entityManager.create(Sponsorship, {
      preview,
      description,
      publisher,
    });

    await entityManager.save(sponsorship);

    return sponsorship;
  }

  async addDonate(addDonateDto: AddDonateDto, publisher: Publisher) {
    const { description, targetSum } = addDonateDto;
    const entityManager = getManager();

    const donate = await entityManager.create(Donate, {
      description,
      targetSum,
      publisher,
    });

    await entityManager.save(donate);

    return donate;
  }
}
