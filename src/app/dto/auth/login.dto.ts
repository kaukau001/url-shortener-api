import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email deve ser válido' })
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  password: string;
}
