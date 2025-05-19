import { Test, TestingModule } from '@nestjs/testing';
import { GuestController } from './guest.controller';
import { EventGiftService } from '../event-gifts/event-gift.service';
import { NotFoundException } from '@nestjs/common';

describe('GuestController', () => {
  let controller: GuestController;

  const mockGift = {
    id: 'gift-id',
    name: 'Gift Name',
    imageUrl: 'http://image.com',
    description: 'A gift',
    price: 100,
    purchaseLink: 'http://buy.com',
    selected: false,
    giftGiverId: null,
    giftGiver: null,
  };

  const mockEventGiftService = {
    findByIdWithGiftGiver: jest.fn(),
    selectGift: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuestController],
      providers: [
        {
          provide: EventGiftService,
          useValue: mockEventGiftService,
        },
      ],
    }).compile();

    controller = module.get<GuestController>(GuestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getGiftById()', () => {
    it('should return gift data', async () => {
      mockEventGiftService.findByIdWithGiftGiver.mockResolvedValueOnce(
        mockGift,
      );

      const result = await controller.getGiftById('gift-id');

      expect(result).toEqual({
        id: mockGift.id,
        name: mockGift.name,
        imageUrl: mockGift.imageUrl,
        description: mockGift.description,
        price: mockGift.price,
        purchaseLink: mockGift.purchaseLink,
        selected: mockGift.selected,
        giftGiver: null,
        giftGiverId: null,
      });
    });

    it('should throw NotFoundException if gift not found', async () => {
      mockEventGiftService.findByIdWithGiftGiver.mockResolvedValueOnce(null);

      await expect(controller.getGiftById('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('selectGift()', () => {
    it('should return success and updated gift', async () => {
      mockEventGiftService.selectGift.mockResolvedValueOnce(mockGift);

      const dto = { giftId: 'gift-id', giftGiverId: 'guest-id' };

      const result = await controller.selectGift(dto);

      expect(result.success).toBe(true);
      expect(result.gift).toEqual(mockGift);
    });

    it('should throw NotFoundException if selectGift returns null', async () => {
      mockEventGiftService.selectGift.mockResolvedValueOnce(null);

      const dto = { giftId: 'gift-id', giftGiverId: 'guest-id' };

      await expect(controller.selectGift(dto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
