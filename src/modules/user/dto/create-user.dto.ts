import { IsEmail, IsEnum, IsString } from 'class-validator';
import { UserRole } from '../../../generated/prisma/enums';

export class CreateUserDto {
  @IsString()
  firstName: string = '';

  @IsString()
  lastName: string = '';

  @IsEmail()
  email: string = '';

  @IsString()
  organizationId: string = '';

  @IsEnum(UserRole)
  role: UserRole = UserRole.USER;

  @IsString()
  profilePicture?: string;

  @IsString()
  password: string = '';
}
