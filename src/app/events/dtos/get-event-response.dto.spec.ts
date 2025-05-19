import { GetEventResponseDTO } from './get-event-response.dto';
import { EventType } from 'src/common/enums/event-type.enum';
import { EventWithGifts } from '../interfaces/event-with-gifts.interface';

describe('GetEventResponseDTO', () => {
  const baseEvent: EventWithGifts = {
    id: 'event-id',
    name: 'Birthday',
    type: EventType.BIRTHDAY,
    date: new Date('2024-01-01T00:00:00.000Z'),
    gifts: [],
    host: { id: 'user-id', name: 'Vlad' },
  };

  it('should map event with host and full gift data correctly', () => {
    const eventWithGifts: EventWithGifts = {
      ...baseEvent,
      gifts: [
        {
          id: 'gift-id',
          name: 'Watch',
          purchaseLink: 'https://example.com/watch',
          imageUrl: 'https://example.com/img.jpg',
          description: 'Nice watch',
          price: 150,
          selected: true,
          giftGiverId: 'giver-id',
          giftGiver: { name: 'Anna' },
        },
      ],
    };

    const dto = GetEventResponseDTO.factory(eventWithGifts);

    expect(dto.id).toBe('event-id');
    expect(dto.name).toBe('Birthday');
    expect(dto.type).toBe(EventType.BIRTHDAY);
    expect(dto.date).toBe('2024-01-01T00:00:00.000Z');
    expect(dto.host).toEqual({ id: 'user-id', name: 'Vlad' });
    expect(dto.gifts.length).toBe(1);
    expect(dto.gifts[0].giftGiver).toBe('Anna');
  });

  it('should handle gift with nullables and undefined fields', () => {
    const eventWithMinimalGift: EventWithGifts = {
      ...baseEvent,
      gifts: [
        {
          id: 'gift-id',
          name: 'Book',
          purchaseLink: null,
          imageUrl: undefined,
          description: undefined,
          price: null,
          selected: undefined,
          giftGiverId: null,
          giftGiver: null,
        },
      ],
    };

    const dto = GetEventResponseDTO.factory(eventWithMinimalGift);

    const gift = dto.gifts[0];
    expect(gift.purchaseLink).toBeNull();
    expect(gift.imageUrl).toBeNull();
    expect(gift.description).toBeNull();
    expect(gift.price).toBeNull();
    expect(gift.selected).toBe(false);
    expect(gift.giftGiver).toBeNull();
  });

  it('should handle event without host', () => {
    const eventWithoutHost: EventWithGifts = {
      ...baseEvent,
      host: null,
    };

    const dto = GetEventResponseDTO.factory(eventWithoutHost);
    expect(dto.host).toBeNull();
  });
});
