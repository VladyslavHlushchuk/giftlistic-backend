export interface EventWithGifts {
  id: string;
  name: string;
  type: string;
  date: Date;
  host?: {
    id: string;
    name: string;
  };
  gifts: {
    id: string;
    name: string;
    purchaseLink: string | null;
    imageUrl: string | null;
    description: string | null;
    price: number | null;
    selected: boolean;
    giftGiverId: string | null;
    giftGiver: { name: string } | null;
  }[];
}
