import { IsUrl, IsNotEmpty } from 'class-validator';

export class CreateUrlDto {
  @IsUrl({}, { message: 'URL deve ser válida' })
  @IsNotEmpty({ message: 'URL é obrigatória' })
  originalUrl: string;
}
