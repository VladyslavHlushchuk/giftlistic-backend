import { ApiProperty } from '@nestjs/swagger';

import { snakeKeys } from 'src/common/utils';
import type { GetDashboardByUserIDResponse } from '../interfaces';

export class GetDashboardResponseDTO {
  @ApiProperty({
    example: {
      id: '5514a9c9-efee-46b5-bc7f-e7c423cffdf7',
      name: 'Vlad',
      email: 'teste@gmail.com',
    },
    description: 'Дані користувача',
  })
  user: Record<string, string>;

  @ApiProperty({
    example: [
      {
        id: '0c0c3bf7-28a0-4fad-afc7-72cb2f8c0005',
        name: 'День народження',
        type: 'BIRTHDAY',
        date: '2024-03-22T00:00:00.000Z',
        gifts: [
          {
            id: '35375376-d3ce-49c1-9bd1-c9cf7cb5514c',
            name: 'Чохол для iPhone 13 Pro',
            gift_giver: 'Agata',
          },
        ],
      },
    ],
    description: 'Список подій користувача з подарунками',
  })
  my_events: Record<string, any>[];

  @ApiProperty({
    example: [
      {
        id: '1c2c3df7-18a0-4bad-bfc7-62cb2f8c1234',
        name: 'Весілля друзів',
        type: 'WEDDING',
        date: '2024-06-10T00:00:00.000Z',
      },
    ],
    description: 'Список подій, на які користувача запросили',
  })
  another_events: Record<string, any>[];

  static factory(dashboardModel: GetDashboardByUserIDResponse) {
    const formattedMyEvents = dashboardModel.my_events?.map((event) => ({
      id: event.id,
      name: event.name,
      type: event.type,
      date: event.date,
      gifts: event.gifts.map((gift) => ({
        id: gift.id,
        name: gift.name,
        gift_giver: gift.giftGiver,
      })),
    }));

    const formattedAnotherEvents = dashboardModel.another_events?.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ createdAt, deletedAt, ...eventResult }) => eventResult,
    );

    return snakeKeys({
      user: dashboardModel.user,
      my_events: formattedMyEvents,
      another_events: formattedAnotherEvents,
    });
  }
}
