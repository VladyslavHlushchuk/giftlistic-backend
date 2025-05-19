import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({
    description: 'Організатор події',
    required: false,
    nullable: true,
    example: {
      id: '524756c3-a956-4cb5-828d-71f3409e5f3d',
      name: 'Оксана',
    },
  })
  host?: { id: string; name: string } | null;

  @ApiProperty({
    type: [Object],
    required: false,
    description: 'Список подарунків до події (може бути порожній)',
    default: [],
  })
  gifts?: any[];

  static factory(event: any): CreateEventResponseDTO {
    return {
      id: event.id,
      name: event.name,
      type: event.type,
      date: event.date,
      host: event.host ? { id: event.host.id, name: event.host.name } : null,
      gifts: event.gifts ?? [],
    };
  }
}
