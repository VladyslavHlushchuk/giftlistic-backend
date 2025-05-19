export interface Gift {
  name: string;
  purchaseLink?: string;
  imageUrl?: string;
  description?: string;
  price?: number;
}

export interface CreateGiftsParams {
  eventId: string;
  gifts: Gift[];
}
