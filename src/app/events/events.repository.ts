import { Injectable } from '@nestjs/common';
import { Event as EventModel, Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/services';
import { EventType } from '../../common/enums/event-type.enum'; // Додаємо Enum типи подій

@Injectable()
export class EventsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(input: Prisma.EventCreateInput): Promise<EventModel> {
    const { name, type, host } = input;

    // Конвертація рядка у дату, якщо необхідно
    const date =
      typeof input.date === 'string' ? new Date(input.date) : input.date;

    return await this.prismaService.event.create({
      data: {
        name,
        type: type as EventType, // Використання Enum
        date,
        host: {
          connect: { id: host.connect.id },
        },
      },
    });
  }

  async findMany(where: Prisma.EventWhereInput): Promise<EventModel[]> {
    return await this.prismaService.event.findMany({
      where,
    });
  }

  async findFirst(eventID: string): Promise<EventModel | null> {
    return await this.prismaService.event.findUnique({
      where: {
        id: eventID,
      },
    });
  }

  async update(
    eventId: string,
    data: Prisma.EventUpdateInput,
  ): Promise<EventModel> {
    return await this.prismaService.event.update({
      where: { id: eventId },
      data,
    });
  }

  async delete(eventId: string): Promise<EventModel> {
    return await this.prismaService.event.delete({
      where: { id: eventId },
    });
  }
}
