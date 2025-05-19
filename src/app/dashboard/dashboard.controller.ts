import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { BadRequestDTO } from 'src/common/dtos';
import { DashboardService } from './dashboard.service';
import { GetDashboardResponseDTO } from './dtos';

@ApiTags('Dashboard')
@ApiBadRequestResponse({ type: BadRequestDTO })
@ApiBearerAuth('access-token')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * @param
   * @returns
   */
  @ApiOkResponse({ type: GetDashboardResponseDTO })
  @Get(':user_id')
  async getDashboard(@Param('user_id') user_id: string) {
    try {
      const dashboardData =
        await this.dashboardService.getDashboardByUserID(user_id);
      return GetDashboardResponseDTO.factory(dashboardData);
    } catch (err) {
      throw new BadRequestException(
        err?.message || 'Не вдалося отримати Dashboard',
      );
    }
  }
}
