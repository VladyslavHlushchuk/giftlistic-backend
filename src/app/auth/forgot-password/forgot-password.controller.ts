// forgot-password.controller.ts
import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { ForgotPasswordService } from './forgot-password.service';

class ForgotPasswordDto {
  email: string;
}

@ApiTags('Auth')
@Controller('auth')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @ApiCreatedResponse({
    description: 'Лист з посиланням для скидання паролю відправлено',
  })
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    try {
      await this.forgotPasswordService.sendResetPasswordEmail(dto.email);
      return { message: 'Лист з посиланням для скидання паролю відправлено' };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
