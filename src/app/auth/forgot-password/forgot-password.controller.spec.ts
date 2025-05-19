import { Test, TestingModule } from '@nestjs/testing';
import { ForgotPasswordController } from './forgot-password.controller';
import { ForgotPasswordService } from './forgot-password.service';
import { BadRequestException } from '@nestjs/common';

describe('ForgotPasswordController', () => {
  let controller: ForgotPasswordController;

  const mockForgotPasswordService = {
    sendResetPasswordEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForgotPasswordController],
      providers: [
        {
          provide: ForgotPasswordService,
          useValue: mockForgotPasswordService,
        },
      ],
    }).compile();

    controller = module.get<ForgotPasswordController>(ForgotPasswordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return success message if email sent', async () => {
    mockForgotPasswordService.sendResetPasswordEmail.mockResolvedValueOnce(
      undefined,
    );

    const response = await controller.forgotPassword({
      email: 'test@example.com',
    });

    expect(response).toEqual({
      message: 'Лист з посиланням для скидання паролю відправлено',
    });

    expect(
      mockForgotPasswordService.sendResetPasswordEmail,
    ).toHaveBeenCalledWith('test@example.com');
  });

  it('should throw BadRequestException if service fails', async () => {
    mockForgotPasswordService.sendResetPasswordEmail.mockRejectedValueOnce(
      new Error('Сервіс недоступний'),
    );

    await expect(
      controller.forgotPassword({ email: 'broken@example.com' }),
    ).rejects.toThrow(BadRequestException);

    expect(
      mockForgotPasswordService.sendResetPasswordEmail,
    ).toHaveBeenCalledWith('broken@example.com');
  });
});
