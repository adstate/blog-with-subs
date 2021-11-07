import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Donate } from '../donates/donate.entity';
import { AddDonateDto } from '../donates/dto/add-donate.dto';
import { MediaPost } from '../posts/media-post.entity';
import { AddSponsorshipDto } from '../sponsorships/dto/add-sponsorship.dto';
import { Sponsorship } from '../sponsorships/sponsorship.entity';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { GetPublisherPostsDto } from './dto/get-publisher-posts.dto';
import { Publisher } from './publisher.entity';
import { PublisherRepository } from './publisher.repository';

@Injectable()
export class PublishersService {
  constructor(
    @InjectRepository(PublisherRepository)
    private publisherRepository: PublisherRepository,
  ) {}

  getPublishers(): Promise<Publisher[]> {
    return this.publisherRepository.find();
  }

  getPublisherById(id: string): Promise<Publisher> {
    return this.publisherRepository.findOne(id);
  }

  createPublisher(createPublisherDto: CreatePublisherDto): Promise<Publisher> {
    return this.publisherRepository.createPublisherForUser(createPublisherDto);
  }

  getPublisherPosts(
    publisherId: number,
    getPublisherPostsDto: GetPublisherPostsDto,
  ): Promise<MediaPost[]> {
    return this.publisherRepository.getPublisherPosts(
      publisherId,
      getPublisherPostsDto,
    );
  }

  getPublisherSponsorPosts(publisherId: number): Promise<MediaPost[]> {
    return this.publisherRepository.getPublisherSponsorPosts(publisherId);
  }

  getSponsorships(publisherId: number): Promise<Sponsorship[]> {
    return this.publisherRepository.getSponsorships(publisherId);
  }

  getDonates(publisherId: number): Promise<Donate[]> {
    return this.publisherRepository.getDonates(publisherId);
  }

  addSponsorship(
    addSponsorshipDto: AddSponsorshipDto,
    publisher: Publisher,
  ): Promise<Sponsorship> {
    return this.publisherRepository.addSponsorship(
      addSponsorshipDto,
      publisher,
    );
  }

  addDonate(addDonateDto: AddDonateDto, publisher: Publisher): Promise<Donate> {
    return this.publisherRepository.addDonate(addDonateDto, publisher);
  }
}
