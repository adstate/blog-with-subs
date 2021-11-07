import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
import { GetUser } from './get-user.decorator';
import { UserProfileDto } from './dto/user-profile.dto';
import { SubscriptionsService } from '../publishers/subscriptions.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Subscription } from '../publishers/subscription.entity';
import { GetSubscriptionsDto } from '../publishers/dto/get-subscriptions.dto';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private subscriptionsService: SubscriptionsService,
  ) {}

  @ApiTags('Auth')
  @Get('/signin')
  @UseGuards(AuthGuard('yandex'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async yandexAuth(@Req() req) {}

  @ApiTags('Auth')
  @Get('/yandex/callback')
  @UseGuards(AuthGuard('yandex'))
  yandexAuthRedirect(@GetUser() userProfileDto: UserProfileDto, @Res() res) {
    return this.authService.signInWithYandex(userProfileDto, res);
  }

  @ApiTags('Profile')
  @ApiResponse({ type: User })
  @Get('/profile')
  @UseGuards(AuthGuard())
  getProfile(@GetUser() user: User) {
    const { id, profileId, username, email, firstName, lastName, avatar } =
      user;

    return {
      id,
      profileId,
      username,
      email,
      firstName,
      lastName,
      avatar,
    };
  }

  @ApiTags('Profile')
  @ApiResponse({ type: [Subscription] })
  @Get('/profile/subscriptions')
  @UseGuards(AuthGuard())
  getSubscriptions(
    @Query() getSubscriptionsDto: GetSubscriptionsDto,
    @GetUser() user: User,
  ): Promise<Subscription[]> {
    return this.subscriptionsService.getSubscriptions(
      user,
      getSubscriptionsDto,
    );
  }
}
