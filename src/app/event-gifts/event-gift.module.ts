import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from 'src/common/services';
import { EventGiftController } from './event-gift.controller';
import { EventGiftRepository } from './event-gift.repository';
import { EventGiftService } from './event-gift.service';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [forwardRef(() => EventsModule)],
  providers: [EventGiftService, EventGiftRepository, PrismaService],
  controllers: [EventGiftController],
  exports: [EventGiftService],
})
export class EventGiftModule {}
