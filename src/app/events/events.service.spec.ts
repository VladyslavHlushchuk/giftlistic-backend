import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { EventsRepository } from './events.repository';
import { UsersService } from '../users/users.service';
import { EventGiftService } from '../event-gifts/event-gift.service';
import { NotFoundException } from '@nestjs/common';
import { EventType } from '../../common/enums/event-type.enum';

describe('EventsService', () => {
  let service: EventsService;

  const mockUser = {
    id: 'user-id',
    name: 'John Doe',
    email: 'john@example.com',
  };

  const mockEvent = {
    id: 'event-id',
    name: 'Birthday',
    type: EventType.BIRTHDAY,
    date: new Date(),
    host: { id: mockUser.id, name: mockUser.name },
  };

  const mockEventsRepository = {
    create: jest.fn(),
    findByIdWithHost: jest.fn(),
    findMany: jest.fn(),
    findManyWithHost: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockUsersService = {
    getById: jest.fn(),
  };

  const mockEventGiftService = {
    findManyByEventID: jest.fn(),
    getByGiftGiverID: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: EventsRepository, useValue: mockEventsRepository },
        { provide: UsersService, useValue: mockUsersService },
        { provide: EventGiftService, useValue: mockEventGiftService },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw if user not found during create()', async () => {
    mockUsersService.getById.mockResolvedValueOnce(null);

    await expect(
      service.create({
        name: 'Birthday',
        date: new Date(),
        type: EventType.BIRTHDAY,
        hostId: 'user-id',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should create event if user exists', async () => {
    mockUsersService.getById.mockResolvedValue(mockUser);
    mockEventsRepository.create.mockResolvedValue({ id: 'event-id' });
    mockEventsRepository.findByIdWithHost.mockResolvedValue(mockEvent);

    const result = await service.create({
      name: 'Birthday',
      date: new Date(),
      type: EventType.BIRTHDAY,
      hostId: mockUser.id,
    });

    expect(result).toHaveProperty('id');
    expect(mockEventsRepository.create).toHaveBeenCalled();
  });

  it('should return all events with empty gifts', async () => {
    mockEventsRepository.findManyWithHost.mockResolvedValue([mockEvent]);

    const result = await service.getAllEvents();

    expect(result[0].gifts).toEqual([]);
  });

  it('should get event by ID and include formatted gifts', async () => {
    mockEventsRepository.findByIdWithHost.mockResolvedValue(mockEvent);
    mockEventGiftService.findManyByEventID.mockResolvedValue([
      {
        id: 'gift-id',
        name: 'Gift',
        selected: true,
        giftGiverId: 'guest-id',
        giftGiver: { name: 'Guest' },
      },
    ]);

    const result = await service.getEventAndGiftsByID('event-id');

    expect(result.gifts[0].giftGiver.name).toBe('Guest');
    expect(mockEventGiftService.findManyByEventID).toHaveBeenCalledWith(
      'event-id',
    );
  });

  it('should return events by user ID', async () => {
    mockEventsRepository.findManyWithHost.mockResolvedValue([mockEvent]);

    const result = await service.getEventByUserID('user-id');

    expect(result.length).toBe(1);
    expect(result[0]).toHaveProperty('gifts');
  });

  it('should return events where user is gift giver', async () => {
    mockEventGiftService.getByGiftGiverID.mockResolvedValue([
      { eventId: 'event-1' },
      { eventId: 'event-2' },
    ]);
    mockEventsRepository.findMany.mockResolvedValue([
      { id: 'event-1' },
      { id: 'event-2' },
    ]);

    const result = await service.getEventsForGiftGiver('user-id');

    expect(result.length).toBe(2);
  });

  it('should update event and return updated version', async () => {
    mockEventsRepository.findByIdWithHost.mockResolvedValueOnce(mockEvent);

    const updated = { ...mockEvent, name: 'Updated' };

    mockEventsRepository.update.mockResolvedValue(undefined);
    mockEventsRepository.findByIdWithHost.mockResolvedValueOnce(updated);

    const result = await service.updateEvent('event-id', { name: 'Updated' });

    expect(result.name).toBe('Updated');
  });

  it('should delete event and return it', async () => {
    mockEventsRepository.findByIdWithHost.mockResolvedValue(mockEvent);
    mockEventsRepository.delete.mockResolvedValue(undefined);

    const result = await service.deleteEvent('event-id');

    expect(result.id).toBe('event-id');
    expect(mockEventsRepository.delete).toHaveBeenCalledWith('event-id');
  });

  it('should throw if event not found in getEventByIdOrThrowError', async () => {
    mockEventsRepository.findByIdWithHost.mockResolvedValue(null);

    await expect(service.getEventByIdOrThrowError('wrong-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
