import { IsString } from 'class-validator';

export class CreateMemoryDto {
  @IsString()
  name: string = '';

  @IsString()
  message: string = '';

  @IsString()
  memorialId: string = '';
}
