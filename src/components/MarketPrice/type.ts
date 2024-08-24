export enum MARKET_DIRECTION {
  UP = "UP",
  DOWN = "DOWN",
}

export type MarketInfoType = {
  last_trade_price: string;
  last_trade_price_direction: MARKET_DIRECTION;
};
