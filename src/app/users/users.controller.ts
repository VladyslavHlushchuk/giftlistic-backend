import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserResponseDTO, UpdateUserDTO } from './dtos';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ type: UserResponseDTO })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.getById(id);
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }
    return user;
  }

  @ApiOkResponse({ type: UserResponseDTO })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updateData: UpdateUserDTO) {
    return await this.usersService.update(id, updateData);
  }
}
