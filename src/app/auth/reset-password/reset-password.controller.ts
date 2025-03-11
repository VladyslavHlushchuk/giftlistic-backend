import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { ResetPasswordRequestDTO } from '../dtos/reset-password-request.dto/reset-password-request.dto';
import { AuthService } from '../auth.service';

@ApiTags('Auth')
@Controller('auth')
export class ResetPasswordController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({ description: 'Пароль успішно скинуто' })
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordRequestDTO) {
    try {
      return await this.authService.resetPassword(dto.token, dto.newPassword);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
