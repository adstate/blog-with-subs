import { IsString, MaxLength, MinLength } from 'class-validator';

export class UserProfileDto {
  profileId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  isAuthor: number;
  accessToken: string;
}
