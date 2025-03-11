import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

/**
 * DTO для створення списку подарунків для події.
 */
export class CreateEventGiftsRequestDTO {
  @ApiProperty({
    type: String,
    description: 'Унікальний ідентифікатор події',
    example: '524756c3-a956-4cb5-828d-71f3409e5f3d',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  eventId: string; // Зміна на camelCase

  @ApiProperty({
    type: Array,
    description: 'Список подарунків',
    example: [
      {
        name: 'Чохол для iPhone 13 Pro',
        purchaseLink: 'https://example.com/iphone13pro-case', // Зміна на camelCase
        imageUrl: 'https://example.com/images/iphone-case.jpg', // Зміна на camelCase
        description: 'Силіконовий чохол для iPhone 13 Pro (чорний)', // Зміна на camelCase
        price: 400,
      },
      {
        name: 'Порт-хаб USB-C',
        purchaseLink: 'https://example.com/usb-c-hub', // Зміна на camelCase
        imageUrl: 'https://example.com/images/usb-c-hub.jpg', // Зміна на camelCase
        description: 'USB-C хаб з 4 портами USB 3.0 для ноутбуків та планшетів', // Зміна на camelCase
        price: 600,
      },
    ],
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  gifts: GiftDTO[];
}

/**
 * DTO для представлення окремого подарунку.
 */
export class GiftDTO {
  @ApiProperty({
    type: String,
    description: 'Назва подарунку',
    example: 'Чохол для iPhone 13 Pro',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    description: 'Посилання на покупку подарунку',
    example: 'https://example.com/iphone13pro-case',
    required: false,
  })
  @IsString()
  @IsOptional()
  purchaseLink?: string; // Зміна на camelCase

  @ApiProperty({
    type: String,
    description: 'URL-адреса зображення подарунку',
    example: 'https://example.com/images/iphone-case.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string; // Зміна на camelCase

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
}
