import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { UsersService } from '../users/users.service';
import { EmailAlreadyRegisteredException } from 'src/common/errors';
import { LoginUserParams } from './interfaces';
import { LoginUserResponseDTO, RegisterDto } from './dtos';
import { PrismaService } from '../../prisma/prisma.service';
import { RecaptchaService } from './recaptcha/recaptcha.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly recaptchaService: RecaptchaService,
  ) {}

  async register(dto: RegisterDto & { recaptchaToken: string }) {
    await this.recaptchaService.verify(dto.recaptchaToken);

    const { name, email, password } = dto;
    if (!name) throw new BadRequestException("Ім'я обов'язкове");

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new EmailAlreadyRegisteredException();
    }

    const hashedPassword = await argon2.hash(password);
    const newUser = await this.usersService.create({
      name,
      email,
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(newUser.id, newUser.email);
    await this.updateRefreshToken(newUser.id, tokens.refresh_token);

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      ...tokens,
    };
  }

  async login(dto: LoginUserParams & { recaptchaToken: string }) {
    await this.recaptchaService.verify(dto.recaptchaToken);

    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    const isPasswordValid = await argon2.verify(user.password, dto.password);
    if (!isPasswordValid) {
      throw new ForbiddenException('Невірний пароль');
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return LoginUserResponseDTO.factory(user, tokens);
  }

  async resetPassword(token: string, newPassword: string) {
    let payload: any;
    try {
      payload = jwt.verify(
        token,
        this.configService.get<string>('JWT_RESET_SECRET'),
      );
    } catch (error) {
      throw new BadRequestException('Невірний або прострочений токен');
    }

    const userId = payload.sub;
    const user = await this.usersService.getById(userId);
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    const hashedPassword = await argon2.hash(newPassword);
    await this.usersService.update(userId, { password: hashedPassword });

    return { message: 'Пароль успішно скинуто' };
  }

  private async generateTokens(
    userId: string,
    email: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const access_token = await this.jwtService.signAsync(
      { sub: userId, email },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15m',
      },
    );

    const refresh_token = await this.jwtService.signAsync(
      { sub: userId },
      {
        secret: this.configService.get<string>('REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );

    return { access_token, refresh_token };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Доступ заборонено');

    const isMatch = await argon2.verify(user.refreshToken, refreshToken);
    if (!isMatch) throw new ForbiddenException('Невірний Refresh Token');

    const tokens = await this.generateTokens(user.id, user.email);

    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async logout(userId: string) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async googleLogin(user: any) {
    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }
}
