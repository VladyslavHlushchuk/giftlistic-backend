import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { UsersService } from '../users/users.service';
import { EventsService } from '../events/events.service';

describe('DashboardService', () => {
  let service: DashboardService;

  const mockUser = {
    id: 'user-id',
    name: 'John Doe',
    email: 'john@example.com',
  };

  const mockEvents = [{ id: 'event-1' }, { id: 'event-2' }];

  const mockEventWithGifts = {
    id: 'event-1',
    name: 'Birthday Party',
    gifts: [],
  };

  const mockUsersService = {
    getById: jest.fn(),
  };

  const mockEventsService = {
    getEventByUserID: jest.fn(),
    getEventsForGiftGiver: jest.fn(),
    getEventAndGiftsByID: jest.fn(),
  };

  beforeEach(async () => {
    mockUsersService.getById.mockResolvedValue(mockUser);
    mockEventsService.getEventByUserID.mockResolvedValue(mockEvents);
    mockEventsService.getEventsForGiftGiver.mockResolvedValue([
      'another-event',
    ]);
    mockEventsService.getEventAndGiftsByID.mockResolvedValue(
      mockEventWithGifts,
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: EventsService, useValue: mockEventsService },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return dashboard data for a given user', async () => {
    const result = await service.getDashboardByUserID('user-id');

    expect(mockUsersService.getById).toHaveBeenCalledWith('user-id');
    expect(mockEventsService.getEventByUserID).toHaveBeenCalledWith('user-id');
    expect(mockEventsService.getEventsForGiftGiver).toHaveBeenCalledWith(
      'user-id',
    );
    expect(mockEventsService.getEventAndGiftsByID).toHaveBeenCalledTimes(
      mockEvents.length,
    );

    expect(result).toEqual({
      user: {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
      },
      my_events: [mockEventWithGifts, mockEventWithGifts],
      another_events: ['another-event'],
    });
  });
});
