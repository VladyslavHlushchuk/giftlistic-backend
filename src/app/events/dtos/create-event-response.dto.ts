import { ApiProperty } from '@nestjs/swagger';
import { Event as EventModel } from '@prisma/client';

export class CreateEventResponseDTO {
  @ApiProperty({
    type: String,
    description: 'Унікальний ідентифікатор події',
    example: '524756c3-a956-4cb5-828d-71f3409e5f3d',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'Назва події',
    example: 'Весілля Івана та Марії',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'Тип події',
    example: 'WEDDING',
  })
  type: string;

  @ApiProperty({
    type: Date,
    description: 'Дата проведення події',
    example: '2024-06-15',
  })
  date: Date;

  static factory(event: EventModel) {
    return {
      id: event.id,
      name: event.name,
      type: event.type,
      date: event.date,
    };
  }
}
