import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DonateRepository } from './donate.repository';
import { DonatesController } from './donates.controller';
import { DonatesService } from './donates.service';

@Module({
  imports: [TypeOrmModule.forFeature([DonateRepository]), AuthModule],
  controllers: [DonatesController],
  providers: [DonatesService],
})
export class DonatesModule {}
