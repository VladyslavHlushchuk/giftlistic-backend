import { Injectable } from '@nestjs/common';

import { EventsService } from '../events/events.service';
import { UsersService } from '../users/users.service';

import type { EventWithGifts } from '../events/interfaces';
import type { GetDashboardByUserIDResponse } from './interfaces';

@Injectable()
export class DashboardService {
  constructor(
    private readonly usersService: UsersService,
    private readonly eventsService: EventsService,
  ) {}

  async getDashboardByUserID(
    userID: string,
  ): Promise<GetDashboardByUserIDResponse> {
    const { id, name, email } = await this.usersService.getById(userID);

    const events = await this.eventsService.getEventByUserID(userID);
    const anotherEvents =
      await this.eventsService.getEventsForGiftGiver(userID);

    const giftsByEvent: EventWithGifts[] = [];

    for (const event of events) {
      const eventGifts = await this.eventsService.getEventAndGiftsByID(
        event.id,
      );

      giftsByEvent.push(eventGifts);
    }

    return {
      user: { id, name, email },
      my_events: giftsByEvent,
      another_events: anotherEvents,
    };
  }
}
