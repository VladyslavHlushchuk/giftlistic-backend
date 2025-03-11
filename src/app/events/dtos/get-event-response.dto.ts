import { ApiProperty } from '@nestjs/swagger';

import { snakeKeys } from 'src/common/utils';
import type { EventWithGifts } from '../interfaces';

export class GetEventResponseDTO {
  @ApiProperty({
    example: '0c0c3bf7-28a0-4fad-afc7-72cb2f8c0005',
  })
  id: string;

  @ApiProperty({
    example: 'Baby Shower',
  })
  name: string;

  @ApiProperty({
    example: 'BABY_SHOWER',
  })
  type: string;

  @ApiProperty({
    example: '2024-03-22T00:00:00.000Z',
  })
  date: string;

  @ApiProperty({
    example: [
      {
        id: '35375376-d3ce-49c1-9bd1-c9cf7cb5514c',
        name: 'Чохол для iPhone 13 Pro',
        gift_giver: 'Олександр',
      },
      {
        id: 'a7d4e37f-9c52-44d6-9e2c-7d3a4a87a915',
        name: 'Порт-хаб USB-C',
        gift_giver: null,
      },
    ],
  })
  gifts: Record<string, string | null>[];

  static factory(eventWithGifts: EventWithGifts) {
    return snakeKeys(eventWithGifts);
  }
}
