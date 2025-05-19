import { ApiProperty } from '@nestjs/swagger';
import { GiftResponseDTO } from '../../event-gifts/dtos/gift-response.dto';
import type { EventWithGifts } from '../interfaces/event-with-gifts.interface';

export class GetEventResponseDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  date: string;

  @ApiProperty({ type: [GiftResponseDTO] })
  gifts: GiftResponseDTO[];

  @ApiProperty({
    required: false,
    nullable: true,
    example: { id: 'user-id', name: 'Організатор' },
  })
  host?: { id: string; name: string } | null;

  static factory(event: EventWithGifts): GetEventResponseDTO {
    return {
      id: event.id,
      name: event.name,
      type: event.type,
      date: event.date.toISOString(),
      gifts: event.gifts.map((gift) => ({
        id: gift.id,
        name: gift.name,
        purchaseLink: gift.purchaseLink ?? null,
        imageUrl: gift.imageUrl ?? null,
        description: gift.description ?? null,
        price: gift.price ?? null,
        selected: gift.selected ?? false,
        giftGiver: gift.giftGiver?.name ?? null,
      })),
      host: event.host ? { id: event.host.id, name: event.host.name } : null,
    };
  }
}
