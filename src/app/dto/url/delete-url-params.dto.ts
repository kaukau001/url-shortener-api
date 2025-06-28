import { IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class DeleteUrlParamsDto {
  @IsNotEmpty({ message: 'Code is required' })
  @IsString({ message: 'Code must be a string' })
  @MinLength(3, { message: 'Code must be at least 3 characters long' })
  @MaxLength(6, { message: 'Code must be at most 6 characters long' })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Code can only contain letters, numbers, hyphens and underscores',
  })
  code!: string;
}
