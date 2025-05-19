export interface CreateGiftParams {
  eventId: string;
  name: string;
  purchaseLink?: string;
  imageUrl?: string;
  description?: string;
  price?: number;
  selected?: boolean;
}
