import { Injectable, NotFoundException } from '@nestjs/common';
import { EventGift as EventGiftModel, Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/services';
import type { EventGiftWithGiftGiver } from './interfaces';

@Injectable()
export class EventGiftRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createMany(params: Prisma.EventGiftCreateManyInput[]): Promise<void> {
    await this.prismaService.eventGift.createMany({
      data: params,
    });
  }

  async create({
    eventId,
    name,
    purchaseLink,
    imageUrl,
    description,
    price,
  }: Prisma.EventGiftUncheckedCreateInput): Promise<EventGiftModel> {
    return await this.prismaService.eventGift.create({
      data: {
        eventId,
        name,
        purchaseLink,
        imageUrl,
        description,
        price,
      },
    });
  }

  async findFirst(
    where: Prisma.EventGiftWhereUniqueInput,
  ): Promise<EventGiftModel | null> {
    return await this.prismaService.eventGift.findFirst({
      where,
    });
  }

  async findMany(
    where: Prisma.EventGiftWhereInput,
  ): Promise<EventGiftWithGiftGiver[]> {
    return await this.prismaService.eventGift.findMany({
      where,
      include: {
        giftGiver: true,
      },
    });
  }

  async delete(giftID: string): Promise<EventGiftModel> {
    return await this.prismaService.eventGift.delete({
      where: {
        id: giftID,
      },
    });
  }

  async update(
    giftID: string,
    updateParams: Prisma.EventGiftUpdateInput,
  ): Promise<EventGiftModel> {
    const existingGift = await this.prismaService.eventGift.findFirst({
      where: { id: giftID },
    });

    if (!existingGift) {
      throw new NotFoundException('Подарунок не знайдено!');
    }

    return await this.prismaService.eventGift.update({
      where: { id: giftID },
      data: updateParams,
    });
  }

  async findByIdWithGiftGiver(giftId: string) {
    return this.prismaService.eventGift.findUnique({
      where: { id: giftId },
      include: {
        giftGiver: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}
