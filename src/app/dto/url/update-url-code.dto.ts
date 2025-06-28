import { IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class UpdateUrlCodeDto {
  @IsNotEmpty({ message: 'Original code is required' })
  @IsString({ message: 'Original code must be a string' })
  @MinLength(1, { message: 'Original code cannot be empty' })
  @MaxLength(6, { message: 'Original code is too long' })
  originalCode: string;

  @IsNotEmpty({ message: 'New code is required' })
  @IsString({ message: 'New code must be a string' })
  @MinLength(3, { message: 'New code must be at least 3 characters long' })
  @MaxLength(6, { message: 'New code must be at most 6 characters long' })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'New code can only contain letters, numbers, hyphens and underscores',
  })
  newCode: string;
}
