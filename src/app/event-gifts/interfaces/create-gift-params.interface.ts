export interface CreateGiftParams {
  eventId: string;
  name: string;
  purchaseLink?: string; // Посилання на купівлю подарунку
  imageUrl?: string; // Посилання на зображення подарунку
  description?: string; // Опис подарунку
  price?: number; // Вартість подарунку
  selected?: boolean; // Чи вибраний подарунок гостем
}
