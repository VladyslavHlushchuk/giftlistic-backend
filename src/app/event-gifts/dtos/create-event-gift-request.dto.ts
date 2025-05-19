import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MinLength,
  IsOptional,
  IsNumber,
  IsUrl,
} from 'class-validator';

/**
 * DTO для створення окремого подарунку.
 */
export class CreateEventGiftRequestDTO {
  @ApiProperty({
    type: String,
    description: 'Унікальний ідентифікатор події, до якої додається подарунок',
    example: '524756c3-a956-4cb5-828d-71f3409e5f3d',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  eventId: string;

  @ApiProperty({
    type: String,
    description: 'Назва подарунку',
    example: 'Чохол для iPhone 13 Pro',
    required: true,
  })
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    description: 'Посилання на покупку подарунку',
    example: 'https://example.com/iphone13pro-case',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  purchaseLink?: string;

  @ApiProperty({
    type: String,
    description: 'URL-адреса зображення подарунку',
    example: 'https://example.com/images/iphone-case.jpg',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    type: String,
    description: 'Опис подарунку',
    example: 'Силіконовий чохол для iPhone 13 Pro (чорний)',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: Number,
    description: 'Ціна подарунку',
    example: 400,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({
    type: Boolean,
    description: 'Чи вибраний подарунок гостем',
    example: false,
    required: false,
  })
  @IsOptional()
  selected?: boolean;
}
