import { ApiProperty } from '@nestjs/swagger';
import { GiftResponseDTO } from './gift-response.dto';
import { EventGiftWithGiftGiver } from '../interfaces';

/**
 * DTO для відповіді з масивом подарунків.
 */
export class GetEventGiftsResponseDTO {
  @ApiProperty({ type: [GiftResponseDTO] })
  data: GiftResponseDTO[];

  static factory(gifts: EventGiftWithGiftGiver[]): GetEventGiftsResponseDTO {
    const dto = new GetEventGiftsResponseDTO();
    dto.data = gifts.map(GiftResponseDTO.fromEntity);
    return dto;
  }
}
