import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email deve ser válido' })
  email: string;

  @Matches(
    // (?=.*[a-z]) - pelo menos 1 letra minúscula
    // (?=.*[A-Z]) - pelo menos 1 letra maiúscula
    // (?=.*\d) - pelo menos 1 dígito
    // (?=.*[$*&@#]) - pelo menos 1 símbolo específico
    // {6,} - mínimo 8 caracteres
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$*&@#])[A-Za-z\d$*&@#]{6,}$/,
    {
      message:
        'Senha deve conter pelo menos: 6 caracteres, 1 letra maiúscula, 1 letra minúscula, 1 número e 1 símbolo ($*&@#)',
    }
  )
  password: string;
}
