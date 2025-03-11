import { Module } from '@nestjs/common';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

import { EventsModule } from '../events/events.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, EventsModule], // Імпортуємо необхідні модулі
  controllers: [DashboardController], // Контролери
  providers: [DashboardService], // Сервіси
  exports: [DashboardService], // Додаємо експорт, якщо в майбутньому сервіс буде використовуватись в інших модулях
})
export class DashboardModule {}
