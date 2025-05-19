import { CreateEventResponseDTO } from './create-event-response.dto';
import { EventType } from 'src/common/enums/event-type.enum';

describe('CreateEventResponseDTO', () => {
  const baseEvent = {
    id: 'event-id',
    name: 'Весілля Івана і Марії',
    type: EventType.WEDDING,
    date: new Date('2024-06-15T00:00:00.000Z'),
  };

  it('should map event with host and gifts correctly', () => {
    const eventWithHostAndGifts = {
      ...baseEvent,
      host: { id: 'user-id', name: 'Оксана' },
      gifts: [
        {
          id: 'gift-id',
          name: 'Посуд',
        },
      ],
    };

    const dto = CreateEventResponseDTO.factory(eventWithHostAndGifts);

    expect(dto.id).toBe('event-id');
    expect(dto.name).toBe('Весілля Івана і Марії');
    expect(dto.type).toBe(EventType.WEDDING);
    expect(dto.date).toEqual(new Date('2024-06-15T00:00:00.000Z'));
    expect(dto.host).toEqual({ id: 'user-id', name: 'Оксана' });
    expect(dto.gifts?.length).toBe(1);
  });

  it('should set host to null if missing', () => {
    const eventWithoutHost = {
      ...baseEvent,
      host: null,
      gifts: [],
    };

    const dto = CreateEventResponseDTO.factory(eventWithoutHost);

    expect(dto.host).toBeNull();
    expect(dto.gifts).toEqual([]);
  });

  it('should default gifts to empty array if undefined', () => {
    const eventWithoutGifts = {
      ...baseEvent,
      host: null,
    };

    const dto = CreateEventResponseDTO.factory(eventWithoutGifts);

    expect(dto.gifts).toEqual([]);
  });
});
