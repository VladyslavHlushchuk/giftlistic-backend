import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { EventType } from 'src/common/enums/event-type.enum';

/**
 * DTO для створення нової події.
 */
export class CreateEventRequestDTO {
  @ApiProperty({
    type: String,
    description: 'Назва події',
    example: 'День народження Андрія',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    description: 'Тип події',
    example: 'BIRTHDAY',
    required: true,
  })
  @IsEnum(EventType)
  @IsNotEmpty()
  type: EventType;

  @ApiProperty({
    type: Date,
    description: 'Дата проведення події',
    example: '2024-06-15',
    required: true,
  })
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @ApiProperty({
    type: String,
    description: 'Унікальний ідентифікатор організатора події',
    example: '524756c3-a956-4cb5-828d-71f3409e5f3d',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  host_id: string;
}
