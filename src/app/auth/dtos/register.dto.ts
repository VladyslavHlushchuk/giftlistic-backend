import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    type: String,
    description: "Ім'я користувача",
    example: 'Tony Stark',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    description: 'Електронна пошта користувача',
    example: 'tony@starkindustries.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    description: 'Пароль користувача (мінімум 8 символів)',
    example: 'strongPassword123',
  })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: String,
    description: 'Токен reCAPTCHA для перевірки користувача',
    example: 'dummyTokenForDev',
  })
  @IsString()
  @IsNotEmpty()
  recaptchaToken: string;
}
