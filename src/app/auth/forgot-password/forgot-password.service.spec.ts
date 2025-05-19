import { Test, TestingModule } from '@nestjs/testing';
import { ForgotPasswordService } from './forgot-password.service';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { NotFoundException } from '@nestjs/common';

// 🧪 Мокаємо nodemailer
jest.mock('nodemailer');
const sendMailMock = jest.fn();
(nodemailer.createTransport as jest.Mock).mockReturnValue({
  sendMail: sendMailMock,
});

describe('ForgotPasswordService', () => {
  let service: ForgotPasswordService;

  const mockUser = { id: 'user-id', email: 'test@example.com' };

  const mockUsersService = {
    findByEmail: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const configMap: Record<string, any> = {
        SMTP_HOST: 'smtp.example.com',
        SMTP_PORT: 587,
        SMTP_USER: 'test@example.com',
        SMTP_PASS: 'password',
        JWT_RESET_SECRET: 'reset-secret',
        JWT_RESET_EXPIRES_IN: '1h',
        RESET_PASSWORD_URL: 'https://example.com/reset?token=',
      };
      return configMap[key];
    }),
  };

  beforeEach(async () => {
    sendMailMock.mockClear();
    mockUsersService.findByEmail.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForgotPasswordService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<ForgotPasswordService>(ForgotPasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send reset email to existing user', async () => {
    mockUsersService.findByEmail.mockResolvedValue(mockUser);

    await service.sendResetPasswordEmail(mockUser.email);

    expect(mockUsersService.findByEmail).toHaveBeenCalledWith(mockUser.email);
    expect(sendMailMock).toHaveBeenCalledTimes(1);

    const sentArgs = sendMailMock.mock.calls[0][0];
    expect(sentArgs.to).toBe(mockUser.email);
    expect(sentArgs.subject).toContain('Reset Your Password');
    expect(sentArgs.html).toContain('https://example.com/reset?token=');
  });

  it('should throw NotFoundException for non-existing user', async () => {
    mockUsersService.findByEmail.mockResolvedValue(null);

    await expect(
      service.sendResetPasswordEmail('notfound@example.com'),
    ).rejects.toThrow(NotFoundException);

    expect(sendMailMock).not.toHaveBeenCalled();
  });
});
