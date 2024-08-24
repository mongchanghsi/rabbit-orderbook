export enum MARKET_TYPE {
  BTC_USD = "BTC-USD",
  ETH_USD = "ETH-USD",
  SOL_USD = "SOL-USD",
}

export const getMarketAndCurrency = (marketType: MARKET_TYPE) => {
  return marketType.split("-");
}