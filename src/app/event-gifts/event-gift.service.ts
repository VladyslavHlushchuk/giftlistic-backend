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

  async create({
    eventId,
    name,
    purchaseLink,
    imageUrl,
    description,
    price,
  }: CreateGiftParams) {
    // Перевіряємо, чи існує подія
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

    // Оновлюємо подарунок, передаючи giftGiver замість giftGiverId
    return await this.eventGiftRepository.update(
      giftID, // передаємо giftID без обгортки
      {
        giftGiver: { connect: { id: giftGiverId } }, // використовуємо connect для зв'язку з giftGiver
      },
    );
  }

  async getEventGiftOrThrowError(giftID: string) {
    const existGift = await this.eventGiftRepository.findFirst({ id: giftID });
    if (!existGift) {
      throw new NotFoundException('Подарунок не знайдено');
    }
    return existGift;
  }

  async updateGift(giftID: string, updateData: CreateGiftParams) {
    // Перевірка на наявність подарунка
    await this.getEventGiftOrThrowError(giftID);

    // Оновлюємо подарунок
    return await this.eventGiftRepository.update(giftID, updateData); // використовуємо правильну конструкцію
  }
}
