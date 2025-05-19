import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RecaptchaService } from './recaptcha/recaptcha.service';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let mockUser: any;

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    getById: jest.fn(),
  };

  const mockRecaptchaService = {
    verify: jest.fn().mockResolvedValue(true),
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mock-jwt-token'),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const map = {
        JWT_SECRET: 'jwt-secret',
        REFRESH_SECRET: 'refresh-secret',
        JWT_RESET_SECRET: 'reset-secret',
      };
      return map[key];
    }),
  };

  const mockPrismaService = {
    user: {
      update: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const hashedPassword = await argon2.hash('password123');

    mockUser = {
      id: 'user-id',
      email: 'test@example.com',
      password: hashedPassword,
    };

    mockUsersService.findByEmail.mockResolvedValue(mockUser);
    mockUsersService.getById.mockResolvedValue(mockUser);
    mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: RecaptchaService, useValue: mockRecaptchaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should login user with valid credentials', async () => {
    const result = await service.login({
      email: 'test@example.com',
      password: 'password123',
      recaptchaToken: 'mock-token',
    });

    expect(result).toHaveProperty('access_token');
    expect(mockRecaptchaService.verify).toHaveBeenCalled();
    expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
      'test@example.com',
    );
  });

  it('should throw NotFoundException if user not found', async () => {
    mockUsersService.findByEmail.mockResolvedValueOnce(null);

    await expect(
      service.login({
        email: 'notfound@example.com',
        password: 'password123',
        recaptchaToken: 'mock-token',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException if password is wrong', async () => {
    const wrongPasswordHash = await argon2.hash('wrong-password');
    const wrongUser = { ...mockUser, password: wrongPasswordHash };
    mockUsersService.findByEmail.mockResolvedValueOnce(wrongUser);

    await expect(
      service.login({
        email: 'test@example.com',
        password: 'password123',
        recaptchaToken: 'mock-token',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should throw if reCAPTCHA verification fails in register', async () => {
    mockRecaptchaService.verify.mockRejectedValueOnce(
      new Error('reCAPTCHA недійсна'),
    );

    const dto = {
      email: 'new@test.com',
      password: '12345678',
      name: 'New User',
      recaptchaToken: 'bad-token',
    };

    await expect(service.register(dto)).rejects.toThrow('reCAPTCHA недійсна');
  });

  it('should throw if email already exists', async () => {
    mockUsersService.findByEmail.mockResolvedValueOnce(mockUser);

    const dto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Existing User',
      recaptchaToken: 'valid',
    };

    await expect(service.register(dto)).rejects.toThrow(
      'Ця електронна адреса вже зареєстрована',
    );
  });

  it('should throw if refresh token is incorrect', async () => {
    mockPrismaService.user.findUnique.mockResolvedValueOnce({
      ...mockUser,
      refreshToken: await argon2.hash('actual-token'),
    });

    await expect(
      service.refreshTokens(mockUser.id, 'wrong-token'),
    ).rejects.toThrow('Невірний Refresh Token');
  });

  it('should throw BadRequestException if logout called without user ID', async () => {
    await expect(service.logout(null)).rejects.toThrow('User ID is required');
  });

  it('should refresh tokens if valid refresh token provided', async () => {
    const refreshToken = 'valid-refresh-token';
    const hashedRefreshToken = await argon2.hash(refreshToken);

    mockPrismaService.user.findUnique.mockResolvedValueOnce({
      ...mockUser,
      refreshToken: hashedRefreshToken,
    });

    const result = await service.refreshTokens(mockUser.id, refreshToken);

    expect(result).toHaveProperty('access_token');
    expect(result).toHaveProperty('refresh_token');
  });

  it('should logout user and remove refresh token', async () => {
    mockPrismaService.user.update.mockResolvedValueOnce({
      ...mockUser,
      refreshToken: null,
    });

    await expect(service.logout(mockUser.id)).resolves.not.toThrow();
    expect(mockPrismaService.user.update).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      data: { refreshToken: null },
    });
  });

  it('should reset password with valid token', async () => {
    const newPassword = 'newPassword123';
    const token = jwt.sign({ sub: mockUser.id }, 'reset-secret', {
      expiresIn: '1h',
    });

    const updatedUser = {
      ...mockUser,
      password: await argon2.hash(newPassword),
    };
    mockUsersService.getById.mockResolvedValueOnce(mockUser);
    mockUsersService.update.mockResolvedValueOnce(updatedUser);

    const result = await service.resetPassword(token, newPassword);
    expect(result).toEqual({ message: 'Пароль успішно скинуто' });
  });

  it('should throw BadRequestException for invalid reset token', async () => {
    const invalidToken = 'invalid.token.here';

    await expect(
      service.resetPassword(invalidToken, 'newPass'),
    ).rejects.toThrow(BadRequestException);
  });

  it('should login with Google and return tokens', async () => {
    const user = {
      id: 'google-user-id',
      email: 'google@test.com',
      name: 'Google User',
    };

    const result = await service.googleLogin(user);

    expect(result).toHaveProperty('access_token');
    expect(result).toHaveProperty('refresh_token');
    expect(result.email).toBe(user.email);
  });
});
