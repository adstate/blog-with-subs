import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from './users.repository';
import { UserProfileDto } from './dto/user-profile.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(
    userProfileDto: UserProfileDto,
    @Res() res: Response,
  ): Promise<void> {
    const { username, email } = userProfileDto;

    const accessToken: string = this.jwtService.sign({
      username,
      email,
    });

    res
      .cookie('access_token', accessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 240),
      })
      .redirect(`${this.configService.get('CLIENT_AUTH_SUCCESS')}`);
  }

  async signInWithYandex(userProfileDto: UserProfileDto, @Res() res) {
    try {
      if (!userProfileDto) throw new BadRequestException();

      const user = await this.usersRepository.findOne({
        username: userProfileDto.username,
      });

      if (!user) {
        await this.usersRepository.createUser(userProfileDto);
      }

      this.signIn(userProfileDto, res);
    } catch (e) {
      res.redirect(this.configService.get('CLIENT_AUTH_FAILURE'));
    }
  }

  async createUser(userProfileDto: UserProfileDto): Promise<User> {
    return this.usersRepository.createUser(userProfileDto);
  }
}
