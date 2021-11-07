import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { YandexStrategy } from './yandex.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SubscriptionsService } from '../publishers/subscriptions.service';
import { SubscriptionRepository } from '../publishers/subscription.repository';
import { ApplyUser } from './apply-user.guard';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '10d',
        },
      }),
    }),
    TypeOrmModule.forFeature([UsersRepository]),
    TypeOrmModule.forFeature([SubscriptionRepository]),
  ],
  exports: [
    YandexStrategy,
    JwtStrategy,
    PassportModule,
    AuthService,
    ApplyUser,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    YandexStrategy,
    JwtStrategy,
    SubscriptionsService,
    ApplyUser,
  ],
})
export class AuthModule {}
