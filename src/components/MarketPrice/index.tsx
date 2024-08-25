import { FC } from "react";
import { MARKET_DIRECTION } from "./type";
import {
  MarketPriceArrow,
  MarketPriceContainer,
  MarketPriceText,
} from "./style";
import { MARKET_TYPE } from "../Orderbook/utils";
import useMarket from "../../hooks/useMarket";

interface IProps {
  market: MARKET_TYPE;
}

const MarketPrice: FC<IProps> = ({ market }) => {
  const { marketInfo } = useMarket(market);

  return (
    <MarketPriceContainer>
      <MarketPriceArrow
        up={
          marketInfo.last_trade_price_direction === MARKET_DIRECTION.UP ? 1 : 0
        }
      >
        {marketInfo.last_trade_price_direction === MARKET_DIRECTION.UP ? (
          <svg
            className="size-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
            />
          </svg>
        ) : (
          <svg
            className="size-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 4.5 15 15m0 0V8.25m0 11.25H8.25"
            />
          </svg>
        )}
      </MarketPriceArrow>

      <MarketPriceText
        up={
          marketInfo.last_trade_price_direction === MARKET_DIRECTION.UP ? 1 : 0
        }
      >
        {marketInfo.last_trade_price}
      </MarketPriceText>
    </MarketPriceContainer>
  );
};

export default MarketPrice;
