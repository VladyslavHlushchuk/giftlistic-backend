import { Test, TestingModule } from '@nestjs/testing';
import { EventGiftRepository } from './event-gift.repository';
import { PrismaService } from 'src/common/services';
import { NotFoundException } from '@nestjs/common';

const mockPrismaService = {
  eventGift: {
    createMany: jest.fn(),
    create: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
  },
};

describe('EventGiftRepository', () => {
  let repository: EventGiftRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventGiftRepository,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    repository = module.get<EventGiftRepository>(EventGiftRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should create many gifts', async () => {
    await repository.createMany([{ eventId: '1', name: 'Gift' } as any]);
    expect(mockPrismaService.eventGift.createMany).toHaveBeenCalled();
  });

  it('should create a gift', async () => {
    const gift = { id: 'gift-id', name: 'Gift' };
    mockPrismaService.eventGift.create.mockResolvedValue(gift);
    const result = await repository.create({
      eventId: '1',
      name: 'Gift',
    } as any);
    expect(result).toEqual(gift);
  });

  it('should find first gift by unique input', async () => {
    const gift = { id: 'gift-id', name: 'Gift' };
    mockPrismaService.eventGift.findFirst.mockResolvedValue(gift);
    const result = await repository.findFirst({ id: 'gift-id' });
    expect(result).toEqual(gift);
  });

  it('should find many gifts with giftGiver', async () => {
    const gifts = [{ id: '1', name: 'G1' }];
    mockPrismaService.eventGift.findMany.mockResolvedValue(gifts);
    const result = await repository.findMany({ eventId: '1' });
    expect(result).toEqual(gifts);
  });

  it('should delete a gift', async () => {
    const gift = { id: 'gift-id', name: 'Gift' };
    mockPrismaService.eventGift.delete.mockResolvedValue(gift);
    const result = await repository.delete('gift-id');
    expect(result).toEqual(gift);
  });

  it('should update a gift if exists', async () => {
    const updated = { id: 'gift-id', name: 'Updated Gift' };
    mockPrismaService.eventGift.findFirst.mockResolvedValue(true);
    mockPrismaService.eventGift.update.mockResolvedValue(updated);
    const result = await repository.update('gift-id', { name: 'Updated Gift' });
    expect(result).toEqual(updated);
  });

  it('should throw if gift not found when updating', async () => {
    mockPrismaService.eventGift.findFirst.mockResolvedValue(null);
    await expect(
      repository.update('nonexistent', { name: 'x' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should find gift by id with gift giver', async () => {
    const gift = { id: 'gift-id', giftGiver: { name: 'Vlad' } };
    mockPrismaService.eventGift.findUnique.mockResolvedValue(gift);
    const result = await repository.findByIdWithGiftGiver('gift-id');
    expect(result).toEqual(gift);
  });
});
