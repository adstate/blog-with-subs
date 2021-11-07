import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { GetSubscriptionsDto } from './dto/get-subscriptions.dto';
import { SubscribeDto } from './dto/subscribe.dto';
import { SubscribedResponse } from './responses/subscribed.res';
import { UnsubscribeResponse } from './responses/unsubscribe.res';
import { Subscription } from './subscription.entity';
import { SubscriptionRepository } from './subscription.repository';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(SubscriptionRepository)
    private subscriptionRepository: SubscriptionRepository,
  ) {}

  async subscribe(
    subscribeDto: SubscribeDto,
    publisherId: number,
    user: User,
  ): Promise<Subscription> {
    const subscription =
      await this.subscriptionRepository.createOrUpdateSubsciption(
        subscribeDto,
        publisherId,
        user,
      );

    return subscription;
  }

  async unsubscribe(
    publisherId: number,
    user: User,
  ): Promise<UnsubscribeResponse> {
    await this.subscriptionRepository.deleteSubscription(publisherId, user);

    return { unsubscribed: true };
  }

  async getSubscribers(publisherId: number): Promise<Subscription[]> {
    return this.subscriptionRepository.getSubscribers(publisherId);
  }

  async getSponsors(publisherId: number): Promise<Subscription[]> {
    return this.subscriptionRepository.getSponsors(publisherId);
  }

  async getSubscriptions(
    user: User,
    getSubscriptionsDto?: GetSubscriptionsDto,
  ): Promise<Subscription[]> {
    const { is_sponsor } = getSubscriptionsDto;

    return this.subscriptionRepository.getSubscriptions(user.id, is_sponsor);
  }

  async checkSubscription(
    publisherId: number,
    user: User,
  ): Promise<SubscribedResponse> {
    const subscription = await this.subscriptionRepository.checkSubscription(
      publisherId,
      user,
    );

    if (!subscription) {
      return {
        subscribed: false,
      };
    }

    return {
      subscribed: true,
      sponsorshipLevel: subscription.sponsorshipLevel,
    };
  }
}
