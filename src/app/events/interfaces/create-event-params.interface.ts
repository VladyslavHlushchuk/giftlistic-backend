import { EventType } from 'src/common/enums/event-type.enum';

export interface CreateEventParams {
  name: string;
  type: EventType;
  date: Date;
  hostId: string;
}
