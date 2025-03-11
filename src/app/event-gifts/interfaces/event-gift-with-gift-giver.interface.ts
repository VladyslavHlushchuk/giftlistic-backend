import type {
  EventGift as EventGiftModel,
  User as UserModel,
} from '@prisma/client';

/**
 * Інтерфейс для представлення подарунку разом із інформацією про дарувальника.
 */
export interface EventGiftWithGiftGiver extends EventGiftModel {
  giftGiver: UserModel | null;
}
