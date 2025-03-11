import { ApiProperty } from '@nestjs/swagger';
import { User as UserModel } from '@prisma/client';

export class LoginUserResponseDTO {
  @ApiProperty({
    type: String,
    example: '524756c3-a956-4cb5-828d-71f3409e5f3d',
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'teste@email.com',
  })
  email: string;

  @ApiProperty({
    type: String,
    example: 'Tony Stark',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'jwt-токен-тут',
  })
  access_token: string;

  static factory(user: UserModel, token: string): LoginUserResponseDTO {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, deletedAt, password, ...newUser } = user;
    return { ...newUser, access_token: token };
  }
}
