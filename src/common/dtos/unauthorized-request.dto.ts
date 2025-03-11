import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedRequestDTO {
  @ApiProperty({
    type: Number,
    description: 'Код помилки HTML.',
    example: 401,
    required: true,
  })
  statusCode: 401;

  @ApiProperty({
    type: Object,
    description: 'Відповідь API.',
    example: {
      status: 'error',
      errors: 'Unauthorized Request',
    },
    required: true,
  })
  body: {
    status: 'error';
    errors: 'Unauthorized Request';
  };
}
