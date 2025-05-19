import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { BadRequestException } from '@nestjs/common';
import { GetDashboardResponseDTO } from './dtos';

describe('DashboardController', () => {
  let controller: DashboardController;
  let service: DashboardService;

  const mockDashboardData = {
    user: {
      id: 'user-id',
      name: 'John Doe',
      email: 'john@example.com',
    },
    my_events: [],
    another_events: [],
  };

  const mockDashboardService = {
    getDashboardByUserID: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: DashboardService,
          useValue: mockDashboardService,
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    service = module.get<DashboardService>(DashboardService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return dashboard DTO if service resolves', async () => {
    service.getDashboardByUserID = jest
      .fn()
      .mockResolvedValue(mockDashboardData);

    const result = await controller.getDashboard('user-id');

    expect(service.getDashboardByUserID).toHaveBeenCalledWith('user-id');
    expect(result).toEqual(GetDashboardResponseDTO.factory(mockDashboardData));
  });

  it('should throw BadRequestException if service fails', async () => {
    service.getDashboardByUserID = jest
      .fn()
      .mockRejectedValue(new Error('Dashboard fetch failed'));

    await expect(controller.getDashboard('bad-id')).rejects.toThrow(
      BadRequestException,
    );
  });
});
