export interface EventWithGifts {
  id: string;
  name: string;
  type: string;
  date: Date;
  gifts?: {
    id: string;
    name: string;
    giftGiver: string | null;
  }[];
}
