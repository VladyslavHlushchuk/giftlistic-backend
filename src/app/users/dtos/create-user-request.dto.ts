import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, IsEmail } from 'class-validator';

export class CreateUserRequestDTO {
  @ApiProperty({
    type: String,
    description: 'Електронна пошта користувача',
    name: 'email',
    example: 'example@gmail.com',
    required: true,
  })
  @IsEmail({}, { message: 'Некоректний формат email' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    description: "Ім'я користувача",
    name: 'name',
    example: 'Tony Stark',
    required: true,
  })
  @MinLength(3, { message: "Ім'я має містити щонайменше 3 символи" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    description: 'Пароль користувача',
    name: 'password',
    example: '##7654password',
    required: true,
  })
  @MinLength(8, { message: 'Пароль має містити щонайменше 8 символів' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
