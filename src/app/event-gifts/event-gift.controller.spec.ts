import { Test, TestingModule } from '@nestjs/testing';
import { EventGiftController } from './event-gift.controller';
import { EventGiftService } from './event-gift.service';
import { BadRequestException } from '@nestjs/common';

describe('EventGiftController', () => {
  let controller: EventGiftController;

  const mockEventGiftService = {
    create: jest.fn(),
    createMany: jest.fn(),
    delete: jest.fn(),
    selectGift: jest.fn(),
    unselectGift: jest.fn(),
    updateGift: jest.fn(),
    findManyByEventID: jest.fn(),
    findByIdWithGiftGiver: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventGiftController],
      providers: [
        {
          provide: EventGiftService,
          useValue: mockEventGiftService,
        },
      ],
    }).compile();

    controller = module.get<EventGiftController>(EventGiftController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a gift', async () => {
    const dto = {
      eventId: 'event-id',
      name: 'Gift',
      purchaseLink: '',
      imageUrl: '',
      description: '',
      price: 100,
      selected: false,
    };

    mockEventGiftService.create.mockResolvedValue(dto);

    const result = await controller.create(dto);

    expect(result).toBeDefined();
    expect(mockEventGiftService.create).toHaveBeenCalledWith(dto);
  });

  it('should throw on createMany if gifts list is empty', async () => {
    await expect(
      controller.createMany({ eventId: '1', gifts: [] }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should call createMany()', async () => {
    const params = {
      eventId: 'event-id',
      gifts: [
        { name: 'Gift 1', price: 10 },
        { name: 'Gift 2', price: 20 },
      ],
    };

    mockEventGiftService.createMany.mockResolvedValue(params.gifts);

    const result = await controller.createMany(params);

    expect(result).toBeDefined();
    expect(mockEventGiftService.createMany).toHaveBeenCalledWith(params);
  });

  it('should return gifts for event', async () => {
    const gifts = [{ id: '1' }];
    mockEventGiftService.findManyByEventID.mockResolvedValue(gifts);

    const result = await controller.findEventGifts('event-id');

    expect(result.data).toBeDefined();
    expect(mockEventGiftService.findManyByEventID).toHaveBeenCalledWith(
      'event-id',
    );
  });

  it('should delete a gift', async () => {
    mockEventGiftService.delete.mockResolvedValue(undefined);

    await expect(controller.deleteGift('gift-id')).resolves.toBeUndefined();
    expect(mockEventGiftService.delete).toHaveBeenCalledWith('gift-id');
  });

  it('should return one gift with giver', async () => {
    const gift = { id: 'gift-id', giftGiver: { id: 'user-id' } };
    mockEventGiftService.findByIdWithGiftGiver.mockResolvedValue(gift);

    const result = await controller.getGift('gift-id');

    expect(result.data).toBeDefined();
    expect(mockEventGiftService.findByIdWithGiftGiver).toHaveBeenCalledWith(
      'gift-id',
    );
  });

  it('should select gift', async () => {
    const dto = { giftId: 'gift-id', giftGiverId: 'user-id' };
    mockEventGiftService.selectGift.mockResolvedValue({ selected: true });

    const result = await controller.selectGift(dto);

    expect(result.selected).toBe(true);
    expect(mockEventGiftService.selectGift).toHaveBeenCalledWith({
      giftID: dto.giftId,
      giftGiverId: dto.giftGiverId,
    });
  });

  it('should unselect gift', async () => {
    const dto = { giftId: 'gift-id', giftGiverId: 'user-id' };
    mockEventGiftService.unselectGift.mockResolvedValue({ selected: false });

    const result = await controller.unselectGift(dto);

    expect(result.selected).toBe(false);
    expect(mockEventGiftService.unselectGift).toHaveBeenCalledWith(
      dto.giftId,
      dto.giftGiverId,
    );
  });

  it('should update gift', async () => {
    const updateData = {
      eventId: 'event-id',
      name: 'Gift',
      purchaseLink: '',
      imageUrl: '',
      description: '',
      price: 100,
    };

    mockEventGiftService.updateGift.mockResolvedValue(updateData);

    const result = await controller.updateGift('gift-id', updateData);

    expect(result).toBeDefined();
    expect(mockEventGiftService.updateGift).toHaveBeenCalledWith(
      'gift-id',
      updateData,
    );
  });
});
