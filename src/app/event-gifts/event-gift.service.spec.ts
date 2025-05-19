import { Test, TestingModule } from '@nestjs/testing';
import { EventGiftService } from './event-gift.service';
import { EventGiftRepository } from './event-gift.repository';
import { EventsRepository } from '../events/events.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('EventGiftService', () => {
  let service: EventGiftService;

  const mockGift = {
    id: 'gift-id',
    selected: false,
    giftGiverId: null,
  };

  const mockEventGiftRepository = {
    findFirst: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    findByIdWithGiftGiver: jest.fn(),
  };

  const mockEventsRepository = {
    findFirst: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventGiftService,
        { provide: EventGiftRepository, useValue: mockEventGiftRepository },
        { provide: EventsRepository, useValue: mockEventsRepository },
      ],
    }).compile();

    service = module.get<EventGiftService>(EventGiftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should create a gift if event exists', async () => {
      mockEventsRepository.findFirst.mockResolvedValue({ id: 'event-id' });
      mockEventGiftRepository.create.mockResolvedValue({ id: 'gift-id' });

      const result = await service.create({
        eventId: 'event-id',
        name: 'Gift',
        purchaseLink: '',
        imageUrl: '',
        description: '',
        price: 0,
      });

      expect(result).toEqual({ id: 'gift-id' });
      expect(mockEventGiftRepository.create).toHaveBeenCalled();
    });

    it('should throw if event not found', async () => {
      mockEventsRepository.findFirst.mockResolvedValue(null);

      await expect(
        service.create({
          eventId: 'missing-id',
          name: 'Gift',
          purchaseLink: '',
          imageUrl: '',
          description: '',
          price: 0,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('createMany()', () => {
    it('should create many gifts and return them', async () => {
      const gifts = [
        {
          name: 'G1',
          purchaseLink: '',
          imageUrl: '',
          description: '',
          price: 10,
        },
        {
          name: 'G2',
          purchaseLink: '',
          imageUrl: '',
          description: '',
          price: 20,
        },
      ];

      mockEventGiftRepository.createMany.mockResolvedValue(undefined);
      mockEventGiftRepository.findMany.mockResolvedValue(gifts);

      const result = await service.createMany({ eventId: 'event-id', gifts });

      expect(result).toEqual(gifts);
      expect(mockEventGiftRepository.createMany).toHaveBeenCalledWith([
        { ...gifts[0], eventId: 'event-id' },
        { ...gifts[1], eventId: 'event-id' },
      ]);
    });
  });

  describe('getEventGiftOrThrowError()', () => {
    it('should return gift if found', async () => {
      mockEventGiftRepository.findFirst.mockResolvedValue(mockGift);
      const gift = await service.getEventGiftOrThrowError('gift-id');
      expect(gift).toEqual(mockGift);
    });

    it('should throw if gift not found', async () => {
      mockEventGiftRepository.findFirst.mockResolvedValue(null);
      await expect(
        service.getEventGiftOrThrowError('invalid-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('selectGift()', () => {
    it('should select a gift if it is not already selected', async () => {
      mockEventGiftRepository.findFirst.mockResolvedValue({
        ...mockGift,
        selected: false,
        giftGiverId: null,
      });
      mockEventGiftRepository.update.mockResolvedValue({ selected: true });

      const result = await service.selectGift({
        giftID: 'gift-id',
        giftGiverId: 'user-id',
      });

      expect(result).toEqual({ selected: true });
      expect(mockEventGiftRepository.update).toHaveBeenCalledWith('gift-id', {
        selected: true,
        giftGiver: { connect: { id: 'user-id' } },
      });
    });

    it('should throw if gift is already selected', async () => {
      mockEventGiftRepository.findFirst.mockResolvedValue({
        ...mockGift,
        giftGiverId: 'someone-else',
      });

      await expect(
        service.selectGift({ giftID: 'gift-id', giftGiverId: 'user-id' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('unselectGift()', () => {
    it('should unselect gift if user is correct', async () => {
      mockEventGiftRepository.findFirst.mockResolvedValue({
        selected: true,
        giftGiverId: 'user-id',
      });
      mockEventGiftRepository.update.mockResolvedValue({ selected: false });

      const result = await service.unselectGift('gift-id', 'user-id');

      expect(result).toEqual({ selected: false });
    });

    it('should throw if gift is not selected by user', async () => {
      mockEventGiftRepository.findFirst.mockResolvedValue({
        selected: true,
        giftGiverId: 'another-id',
      });

      await expect(service.unselectGift('gift-id', 'user-id')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateGift()', () => {
    it('should update a gift if it exists', async () => {
      mockEventGiftRepository.findFirst.mockResolvedValue(mockGift);
      mockEventGiftRepository.update.mockResolvedValue({
        ...mockGift,
        name: 'Updated Name',
      });

      const result = await service.updateGift('gift-id', {
        eventId: 'event-id',
        name: 'Updated Name',
        purchaseLink: '',
        imageUrl: '',
        description: '',
        price: 10,
      });

      expect(result.name).toBe('Updated Name');
      expect(mockEventGiftRepository.update).toHaveBeenCalled();
    });
  });

  describe('findManyByEventID()', () => {
    it('should return gifts by event ID', async () => {
      const gifts = [mockGift];
      mockEventGiftRepository.findMany.mockResolvedValue(gifts);

      const result = await service.findManyByEventID('event-id');
      expect(result).toEqual(gifts);
    });
  });

  describe('delete()', () => {
    it('should delete gift if it exists', async () => {
      mockEventGiftRepository.findFirst.mockResolvedValue(mockGift);
      mockEventGiftRepository.delete.mockResolvedValue(true);

      const result = await service.delete('gift-id');

      expect(result).toBe(true);
      expect(mockEventGiftRepository.delete).toHaveBeenCalledWith('gift-id');
    });
  });

  describe('findByIdWithGiftGiver()', () => {
    it('should return gift with giftGiver info', async () => {
      const gift = { ...mockGift, giftGiver: { name: 'Anna' } };
      mockEventGiftRepository.findByIdWithGiftGiver.mockResolvedValue(gift);

      const result = await service.findByIdWithGiftGiver('gift-id');

      expect(result).toEqual(gift);
    });
  });

  it('should throw if gift is already selected by another user', async () => {
    mockEventGiftRepository.findFirst.mockResolvedValue({
      ...mockGift,
      giftGiverId: 'other-user-id',
    });

    await expect(
      service.selectGift({ giftID: 'gift-id', giftGiverId: 'user-id' }),
    ).rejects.toThrow('Подарунок вже хтось вибрав!');
  });
});
