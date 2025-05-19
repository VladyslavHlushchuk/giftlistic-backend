import { ApiProperty } from '@nestjs/swagger';
import { User as UserModel } from '@prisma/client';

export class LoginUserResponseDTO {
  @ApiProperty({
    type: String,
    example: '524756c3-a956-4cb5-828d-71f3409e5f3d',
  })
  id: string;

  @ApiProperty({ type: String, example: 'tony@starkindustries.com' })
  email: string;

  @ApiProperty({ type: String, example: 'Tony Stark' })
  name: string;

  @ApiProperty({ type: String, example: 'jwt-access-token' })
  access_token: string;

  @ApiProperty({ type: String, example: 'jwt-refresh-token' })
  refresh_token: string;

  static factory(
    user: UserModel,
    tokens: { access_token: string; refresh_token: string },
  ): LoginUserResponseDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }
}
