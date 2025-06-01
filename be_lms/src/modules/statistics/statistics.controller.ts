import { Controller, Get, Param, Req } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('overview')
  getSystemOverview() {
    return this.statisticsService.getSystemOverview();
  }

  @Get('revenue-by-month')
  getRevenueByMonth() {
    return this.statisticsService.getMonthlyRevenue();
  }
  @Get('teacher/:teacherId/overview')
  getTeacherStats(@Param('teacherId') teacherId: string) {
    return this.statisticsService.getTeacherOverview(+teacherId);
  }

  @Get('teacher/:teacherId/registrations-per-month')
  getTeacherChart(@Param('teacherId') teacherId: string) {
    return this.statisticsService.getTeacherMonthlyRegistrations(+teacherId);
  }
}
