import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  Req,
  UseGuards,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { BadRequestDTO } from 'src/common/dtos';
import { LoginRequestDTO, LoginUserResponseDTO, RegisterDto } from './dtos';
import { ResetPasswordRequestDTO } from './dtos/reset-password-request.dto/reset-password-request.dto';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user?: any;
}

@ApiTags('Auth')
@ApiBadRequestResponse({ type: BadRequestDTO })
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOkResponse({ type: LoginUserResponseDTO })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiOkResponse({ type: LoginUserResponseDTO })
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginRequestDTO) {
    return this.authService.login(dto);
  }

  @HttpCode(200)
  @Post('refresh')
  async refresh(@Body() body) {
    return this.authService.refreshTokens(body.userId, body.refresh_token);
  }

  @HttpCode(200)
  @Post('logout')
  async logout(@Body() body: { userId: string }) {
    return this.authService.logout(body.userId);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordRequestDTO) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Порожній метод — редірект обробляє NestJS + passport-google-oauth
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    const tokens = await this.authService.googleLogin(req.user);
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    const redirectUrl = new URL('http://localhost:3000/auth/google/callback');

    redirectUrl.searchParams.set('id', tokens.id);
    redirectUrl.searchParams.set('name', tokens.name);
    redirectUrl.searchParams.set('email', tokens.email);
    redirectUrl.searchParams.set('access_token', tokens.access_token);
    redirectUrl.searchParams.set('refresh_token', tokens.refresh_token);

    return res.redirect(redirectUrl.toString());
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: AuthenticatedRequest) {
    if (!req.user) {
      throw new NotFoundException('Користувача не знайдено');
    }
    return {
      message: 'Профіль успішно отримано',
      data: req.user,
    };
  }
}
