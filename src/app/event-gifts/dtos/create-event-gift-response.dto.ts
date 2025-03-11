import { ApiProperty } from '@nestjs/swagger';
import type { EventGift as EventGiftModel } from '@prisma/client';

/**
 * DTO для відповіді після створення подарунку.
 */
export class CreateEventGiftsResponseDTO {
  @ApiProperty({
    description: 'Унікальний ідентифікатор подарунку',
    example: '4dc737f9-ab91-4bab-b77d-bb32b10ac5f2',
  })
  id: string;

  @ApiProperty({
    description: 'Назва подарунку',
    example: 'Порт-хаб USB-C',
  })
  name: string;

  @ApiProperty({
    description: 'Посилання на покупку подарунку',
    example: 'https://example.com/usb-c-hub',
    required: false,
  })
  purchaseLink?: string;

  @ApiProperty({
    description: 'URL-адреса зображення подарунку',
    example: 'https://example.com/images/usb-c-hub.jpg',
    required: false,
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'Опис подарунку',
    example: 'USB-C хаб з 4 портами USB 3.0 для ноутбуків та планшетів',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Ціна подарунку',
    example: 600,
    required: false,
  })
  price?: number;

  @ApiProperty({
    description: 'Дарувальник подарунку (ID користувача)',
    example: '8f9b4d22-29fc-4f8a-9931-10a97e9e2c88',
    required: false,
  })
  giftGiver?: string;

  /**
   * Фабричний метод для створення об'єкта відповіді.
   */
  static factory(eventGiftModel: EventGiftModel) {
    return {
      id: eventGiftModel.id,
      name: eventGiftModel.name,
      purchaseLink: eventGiftModel.purchaseLink || null,
      imageUrl: eventGiftModel.imageUrl || null,
      description: eventGiftModel.description || null,
      price: eventGiftModel.price || null,
      giftGiver: eventGiftModel.giftGiverId || null,
    };
  }
}
