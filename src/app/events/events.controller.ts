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
  ApiBearerAuth,
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
  @ApiBearerAuth('access-token')
  async create(@Body() params: CreateEventRequestDTO) {
    try {
      const result = await this.service.create({
        name: params.name,
        date: params.date,
        type: params.type,
        hostId: params.host_id,
      });

      return GetEventResponseDTO.factory(result);
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  /**
   * Отримати інформацію про подію за її ID.
   */
  @Get(':event_id')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: GetEventResponseDTO })
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
  @ApiOkResponse({ type: GetEventResponseDTO, isArray: true })
  @ApiBearerAuth('access-token')
  @Get('user/:user_id')
  async findEventsByUser(@Param('user_id') userID: string) {
    try {
      const events = await this.service.getEventByUserID(userID);
      return events.map((event) => GetEventResponseDTO.factory(event));
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  /**
   * Отримати всі події.
   */
  @ApiOkResponse({ type: GetEventResponseDTO, isArray: true })
  @ApiBearerAuth('access-token')
  @Get()
  async findAllEvents() {
    try {
      const events = await this.service.getAllEvents();
      return events.map((event) => GetEventResponseDTO.factory(event));
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  /**
   * Оновити подію за ID.
   */
  @ApiOkResponse({ type: GetEventResponseDTO })
  @ApiBearerAuth('access-token')
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

  /**
   * Видалити подію за ID.
   */
  @ApiOkResponse({ type: GetEventResponseDTO })
  @ApiBearerAuth('access-token')
  @Delete(':event_id')
  async deleteEvent(@Param('event_id') eventID: string) {
    try {
      const deletedEvent = await this.service.deleteEvent(eventID);
      return GetEventResponseDTO.factory(deletedEvent);
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }
}
