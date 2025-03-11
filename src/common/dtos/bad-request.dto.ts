import { ApiProperty } from '@nestjs/swagger';

export class BadRequestDTO {
  @ApiProperty({
    type: Number,
    description: 'Код помилки HTML.',
    example: 400,
    required: true,
  })
  statusCode: 400;

  @ApiProperty({
    type: Object,
    description: 'Відповідь API.',
    example: {
      status: 'error',
      errors: 'Bad Request',
    },
    required: true,
  })
  body: {
    status: 'error';
    errors: 'Bad Request';
  };
}
