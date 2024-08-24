import { FC, useEffect, useState } from "react";
import { IRabbitMarket, MARKET_DIRECTION, MarketInfoType } from "./type";
import {
  MarketPriceArrow,
  MarketPriceContainer,
  MarketPriceText,
} from "./style";
import { MARKET_TYPE } from "../Orderbook/utils";
import { useCentrifuge } from "../../context/useCentrifuge";
import { Subscription } from "centrifuge";
import toast from "react-hot-toast";

interface IProps {
  market: MARKET_TYPE;
}

const DEFAULT_MARKET_INFO: MarketInfoType = {
  last_trade_price: "0",
  last_trade_price_direction: MARKET_DIRECTION.UP,
};

const MarketPrice: FC<IProps> = ({ market }) => {
  const { centrifuge, isConnected } = useCentrifuge();
  const [marketInfo, setMarketInfo] =
    useState<MarketInfoType>(DEFAULT_MARKET_INFO);

  useEffect(() => {
    let sub: Subscription | null = null;

    if (centrifuge) {
      if (isConnected) {
        sub = centrifuge.getSubscription(`market:${market}`);
        if (!sub) addSubscription();
      } else {
        if (sub) unsubscribe(sub);
      }
    }

    return () => {
      if (sub) unsubscribe(sub);
    };
  }, [centrifuge, market]);

  const addSubscription = async () => {
    const sub = centrifuge!.newSubscription(`market:${market}`);
    listenToSubscription(sub);
    sub.subscribe();
    toast.success("Successfully subscribed to market channel.");
  };

  const listenToSubscription = (sub: Subscription) => {
    sub.on("subscribed", (ctx) => {
      const data = ctx.data as IRabbitMarket;
      setMarketInfo({
        last_trade_price: data.last_trade_price,
        last_trade_price_direction: MARKET_DIRECTION.UP,
      });
    });

    sub.on("publication", (ctx) => {
      const data = ctx.data as IRabbitMarket;
      if (data.last_trade_price) {
        setMarketInfo((prev) => {
          return {
            last_trade_price: data.last_trade_price,
            last_trade_price_direction:
              +prev.last_trade_price > +data.last_trade_price
                ? MARKET_DIRECTION.DOWN
                : MARKET_DIRECTION.UP,
          };
        });
      }
    });
  };

  const unsubscribe = (sub: Subscription) => {
    resetData();
    if (!centrifuge) return;
    sub.unsubscribe();
    toast.error("Unsubscribed to market channel.");
    sub.removeAllListeners();
    centrifuge.removeSubscription(sub);
  };

  const resetData = () => {
    setMarketInfo(DEFAULT_MARKET_INFO);
  };

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
