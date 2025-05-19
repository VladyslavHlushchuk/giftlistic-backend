import { GetDashboardResponseDTO } from './get-dashboard-response.dto';
import type { GetDashboardByUserIDResponse } from '../interfaces';
import { EventType } from 'src/common/enums/event-type.enum';

describe('GetDashboardResponseDTO', () => {
  const mockUser = {
    id: '123',
    name: 'Vlad',
    email: 'vlad@example.com',
  };

  const myEvents: GetDashboardByUserIDResponse['my_events'] = [
    {
      id: 'event1',
      name: 'Birthday',
      type: EventType.BIRTHDAY,
      date: new Date('2024-01-01T00:00:00.000Z'),
      gifts: [
        {
          id: 'gift1',
          name: 'Book',
          purchaseLink: null,
          imageUrl: null,
          description: null,
          price: null,
          selected: false,
          giftGiverId: 'user-id',
          giftGiver: { name: 'Anna' },
        },
      ],
    },
  ];

  const anotherEvents: GetDashboardByUserIDResponse['another_events'] = [
    {
      id: 'event2',
      name: 'Wedding',
      type: EventType.WEDDING,
      date: new Date('2024-06-10T00:00:00.000Z'),
      createdAt: new Date(),
      deletedAt: null,
      hostId: 'host-id',
    },
  ];

  it('should format full dashboard data correctly', () => {
    const dto = GetDashboardResponseDTO.factory({
      user: mockUser,
      my_events: myEvents,
      another_events: anotherEvents,
    }) as any;

    expect(dto.user.id).toBe('123');
    expect(dto.my_events[0].gifts[0].gift_giver.name).toBe('Anna');
    expect(dto.another_events[0].id).toBe('event2');
    expect(dto.another_events[0].createdAt).toBeUndefined();
  });

  it('should handle empty gifts and another_events gracefully', () => {
    const dto = GetDashboardResponseDTO.factory({
      user: mockUser,
      my_events: [{ ...myEvents[0], gifts: [] }],
      another_events: [],
    }) as any;

    expect(dto.my_events[0].gifts).toEqual([]);
    expect(dto.another_events).toEqual([]);
  });

  it('should handle missing fields (undefined maps)', () => {
    const dto = GetDashboardResponseDTO.factory({
      user: mockUser,
      my_events: undefined,
      another_events: undefined,
    }) as any;

    expect(dto.my_events).toBeUndefined();
    expect(dto.another_events).toBeUndefined();
  });
});
