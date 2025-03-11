import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class LoginRequestDTO {
  @ApiProperty({
    type: String,
    description: 'Електронна пошта користувача',
    example: 'tony@starkindustries.com',
    required: true,
  })
  @IsEmail({}, { message: 'Некоректний формат email' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    description: 'Пароль користувача',
    example: 'strongPassword123',
    required: true,
  })
  @IsString()
  @MinLength(8, { message: 'Пароль має містити щонайменше 8 символів' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: String,
    description: 'Токен reCAPTCHA для перевірки користувача',
    example: 'dummyTokenForDev',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  recaptchaToken: string;
}
