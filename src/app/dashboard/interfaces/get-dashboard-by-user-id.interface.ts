import type { Event as EventModel } from '@prisma/client';
import type { EventWithGifts } from 'src/app/events/interfaces';

export interface GetDashboardByUserIDResponse {
  /**
   * Інформація про користувача
   */
  user: {
    id: string;
    name: string;
    email: string;
  };

  /**
   * Події, які створив користувач, разом із подарунками
   */
  my_events: EventWithGifts[];

  /**
   * Події, в яких користувач бере участь як гість
   */
  another_events: EventModel[];
}
