import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { EventGiftRepository } from './event-gift.repository';
import type {
  CreateGiftParams,
  CreateGiftsParams,
  SelectGiftParams,
} from './interfaces';
import { EventsRepository } from '../events/events.repository';

@Injectable()
export class EventGiftService {
  constructor(
    private readonly eventGiftRepository: EventGiftRepository,
    private readonly eventRepository: EventsRepository,
  ) {}

  async findOne(giftId: string) {
    return this.getEventGiftOrThrowError(giftId);
  }

  async create({
    eventId,
    name,
    purchaseLink,
    imageUrl,
    description,
    price,
  }: CreateGiftParams) {
    const event = await this.eventRepository.findFirst(eventId);

    if (!event) {
      throw new BadRequestException('Подія не знайдена!');
    }

    return await this.eventGiftRepository.create({
      eventId,
      name,
      purchaseLink,
      imageUrl,
      description,
      price,
    });
  }

  async createMany({ eventId, gifts }: CreateGiftsParams) {
    const giftObjects = gifts.map(
      ({ name, purchaseLink, imageUrl, description, price }) => ({
        eventId,
        name,
        purchaseLink,
        imageUrl,
        description,
        price,
      }),
    );

    await this.eventGiftRepository.createMany(giftObjects);
    return this.findManyByEventID(eventId);
  }

  async findManyByEventID(eventId: string) {
    return await this.eventGiftRepository.findMany({ eventId });
  }

  async getByGiftGiverID(giftGiverId: string) {
    return await this.eventGiftRepository.findMany({ giftGiverId });
  }

  async delete(giftID: string) {
    await this.getEventGiftOrThrowError(giftID);
    return await this.eventGiftRepository.delete(giftID);
  }

  async selectGift({ giftID, giftGiverId }: SelectGiftParams) {
    const eventGift = await this.getEventGiftOrThrowError(giftID);
    if (eventGift.giftGiverId) {
      throw new BadRequestException('Подарунок вже хтось вибрав!');
    }

    return await this.eventGiftRepository.update(giftID, {
      selected: true,
      giftGiver: { connect: { id: giftGiverId } },
    });
  }

  async unselectGift(giftID: string, giftGiverId: string) {
    const gift = await this.getEventGiftOrThrowError(giftID);

    if (!gift.selected || gift.giftGiverId !== giftGiverId) {
      throw new BadRequestException('Ви не можете скасувати цей подарунок.');
    }

    return await this.eventGiftRepository.update(giftID, {
      selected: false,
      giftGiver: { disconnect: true },
    });
  }

  async getEventGiftOrThrowError(giftID: string) {
    const existGift = await this.eventGiftRepository.findFirst({ id: giftID });
    if (!existGift) {
      throw new NotFoundException('Подарунок не знайдено');
    }
    return existGift;
  }

  async updateGift(giftID: string, updateData: CreateGiftParams) {
    await this.getEventGiftOrThrowError(giftID);

    return await this.eventGiftRepository.update(giftID, updateData); // використовуємо правильну конструкцію
  }

  async findByIdWithGiftGiver(giftId: string) {
    return this.eventGiftRepository.findByIdWithGiftGiver(giftId);
  }
}
