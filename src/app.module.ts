import { Module } from '@nestjs/common';

import { DashboardModule } from './app/dashboard/dashboard.module';
import { EventGiftModule } from './app/event-gifts/event-gift.module';
import { EventsModule } from './app/events/events.module';
import { UsersModule } from './app/users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ForgotPasswordModule } from './app/auth/forgot-password/forgot-password.module';
import { AuthModule } from './app/auth/auth.module';
import { GuestController } from './app/guest/guest.controller';

@Module({
  imports: [
    UsersModule,
    EventsModule,
    EventGiftModule,
    DashboardModule,
    PrismaModule,
    ForgotPasswordModule,
    AuthModule,
  ],
  controllers: [GuestController],
})
export class AppModule {}
