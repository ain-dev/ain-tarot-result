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
  /** Lucky place/number line; absent from older backends -> the line is hidden */
  luckyPlace?: string | null;
  luckyNumber?: string | null;
}

/** GET /saju/result/{id} */
export interface SajuResult {
  cardList: CardType[];
  contentsInfo: CardDetailType[];
  /** Lucky place/number line; absent from older backends -> the line is hidden */
  luckyPlace?: string | null;
  luckyNumber?: string | null;
}
