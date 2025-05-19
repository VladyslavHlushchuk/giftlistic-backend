import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Body,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EventGiftService } from '../event-gifts/event-gift.service';
import { SelectGiftRequestDTO } from '../event-gifts/dtos/select-gift-request.dto ';

@ApiTags('Guest')
@Controller('guest')
export class GuestController {
  constructor(private readonly giftService: EventGiftService) {}

  @Get('gift/:gift_id')
  async getGiftById(@Param('gift_id') id: string) {
    const gift = await this.giftService.findByIdWithGiftGiver(id);

    if (!gift) {
      throw new NotFoundException('Подарунок не знайдено');
    }

    return {
      id: gift.id,
      name: gift.name,
      imageUrl: gift.imageUrl ?? null,
      description: gift.description ?? null,
      price: gift.price ?? null,
      purchaseLink: gift.purchaseLink ?? null,
      selected: gift.selected ?? false,
      giftGiver: gift.giftGiver?.name ?? null,
      giftGiverId: gift.giftGiverId ?? null, // <-- Додай це!
    };
  }

  @Post('gift/select')
  async selectGift(@Body() dto: SelectGiftRequestDTO) {
    const updatedGift = await this.giftService.selectGift({
      giftID: dto.giftId,
      giftGiverId: dto.giftGiverId,
    });

    if (!updatedGift) {
      throw new NotFoundException('Подарунок не знайдено');
    }

    return {
      success: true,
      gift: updatedGift,
    };
  }
}
