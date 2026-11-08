export interface CardType {
  id: number;
  name: string;
  src: string;
}

export interface CardDetailType {
  title: string;
  content: string;
}

/** GET /tarot/result/{id} */
export interface TarotResult {
  category: string;
  title: string;
  cardDescription: string;
  cardList: CardType[];
}

/** GET /saju/result/{id} */
export interface SajuResult {
  cardList: CardType[];
  contentsInfo: CardDetailType[];
}
