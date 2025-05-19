import { Test, TestingModule } from '@nestjs/testing';
import { ResetPasswordController } from './reset-password.controller';
import { AuthService } from '../auth.service';
import { BadRequestException } from '@nestjs/common';

describe('ResetPasswordController', () => {
  let controller: ResetPasswordController;

  const mockAuthService = {
    resetPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResetPasswordController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<ResetPasswordController>(ResetPasswordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return success message from AuthService', async () => {
    const dto = {
      token: 'valid-token',
      newPassword: 'newStrongPassword123',
    };

    const expectedResponse = { message: 'Пароль успішно скинуто' };
    mockAuthService.resetPassword.mockResolvedValueOnce(expectedResponse);

    const result = await controller.resetPassword(dto);

    expect(result).toEqual(expectedResponse);
    expect(mockAuthService.resetPassword).toHaveBeenCalledWith(
      dto.token,
      dto.newPassword,
    );
  });

  it('should throw BadRequestException if AuthService throws', async () => {
    const dto = {
      token: 'invalid-token',
      newPassword: 'somePassword',
    };

    mockAuthService.resetPassword.mockRejectedValueOnce(
      new Error('Невірний або прострочений токен'),
    );

    await expect(controller.resetPassword(dto)).rejects.toThrow(
      BadRequestException,
    );

    expect(mockAuthService.resetPassword).toHaveBeenCalledWith(
      dto.token,
      dto.newPassword,
    );
  });
});
