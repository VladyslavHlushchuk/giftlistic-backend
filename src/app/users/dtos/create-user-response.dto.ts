import { ApiProperty } from '@nestjs/swagger';
import { User as UserModel } from '@prisma/client';

export class CreateUserResponseDTO {
  @ApiProperty({
    type: String,
    example: '524756c3-a956-4cb5-828d-71f3409e5f3d',
    description: 'Унікальний ідентифікатор користувача',
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'teste@email.com',
    description: 'Електронна пошта користувача',
  })
  email: string;

  @ApiProperty({
    type: String,
    example: 'Tony Stark',
    description: "Ім'я користувача",
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'jwt-токен-тут',
    description: 'JWT токен для авторизації',
  })
  access_token: string;

  static factory(user: UserModel, token: string): CreateUserResponseDTO {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, deletedAt, password, ...newUser } = user;
    return { ...newUser, access_token: token };
  }
}
