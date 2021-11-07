import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { PublisherRepository } from './publisher.repository';
import { PublishersController } from './publishers.controller';
import { PublishersService } from './publishers.service';
import { SubscriptionRepository } from './subscription.repository';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PublisherRepository]),
    TypeOrmModule.forFeature([SubscriptionRepository]),
    AuthModule,
  ],
  controllers: [PublishersController],
  providers: [PublishersService, SubscriptionsService],
})
export class PublishersModule {}
