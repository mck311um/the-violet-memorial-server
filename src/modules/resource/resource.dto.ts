import { IsOptional, IsString } from 'class-validator';

export class ResourceDto {
  @IsString()
  @IsOptional()
  id: string = '';

  @IsString()
  name: string = '';

  @IsString()
  phoneNumber: string = '';

  @IsString()
  email: string = '';

  @IsString()
  region: string = '';

  @IsString()
  url: string = '';
}
