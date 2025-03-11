import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { EventType } from '../../../common/enums/event-type.enum';

export class UpdateEventRequestDTO {
  @ApiPropertyOptional({ description: 'Назва події' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Дата події (ISO формат)',
    example: '2025-06-01T00:00:00.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  date?: Date;

  @ApiPropertyOptional({
    description: 'Тип події',
    enum: EventType,
  })
  @IsOptional()
  @IsEnum(EventType)
  type?: EventType;
}
