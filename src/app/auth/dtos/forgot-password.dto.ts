import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDTO {
  @ApiProperty({
    description: 'Електронна пошта користувача для відновлення паролю',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Некоректний формат email' })
  @IsNotEmpty()
  email: string;
}
