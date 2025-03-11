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
  async create(param: CreateEventParams) {
    const user = await this.userService.getById(param.hostId);
    if (!user) {
      throw new NotFoundException('Користувач-організатор не знайдений!');
    }

    return await this.repository.create({
      ...param,
      type: param.type as EventType, // Використання Enum
      host: {
        connect: {
          id: user.id,
        },
      },
    });
  }

  /**
   * Отримати всі події.
   */
  async getAllEvents(): Promise<EventWithGifts[]> {
    return await this.repository.findMany({});
  }

  /**
   * Отримати всі події, створені користувачем.
   */
  async getEventByUserID(userID: string) {
    return await this.repository.findMany({
      hostId: userID,
    });
  }

  /**
   * Отримати подію разом з її подарунками.
   */
  async getEventAndGiftsByID(eventID: string): Promise<EventWithGifts> {
    const { id, name, type, date } =
      await this.getEventByIdOrThrowError(eventID);

    const eventGifts = await this.eventGiftService.findManyByEventID(eventID);

    const formattedGifts = eventGifts.map((gift) => ({
      id: gift.id,
      name: gift.name,
      purchaseLink: gift.purchaseLink,
      imageUrl: gift.imageUrl,
      description: gift.description,
      price: gift.price,
      selected: gift.selected,
      giftGiver: gift.giftGiver?.name || null,
    }));

    return {
      id,
      name,
      type,
      date,
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
  async getEventByIdOrThrowError(eventID: string) {
    if (!eventID)
      throw new NotFoundException('Некоректний ідентифікатор події.');

    const event = await this.repository.findFirst(eventID);

    if (!event) {
      throw new NotFoundException('Подія не знайдена!');
    }

    return event;
  }

  /**
   * Оновити дані події за ID.
   */
  async updateEvent(eventID: string, updateData: Partial<CreateEventParams>) {
    // Переконайтеся, що подія існує
    await this.getEventByIdOrThrowError(eventID);

    // Можна додати додаткову логіку валідації чи авторизації

    return await this.repository.update(eventID, updateData);
  }

  /**
   * Видалити подію за ID.
   */
  async deleteEvent(eventID: string) {
    // Перевірка, чи існує подія
    await this.getEventByIdOrThrowError(eventID);

    // Видалення події
    return await this.repository.delete(eventID);
  }
}
