import { IsOptional, IsString } from 'class-validator';

export class CreateCorrectionDto {
  @IsString()
  field: string = '';

  @IsString()
  note: string = '';

  @IsString()
  @IsOptional()
  email: string = '';

  @IsString()
  memorialId: string = '';
}
