export type IPrizeSizePair = [string, string];

export interface IOrderbookData {
  asks: IPrizeSizePair[];
  bids: IPrizeSizePair[];
}

export interface IRabbitOrderbook extends IOrderbookData {
  market_id: string;
  sequence: number;
  timestamp: number;
}

export enum ORDER_TYPE {
  BID = "BID",
  ASK = "ASK",
}
