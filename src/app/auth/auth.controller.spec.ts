import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    refreshTokens: jest.fn(),
    logout: jest.fn(),
    resetPassword: jest.fn(),
    googleLogin: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call register()', async () => {
    const dto = {
      email: 'test@test.com',
      password: '12345678',
      name: 'Test',
      recaptchaToken: 'mock-token',
    };
    const result = { id: 'user-id', email: dto.email };
    mockAuthService.register.mockResolvedValueOnce(result);

    const response = await controller.register(dto);

    expect(response).toEqual(result);
    expect(mockAuthService.register).toHaveBeenCalledWith(dto);
  });

  it('should call login()', async () => {
    const dto = {
      email: 'test@test.com',
      password: '12345678',
      name: 'Test',
      recaptchaToken: 'mock-token',
    };

    const tokens = { access_token: 'jwt', refresh_token: 'refresh' };
    mockAuthService.login.mockResolvedValueOnce(tokens);

    const response = await controller.login(dto);

    expect(response).toEqual(tokens);
    expect(mockAuthService.login).toHaveBeenCalledWith(dto);
  });

  it('should call refresh()', async () => {
    const body = { userId: 'user-id', refresh_token: 'token' };
    const tokens = { access_token: 'new-jwt', refresh_token: 'new-refresh' };
    mockAuthService.refreshTokens.mockResolvedValueOnce(tokens);

    const response = await controller.refresh(body);

    expect(response).toEqual(tokens);
    expect(mockAuthService.refreshTokens).toHaveBeenCalledWith(
      body.userId,
      body.refresh_token,
    );
  });

  it('should call logout()', async () => {
    const body = { userId: 'user-id' };
    mockAuthService.logout.mockResolvedValueOnce(undefined);

    const result = await controller.logout(body);

    expect(result).toBeUndefined();
    expect(mockAuthService.logout).toHaveBeenCalledWith('user-id');
  });

  it('should throw if getProfile has no user', async () => {
    await expect(controller.getProfile({ user: null } as any)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return user profile if user exists', async () => {
    const mockUser = { id: '123', name: 'User' };

    const result = await controller.getProfile({ user: mockUser } as any);

    expect(result).toEqual({
      message: 'Профіль успішно отримано',
      data: mockUser,
    });
  });
});
