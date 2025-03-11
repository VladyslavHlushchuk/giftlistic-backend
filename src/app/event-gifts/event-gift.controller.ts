import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { BadRequestDTO } from 'src/common/dtos';
import {
  CreateEventGiftRequestDTO,
  CreateEventGiftsResponseDTO,
  GetEventGiftsResponseDTO,
} from './dtos';

import { SelectGiftRequestDTO } from './dtos/select-gift-request.dto ';
import { EventGiftService } from './event-gift.service';
import { CreateGiftParams } from './interfaces';
import { CreateEventGiftsRequestDTO } from './dtos/create-event-gifts-request.dto';

@ApiTags('Gifts')
@ApiBadRequestResponse({ type: BadRequestDTO })
@Controller('event-gift')
export class EventGiftController {
  constructor(private readonly eventGiftService: EventGiftService) {}

  /**
   * Створює один подарунок з усіма атрибутами.
   */
  @ApiCreatedResponse({ type: CreateEventGiftsResponseDTO })
  @Post()
  async create(@Body() params: CreateEventGiftRequestDTO) {
    const {
      eventId,
      name,
      purchaseLink,
      imageUrl,
      description,
      price,
      selected,
    } = params;

    try {
      const eventGift = await this.eventGiftService.create({
        eventId,
        name,
        purchaseLink,
        imageUrl,
        description,
        price,
        selected,
      });

      return CreateEventGiftsResponseDTO.factory(eventGift);
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  /**
   * Масове створення подарунків.
   */
  @ApiCreatedResponse({ type: GetEventGiftsResponseDTO })
  @Post('many')
  async createMany(@Body() params: CreateEventGiftsRequestDTO) {
    const { eventId, gifts } = params; // Використовуємо eventId замість eventid

    if (!gifts || gifts.length === 0) {
      throw new BadRequestException('Список подарунків не може бути порожнім.');
    }

    try {
      const createdGifts = await this.eventGiftService.createMany({
        eventId,
        gifts,
      });

      return GetEventGiftsResponseDTO.factory(createdGifts);
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  /**
   * Отримання всіх подарунків для події.
   */
  @ApiResponse({ type: GetEventGiftsResponseDTO })
  @Get(':eventId')
  async findEventGifts(@Param('eventId') eventId: string) {
    try {
      const eventGifts = await this.eventGiftService.findManyByEventID(eventId);
      return GetEventGiftsResponseDTO.factory(eventGifts);
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  /**
   * Видалення подарунку.
   */
  @ApiOkResponse()
  @Delete(':giftId')
  async deleteGift(@Param('giftId') giftId: string) {
    try {
      await this.eventGiftService.delete(giftId);
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  /**
   * Вибір подарунку користувачем.
   */
  @ApiOkResponse()
  @Post('/select')
  async selectGift(@Body() selectGiftDto: SelectGiftRequestDTO) {
    const { giftId, giftGiverId } = selectGiftDto;

    // Логіка для вибору подарунка
    return await this.eventGiftService.selectGift({
      giftID: giftId,
      giftGiverId: giftGiverId,
    });
  }

  /**
   * Оновлення подарунку.
   */
  @ApiOkResponse({ type: CreateEventGiftsResponseDTO })
  @Put(':id')
  async updateGift(
    @Param('id') giftID: string,
    @Body() updateGiftData: CreateGiftParams,
  ) {
    try {
      const updatedGift = await this.eventGiftService.updateGift(
        giftID,
        updateGiftData,
      );
      return CreateEventGiftsResponseDTO.factory(updatedGift);
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }
}
