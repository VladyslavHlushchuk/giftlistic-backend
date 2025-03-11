import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User as UserModel } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(params: Prisma.UserCreateInput): Promise<UserModel> {
    const { email, name, password } = params;

    return await this.prismaService.user.create({
      data: {
        email,
        name,
        password,
      },
    });
  }

  async findFirst(where: Prisma.UserWhereInput): Promise<UserModel> {
    return await this.prismaService.user.findFirst({
      where,
    });
  }

  async getById(id: string): Promise<UserModel | null> {
    return await this.prismaService.user.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    updateData: Partial<Prisma.UserUpdateInput>,
  ): Promise<UserModel> {
    return await this.prismaService.user.update({
      where: { id },
      data: updateData,
    });
  }
}
