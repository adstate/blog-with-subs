import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MediaPost } from '../posts/media-post.entity';
import { Publisher } from './publisher.entity';
import { GetUser } from '../auth/get-user.decorator';
import { PublishersService } from './publishers.service';
import { AuthGuard } from '@nestjs/passport';
import { AddSponsorshipDto } from '../sponsorships/dto/add-sponsorship.dto';
import { Sponsorship } from '../sponsorships/sponsorship.entity';
import { AddDonateDto } from '../donates/dto/add-donate.dto';
import { Donate } from '../donates/donate.entity';
import { SubscribeDto } from './dto/subscribe.dto';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from './subscription.entity';
import { UnsubscribeResponse } from './responses/unsubscribe.res';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../auth/user.entity';
import { SubscribedResponse } from './responses/subscribed.res';
import { GetPublisherPostsDto } from './dto/get-publisher-posts.dto';

@Controller('publishers')
export class PublishersController {
  constructor(
    private publishersService: PublishersService,
    private subscriptionsService: SubscriptionsService,
  ) {}

  @ApiTags('Publishers')
  @ApiResponse({ type: [Publisher] })
  @Get()
  getPublishers(): Promise<Publisher[]> {
    return this.publishersService.getPublishers();
  }

  @ApiTags('Publishers')
  @ApiResponse({ type: Publisher })
  @Get('/:id')
  getPublisherProfile(@Param('id') id: string): Promise<Publisher> {
    return this.publishersService.getPublisherById(id);
  }

  @ApiTags('Publishers')
  @ApiBearerAuth()
  @ApiResponse({ type: Publisher })
  @UseGuards(AuthGuard())
  @Post()
  becomePublisher(@GetUser() user): Promise<Publisher> {
    return this.publishersService.createPublisher({ user });
  }

  @ApiTags('Publishers')
  @ApiResponse({ type: [MediaPost] })
  @Get('/:id/posts')
  getPublisherPosts(
    @Param('id') id: number,
    @Query() getPublisherPostsDto: GetPublisherPostsDto,
  ): Promise<MediaPost[]> {
    return this.publishersService.getPublisherPosts(id, getPublisherPostsDto);
  }

  @ApiTags('Publishers')
  @ApiResponse({ type: [MediaPost] })
  @Get('/:id/posts/for-sponsors')
  getPublisherSponsorPosts(@Param('id') id: number): Promise<MediaPost[]> {
    return this.publishersService.getPublisherSponsorPosts(id);
  }

  @ApiTags('Publishers')
  @ApiResponse({ type: [Sponsorship] })
  @Get('/:id/sponsorships')
  getSponsorships(@Param('id') id: number): Promise<Sponsorship[]> {
    return this.publishersService.getSponsorships(id);
  }

  @ApiTags('Publishers')
  @ApiResponse({ type: [Donate] })
  @Get('/:id/donates')
  getDonates(@Param('id') id: number): Promise<Donate[]> {
    return this.publishersService.getDonates(id);
  }

  @ApiTags('Publishers')
  @ApiBearerAuth()
  @ApiBody({ type: AddSponsorshipDto })
  @ApiResponse({ type: Sponsorship })
  @UseGuards(AuthGuard())
  @Post('/:id/sponsorships')
  addSponsorship(
    @Body() addSponsorshipDto: AddSponsorshipDto,
    @GetUser() user,
  ): Promise<Sponsorship> {
    return this.publishersService.addSponsorship(
      addSponsorshipDto,
      user.publisher,
    );
  }

  @ApiTags('Publishers')
  @ApiBearerAuth()
  @ApiBody({ type: AddDonateDto })
  @ApiResponse({ type: Donate })
  @UseGuards(AuthGuard())
  @Post('/:id/donates')
  addDonate(
    @Body() addDonateDto: AddDonateDto,
    @GetUser() user: User,
  ): Promise<Donate> {
    return this.publishersService.addDonate(addDonateDto, user.publisher);
  }

  @ApiTags('Subscriptions')
  @ApiBearerAuth()
  @ApiBody({ type: SubscribeDto })
  @ApiResponse({ type: Subscription })
  @UseGuards(AuthGuard())
  @Post('/:id/subscribe')
  subscribe(
    @Param('id') id: number,
    @Body() subscribeDto: SubscribeDto,
    @GetUser() user: User,
  ): Promise<Subscription> {
    return this.subscriptionsService.subscribe(subscribeDto, id, user);
  }

  @ApiTags('Subscriptions')
  @ApiBearerAuth()
  @ApiResponse({ type: UnsubscribeResponse })
  @UseGuards(AuthGuard())
  @Post('/:id/unsubscribe')
  unsubscribe(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<UnsubscribeResponse> {
    return this.subscriptionsService.unsubscribe(id, user);
  }

  @ApiTags('Subscriptions')
  @ApiResponse({ type: [Subscription] })
  @Get('/:id/subscribers')
  getSubscriptions(@Param('id') id: number): Promise<Subscription[]> {
    return this.subscriptionsService.getSubscribers(id);
  }

  @ApiTags('Subscriptions')
  @ApiResponse({ type: [Subscription] })
  @Get('/:id/sponsors')
  getSponsors(@Param('id') id: number): Promise<Subscription[]> {
    return this.subscriptionsService.getSponsors(id);
  }

  @ApiTags('Subscriptions')
  @ApiResponse({ type: [SubscribedResponse] })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('/:id/subscription/check')
  checkSubscription(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<SubscribedResponse> {
    return this.subscriptionsService.checkSubscription(id, user);
  }
}
