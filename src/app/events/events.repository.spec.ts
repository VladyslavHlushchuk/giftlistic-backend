import { Test, TestingModule } from '@nestjs/testing';
import { EventsRepository } from './events.repository';
import { PrismaService } from 'src/common/services';
import { EventType } from '../../common/enums/event-type.enum';

const mockPrisma = {
  event: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('EventsRepository', () => {
  let repository: EventsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsRepository,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    repository = module.get<EventsRepository>(EventsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create event with Date instance', async () => {
    const input = {
      name: 'Test Event',
      type: EventType.BIRTHDAY,
      date: new Date(),
      host: { connect: { id: 'user-id' } },
    };

    await repository.create(input);
    expect(mockPrisma.event.create).toHaveBeenCalledWith({
      data: {
        name: 'Test Event',
        type: EventType.BIRTHDAY,
        date: input.date,
        host: {
          connect: { id: 'user-id' },
        },
      },
    });
  });

  it('should create event with date as string (branch test)', async () => {
    const input = {
      name: 'Test Event',
      type: EventType.BIRTHDAY,
      date: '2024-01-01T00:00:00.000Z',
      host: { connect: { id: 'user-id' } },
    };

    await repository.create(input as any);
    expect(mockPrisma.event.create).toHaveBeenCalledWith({
      data: {
        name: 'Test Event',
        type: EventType.BIRTHDAY,
        date: new Date('2024-01-01T00:00:00.000Z'),
        host: {
          connect: { id: 'user-id' },
        },
      },
    });
  });

  it('should find many', async () => {
    await repository.findMany({ name: 'Test' });
    expect(mockPrisma.event.findMany).toHaveBeenCalledWith({
      where: { name: 'Test' },
    });
  });

  it('should find by ID with host', async () => {
    await repository.findByIdWithHost('event-id');
    expect(mockPrisma.event.findUnique).toHaveBeenCalledWith({
      where: { id: 'event-id' },
      include: {
        host: {
          select: { id: true, name: true },
        },
      },
    });
  });

  it('should find first', async () => {
    await repository.findFirst('event-id');
    expect(mockPrisma.event.findUnique).toHaveBeenCalledWith({
      where: { id: 'event-id' },
    });
  });

  it('should update event', async () => {
    await repository.update('event-id', { name: 'Updated' });
    expect(mockPrisma.event.update).toHaveBeenCalledWith({
      where: { id: 'event-id' },
      data: { name: 'Updated' },
    });
  });

  it('should delete event', async () => {
    await repository.delete('event-id');
    expect(mockPrisma.event.delete).toHaveBeenCalledWith({
      where: { id: 'event-id' },
    });
  });

  it('should find many with host', async () => {
    await repository.findManyWithHost({ name: 'Event' });
    expect(mockPrisma.event.findMany).toHaveBeenCalledWith({
      where: { name: 'Event' },
      include: {
        host: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  });
});
