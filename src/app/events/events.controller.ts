import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { BadRequestDTO, UnauthorizedRequestDTO } from 'src/common/dtos';
import {
  CreateEventRequestDTO,
  CreateEventResponseDTO,
  GetEventResponseDTO,
} from './dtos';
import { EventsService } from './events.service';
import { CreateEventParams } from './interfaces';

@ApiTags('Events')
@ApiUnauthorizedResponse({ type: UnauthorizedRequestDTO })
@ApiBadRequestResponse({ type: BadRequestDTO })
@Controller('events')
export class EventsController {
  constructor(private readonly service: EventsService) {}

  /**
   * Створення події.
   */
  @ApiCreatedResponse({ type: CreateEventResponseDTO })
  @Post()
  async create(@Body() params: CreateEventRequestDTO) {
    const { name, date, type, host_id } = params;

    try {
      const result = await this.service.create({
        name,
        date,
        type,
        hostId: host_id,
      });

      return CreateEventResponseDTO.factory(result);
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  /**
   * Отримати інформацію про подію за її ID.
   */
  @ApiOkResponse({ type: GetEventResponseDTO })
  @Get(':event_id')
  async findEvent(@Param('event_id') eventID: string) {
    try {
      const result = await this.service.getEventAndGiftsByID(eventID);
      return GetEventResponseDTO.factory(result);
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  /**
   * Отримати всі події конкретного користувача.
   */
  @ApiOkResponse({ type: GetEventResponseDTO, isArray: true }) // Масив подій
  @Get('user/:user_id')
  async findEventsByUser(@Param('user_id') userID: string) {
    try {
      const events = await this.service.getEventByUserID(userID);
      return events.map((event) =>
        GetEventResponseDTO.factory({
          ...event,
          gifts: [], // Додаємо порожній масив подарунків
        }),
      );
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  /**
   * Отримати всі події.
   */
  @ApiOkResponse({ type: GetEventResponseDTO, isArray: true }) // Масив подій
  @Get()
  async findAllEvents() {
    try {
      const events = await this.service.getAllEvents();
      return events.map((event) =>
        GetEventResponseDTO.factory({
          ...event,
          gifts: [], // Додаємо порожній масив подарунків
        }),
      );
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  @ApiOkResponse({ type: GetEventResponseDTO })
  @Patch(':event_id')
  async updateEvent(
    @Param('event_id') eventID: string,
    @Body() updateData: Partial<CreateEventParams>,
  ) {
    try {
      const updatedEvent = await this.service.updateEvent(eventID, updateData);
      return GetEventResponseDTO.factory(updatedEvent);
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  @ApiOkResponse({ type: GetEventResponseDTO })
  @Delete(':event_id')
  async deleteEvent(@Param('event_id') eventID: string) {
    try {
      const deletedEvent = await this.service.deleteEvent(eventID);
      // Якщо потрібно, можна перетворити результат через фабрику DTO
      return GetEventResponseDTO.factory(deletedEvent);
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }
}
