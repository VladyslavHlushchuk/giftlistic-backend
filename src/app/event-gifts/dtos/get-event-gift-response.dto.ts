import { ApiProperty } from '@nestjs/swagger';
import type { EventGiftWithGiftGiver } from '../interfaces';

/**
 * DTO для отримання списку подарунків події.
 */
export class GetEventGiftsResponseDTO {
  @ApiProperty({
    type: Array,
    example: [
      {
        id: 'b89df6a2-8d6f-44f8-bc6a-d6a7b9e4dfe9',
        name: 'Чохол для iPhone 13 Pro',
        purchaseLink: 'https://example.com/iphone13pro-case',
        imageUrl: 'https://example.com/images/iphone-case.jpg',
        description: 'Силіконовий чохол для iPhone 13 Pro (чорний)',
        price: 400,
        selected: false,
        giftGiver: null,
      },
      {
        id: 'd52c47b8-3c49-40f9-9cb8-6a82e7a03cf1',
        name: 'Порт-хаб USB-C',
        purchaseLink: 'https://example.com/usb-c-hub',
        imageUrl: 'https://example.com/images/usb-c-hub.jpg',
        description: 'USB-C хаб з 4 портами USB 3.0 для ноутбуків та планшетів',
        price: 600,
        selected: true,
        giftGiver: 'Олександр',
      },
    ],
  })
  data: {
    id: string;
    name: string;
    purchaseLink: string | null;
    imageUrl: string | null;
    description: string | null;
    price: number | null;
    selected: boolean;
    giftGiver: string | null;
  }[];

  /**
   * Фабрика для створення відповіді з даних бази.
   */
  static factory(eventGiftModel: EventGiftWithGiftGiver[]) {
    return eventGiftModel.map((gift) => ({
      id: gift.id,
      name: gift.name,
      purchaseLink: gift.purchaseLink || null,
      imageUrl: gift.imageUrl || null,
      description: gift.description || null,
      price: gift.price ?? null,
      selected: gift.selected ?? false,
      giftGiver: gift.giftGiver?.name || null,
    }));
  }
}
