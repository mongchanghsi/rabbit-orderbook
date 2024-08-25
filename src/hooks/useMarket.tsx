import { useEffect, useState } from "react";
import {
  IRabbitMarket,
  MARKET_DIRECTION,
  MarketInfoType,
} from "../components/MarketPrice/type";
import { Subscription } from "centrifuge";
import toast from "react-hot-toast";
import { useCentrifuge } from "../context/useCentrifuge";
import { MARKET_TYPE } from "../components/Orderbook/utils";

const DEFAULT_MARKET_INFO: MarketInfoType = {
  last_trade_price: "0",
  last_trade_price_direction: MARKET_DIRECTION.UP,
};

const useMarket = (market: MARKET_TYPE) => {
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

  return { marketInfo };
};

export default useMarket;
