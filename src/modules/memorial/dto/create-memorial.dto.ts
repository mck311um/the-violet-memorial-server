import { IsString } from 'class-validator';

export class CreateMemorialDto {
  @IsString()
  id: string = '';

  @IsString()
  name: string = '';

  @IsString()
  category: string = '';

  @IsString()
  countryId: string = '';

  @IsString()
  dateOfDeath: string = '';

  @IsString()
  dateOfBirth: string = '';

  @IsString()
  occupation: string = '';

  @IsString()
  remembrance: string = '';

  @IsString()
  about: string = '';

  @IsString()
  potraitUrl: string = '';
}

export class CreateMemorialSuggestionDto {
  @IsString()
  name: string = '';

  @IsString()
  country: string = '';

  @IsString()
  message: string = '';
}
