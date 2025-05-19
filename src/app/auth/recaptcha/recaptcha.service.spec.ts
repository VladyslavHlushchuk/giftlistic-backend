import { Test, TestingModule } from '@nestjs/testing';
import { RecaptchaService } from './recaptcha.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { BadRequestException } from '@nestjs/common';

describe('RecaptchaService', () => {
  let service: RecaptchaService;

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      if (key === 'RECAPTCHA_SECRET_KEY') return 'fake-secret';
      return null;
    }),
  };

  const mockHttpService = {
    post: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecaptchaService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<RecaptchaService>(RecaptchaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return true in development mode', async () => {
    process.env.NODE_ENV = 'development';
    const result = await service.verify('any-token');
    expect(result).toBe(true);
  });

  it('should return true for dummyTokenForDev', async () => {
    process.env.NODE_ENV = 'production';
    const result = await service.verify('dummyTokenForDev');
    expect(result).toBe(true);
  });

  it('should return true if Google response is successful', async () => {
    process.env.NODE_ENV = 'production';
    mockHttpService.post.mockReturnValue(of({ data: { success: true } }));

    const result = await service.verify('valid-token');
    expect(result).toBe(true);
    expect(mockHttpService.post).toHaveBeenCalled();
  });

  it('should throw BadRequestException if Google response is failure', async () => {
    process.env.NODE_ENV = 'production';
    mockHttpService.post.mockReturnValue(of({ data: { success: false } }));

    await expect(service.verify('invalid-token')).rejects.toThrow(
      BadRequestException,
    );
  });
});
