import { Injectable, NotFoundException } from '@nestjs/common';
import { EventGiftService } from '../event-gifts/event-gift.service';
import { UsersService } from '../users/users.service';
import { EventsRepository } from './events.repository';
import { CreateEventParams, EventWithGifts } from './interfaces';
import { EventType } from '../../common/enums/event-type.enum';

@Injectable()
export class EventsService {
  constructor(
    private readonly repository: EventsRepository,
    private readonly userService: UsersService,
    private readonly eventGiftService: EventGiftService,
  ) {}

  /**
   * Створює подію, прив'язану до користувача.
   */
  async create(param: CreateEventParams): Promise<EventWithGifts> {
    const user = await this.userService.getById(param.hostId);
    if (!user) {
      throw new NotFoundException('Користувач-організатор не знайдений!');
    }

    const created = await this.repository.create({
      ...param,
      type: param.type as EventType,
      host: {
        connect: {
          id: user.id,
        },
      },
    });

    return await this.getEventByIdOrThrowError(created.id);
  }

  /**
   * Отримати всі події.
   */
  async getAllEvents(): Promise<EventWithGifts[]> {
    const events = await this.repository.findManyWithHost({});

    return events.map((event) => ({
      ...event,
      gifts: [],
    }));
  }

  /**
   * Отримати всі події, створені користувачем.
   */
  async getEventByUserID(userID: string): Promise<EventWithGifts[]> {
    const events = await this.repository.findManyWithHost({
      hostId: userID,
    });

    return events.map((event) => ({
      ...event,
      gifts: [],
    }));
  }

  /**
   * Отримати подію разом з її подарунками.
   */
  async getEventAndGiftsByID(eventID: string): Promise<EventWithGifts> {
    const { id, name, type, date, host } =
      await this.getEventByIdOrThrowError(eventID);

    const eventGifts = await this.eventGiftService.findManyByEventID(eventID);

    const formattedGifts = eventGifts.map((gift) => ({
      id: gift.id,
      name: gift.name,
      purchaseLink: gift.purchaseLink ?? null,
      imageUrl: gift.imageUrl ?? null,
      description: gift.description ?? null,
      price: gift.price ?? null,
      selected: gift.selected ?? false,
      giftGiverId: gift.giftGiverId ?? null,
      giftGiver: gift.giftGiver ? { name: gift.giftGiver.name } : null,
    }));

    return {
      id,
      name,
      type,
      date,
      host: host ? { id: host.id, name: host.name } : null,
      gifts: formattedGifts,
    };
  }

  /**
   * Отримати події, в яких користувач взяв подарунок.
   */
  async getEventsForGiftGiver(giftGiverId: string) {
    const eventIds = new Set<string>();
    const gifts = await this.eventGiftService.getByGiftGiverID(giftGiverId);

    for (const gift of gifts) {
      eventIds.add(gift.eventId);
    }

    return await this.repository.findMany({
      id: {
        in: Array.from(eventIds),
      },
    });
  }

  /**
   * Отримати подію за ID або кинути помилку, якщо її не знайдено.
   */
  async getEventByIdOrThrowError(eventID: string): Promise<EventWithGifts> {
    if (!eventID) {
      throw new NotFoundException('Некоректний ідентифікатор події.');
    }

    const event = await this.repository.findByIdWithHost(eventID);

    if (!event) {
      throw new NotFoundException('Подія не знайдена!');
    }

    return {
      ...event,
      gifts: [],
    };
  }

  /**
   * Оновити дані події за ID.
   */
  async updateEvent(
    eventID: string,
    updateData: Partial<CreateEventParams>,
  ): Promise<EventWithGifts> {
    await this.getEventByIdOrThrowError(eventID);

    await this.repository.update(eventID, updateData);

    return await this.getEventByIdOrThrowError(eventID);
  }

  /**
   * Видалити подію за ID.
   */
  async deleteEvent(eventID: string): Promise<EventWithGifts> {
    const event = await this.getEventByIdOrThrowError(eventID);
    await this.repository.delete(eventID);
    return event;
  }
}
