import { EntityRepository, getManager, Repository } from 'typeorm';
import { SubscribeDto } from './dto/subscribe.dto';
import { Subscription } from './subscription.entity';
import { User } from '../auth/user.entity';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Publisher } from './publisher.entity';

@EntityRepository(Subscription)
export class SubscriptionRepository extends Repository<Subscription> {
  async getSubscription(
    publisherId: number,
    user: User,
  ): Promise<Subscription> {
    const subscription = await this.findOne({
      publisher: { id: publisherId },
      user,
    });

    return subscription;
  }

  async createOrUpdateSubsciption(
    subscribeDto: SubscribeDto,
    publisherId: number,
    user: User,
  ): Promise<Subscription> {
    const { sponsorshipLevelId } = subscribeDto;

    const currentSubscription = await this.getSubscription(publisherId, user);

    if (currentSubscription) {
      const sponsorshipLevel = currentSubscription.sponsorshipLevel;
      const isEmptyLevel = !sponsorshipLevel;

      if (!sponsorshipLevelId && isEmptyLevel) {
        throw new ConflictException(
          'User is subscribed for this publisher already',
        );
      }

      if (isEmptyLevel || sponsorshipLevelId !== sponsorshipLevel.id) {
        return this.updateSubscription(subscribeDto, publisherId, user);
      } else {
        throw new ConflictException(
          'User is subscribed for this publisher already with similar sponsorship level',
        );
      }
    }

    return this.createSubscription(subscribeDto, publisherId, user);
  }

  async createSubscription(
    subscribeDto: SubscribeDto,
    publisherId: number,
    user: User,
  ) {
    const { sponsorshipLevelId } = subscribeDto;

    try {
      const subscription = this.create({
        publisher: { id: publisherId },
        user,
        sponsorshipLevel: { id: sponsorshipLevelId || null },
      });

      await this.save(subscription);

      this.incrementSubscribersCount(publisherId, subscribeDto);

      return subscription;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          'User is subscribed for this publisher already',
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async updateSubscription(
    subscribeDto: SubscribeDto,
    publisherId: number,
    user: User,
  ) {
    const { sponsorshipLevelId } = subscribeDto;

    await this.update(
      { publisher: { id: publisherId }, user },
      { sponsorshipLevel: { id: sponsorshipLevelId } },
    );

    if (!sponsorshipLevelId) {
      const entityManager = getManager();

      entityManager.decrement(
        Publisher,
        { id: publisherId },
        'sponsorsCount',
        1,
      );
    }

    return this.findOne({ publisher: { id: publisherId }, user });
  }

  async incrementSubscribersCount(
    publisherId: number,
    subscribeDto: SubscribeDto,
  ) {
    const { sponsorshipLevelId } = subscribeDto;

    if (sponsorshipLevelId) {
      await this.updateSubscribersCount(publisherId, 1, 1);
    } else {
      await this.updateSubscribersCount(publisherId, 1, 0);
    }
  }

  async updateSubscribersCount(
    publisherId: number,
    addSubcribers: number,
    addSponsors: number,
  ): Promise<void> {
    const entityManager = getManager();

    entityManager.increment(
      Publisher,
      { id: publisherId },
      'subscribersCount',
      addSubcribers,
    );
    entityManager.increment(
      Publisher,
      { id: publisherId },
      'sponsorsCount',
      addSponsors,
    );
  }

  async deleteSubscription(publisherId: number, user: User) {
    const entityManager = getManager();

    const subscription = await entityManager.findOne(Subscription, {
      publisher: { id: publisherId },
      user,
    });

    if (!subscription) {
      throw new ConflictException(`User wasn't subscribed`);
    }

    entityManager.decrement(
      Publisher,
      { id: publisherId },
      'subscribersCount',
      1,
    );

    if (subscription.sponsorshipLevel) {
      entityManager.decrement(
        Publisher,
        { id: publisherId },
        'sponsorsCount',
        1,
      );
    }

    return entityManager.remove(subscription);
  }

  async getSubscribers(publisherId: number): Promise<Subscription[]> {
    const query = this.createQueryBuilder('s')
      .leftJoinAndSelect('s.user', 'users')
      .leftJoinAndSelect('s.sponsorshipLevel', 'sl')
      .select(['s', 'users', 'sl.id', 'sl.name'])
      .where('s.publisher = :publisherId', { publisherId });

    return query.getMany();
  }

  async getSponsors(publisherId: number): Promise<Subscription[]> {
    const query = this.createQueryBuilder('s')
      .leftJoinAndSelect('s.user', 'users')
      .leftJoinAndSelect('s.sponsorshipLevel', 'sl')
      .select(['s', 'users', 'sl.id', 'sl.name'])
      .where('s.publisher = :publisherId', { publisherId })
      .andWhere('s.sponsorshipLevel is not null');

    return query.getMany();
  }

  async getSubscriptions(
    userId: number,
    isSponsor: boolean,
  ): Promise<Subscription[]> {
    const query = this.createQueryBuilder('s')
      .leftJoinAndSelect('s.publisher', 'p')
      .leftJoinAndSelect('s.sponsorshipLevel', 'sl')
      .select(['s', 'sl.id', 'sl.name', 'sl.features', 'sl.price', 'p'])
      .where('s.user = :userId', { userId });

    if (isSponsor) {
      query.andWhere('s.sponsorshipLevel is not null');
    }

    return query.getMany();
  }

  async checkSubscription(
    publisherId: number,
    user: User,
  ): Promise<Subscription> {
    const query = this.createQueryBuilder('s')
      .leftJoinAndSelect('s.sponsorshipLevel', 'sl')
      .select(['s.id', 'sl.id', 'sl.name', 'sl.features', 'sl.price'])
      .where('s.user = :userId', { userId: user.id })
      .andWhere('s.publisher = :publisherId', { publisherId });

    return query.getOne();
  }
}
