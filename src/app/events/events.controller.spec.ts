import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { BadRequestException } from '@nestjs/common';
import { EventType } from '../../common/enums/event-type.enum';

describe('EventsController', () => {
  let controller: EventsController;

  const mockEvent = {
    id: 'event-id',
    name: 'Birthday',
    type: EventType.BIRTHDAY,
    date: new Date(),
    hostId: 'user-id',
    gifts: [],
  };

  const mockEventsService = {
    create: jest.fn(),
    getEventAndGiftsByID: jest.fn(),
    getEventByUserID: jest.fn(),
    getAllEvents: jest.fn(),
    updateEvent: jest.fn(),
    deleteEvent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: mockEventsService,
        },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an event', async () => {
    mockEventsService.create.mockResolvedValue(mockEvent);

    const dto = {
      name: 'Birthday',
      date: new Date(),
      type: EventType.BIRTHDAY,
      host_id: 'user-id',
    };

    const result = await controller.create(dto);

    expect(result).toBeDefined();
    expect(mockEventsService.create).toHaveBeenCalledWith({
      name: dto.name,
      date: dto.date,
      type: dto.type,
      hostId: dto.host_id,
    });
  });

  it('should throw BadRequestException on create failure', async () => {
    mockEventsService.create.mockRejectedValueOnce(
      new Error('Failed to create'),
    );
    await expect(
      controller.create({
        name: 'Fail Event',
        date: new Date(),
        type: EventType.BIRTHDAY,
        host_id: 'user-id',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should get event by ID', async () => {
    mockEventsService.getEventAndGiftsByID.mockResolvedValue(mockEvent);
    const result = await controller.findEvent('event-id');
    expect(result).toBeDefined();
    expect(mockEventsService.getEventAndGiftsByID).toHaveBeenCalledWith(
      'event-id',
    );
  });

  it('should throw BadRequestException on findEvent failure', async () => {
    mockEventsService.getEventAndGiftsByID.mockRejectedValueOnce(
      new Error('Error'),
    );
    await expect(controller.findEvent('bad-id')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should get user events', async () => {
    mockEventsService.getEventByUserID.mockResolvedValue([mockEvent]);
    const result = await controller.findEventsByUser('user-id');
    expect(result.length).toBe(1);
    expect(mockEventsService.getEventByUserID).toHaveBeenCalledWith('user-id');
  });

  it('should throw BadRequestException on findEventsByUser failure', async () => {
    mockEventsService.getEventByUserID.mockRejectedValueOnce(new Error('fail'));
    await expect(controller.findEventsByUser('x')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should get all events', async () => {
    mockEventsService.getAllEvents.mockResolvedValue([mockEvent]);
    const result = await controller.findAllEvents();
    expect(result.length).toBe(1);
    expect(mockEventsService.getAllEvents).toHaveBeenCalled();
  });

  it('should throw BadRequestException on findAllEvents failure', async () => {
    mockEventsService.getAllEvents.mockRejectedValueOnce(new Error('fail'));
    await expect(controller.findAllEvents()).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should update event', async () => {
    const updated = { ...mockEvent, name: 'New Name' };
    mockEventsService.updateEvent.mockResolvedValue(updated);

    const result = await controller.updateEvent('event-id', {
      name: 'New Name',
    });

    expect(result.name).toBe('New Name');
    expect(mockEventsService.updateEvent).toHaveBeenCalledWith('event-id', {
      name: 'New Name',
    });
  });

  it('should throw BadRequestException on update failure', async () => {
    mockEventsService.updateEvent.mockRejectedValueOnce(new Error('fail'));
    await expect(
      controller.updateEvent('bad-id', { name: 'Error' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should delete event', async () => {
    mockEventsService.deleteEvent.mockResolvedValue(mockEvent);
    const result = await controller.deleteEvent('event-id');
    expect(result).toBeDefined();
    expect(mockEventsService.deleteEvent).toHaveBeenCalledWith('event-id');
  });

  it('should throw BadRequestException on delete failure', async () => {
    mockEventsService.deleteEvent.mockRejectedValueOnce(new Error('fail'));
    await expect(controller.deleteEvent('x')).rejects.toThrow(
      BadRequestException,
    );
  });
});
