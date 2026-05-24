import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthDataDto {
  @IsString()
  userId?: string = '';

  @IsString()
  username?: string = '';

  @IsString()
  password?: string = '';

  @IsString()
  @IsOptional()
  ip?: string = '';

  @IsString()
  @IsOptional()
  userAgent?: string = '';

  @IsOptional()
  meta?: any = '';
}
