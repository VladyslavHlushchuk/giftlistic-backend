import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordRequestDTO {
  @ApiProperty({
    description: 'JWT токен для скидання паролю',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'Новий пароль користувача',
    example: 'newSecurePassword123',
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  newPassword: string;
}
