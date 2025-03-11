import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma, User as UserModel } from '@prisma/client';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  prisma: any;
  constructor(private readonly usersRepository: UsersRepository) {}

  async findByEmail(email: string): Promise<UserModel | null> {
    return await this.usersRepository.findFirst({ email });
  }

  async create(data: Prisma.UserCreateInput): Promise<UserModel> {
    return await this.usersRepository.create(data);
  }

  async getById(id: string): Promise<UserModel> {
    const user = await this.usersRepository.getById(id);

    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    return user;
  }

  async update(
    id: string,
    updateData: Partial<Prisma.UserUpdateInput>,
  ): Promise<UserModel> {
    return await this.usersRepository.update(id, updateData);
  }
}
