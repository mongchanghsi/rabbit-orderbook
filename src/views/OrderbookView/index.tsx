import { useState } from "react";
import Orderbook from "../../components/Orderbook";
import { MARKET_TYPE } from "../../components/Orderbook/utils";
import { OrderbookViewContainer, OrderbookViewTitle } from "./style";
import MarketSelector from "../../components/Orderbook/MarketSelector";
import { useCentrifuge } from "../../context/useCentrifuge";
import { Subscription } from "centrifuge";
import toast from "react-hot-toast";

const OrderbookView = () => {
  const { centrifuge } = useCentrifuge();
  const [marketType, setMarketType] = useState<MARKET_TYPE>(
    MARKET_TYPE.BTC_USD
  );

  const unsubscribe = (sub: Subscription, type: string) => {
    if (!centrifuge) return;
    sub.unsubscribe();
    toast.error(`Unsubscribed to ${type} channel.`);
    sub.removeAllListeners();
    centrifuge.removeSubscription(sub);
  };

  const handleUnsubscribe = (newMarket: MARKET_TYPE) => {
    setMarketType(newMarket);

    if (!centrifuge) return;
    const currentMarket = marketType;
    const currentOrderbookSub = centrifuge.getSubscription(
      `orderbook:${currentMarket}`
    );
    const currentMarketSub = centrifuge.getSubscription(
      `market:${currentMarket}`
    );
    if (currentOrderbookSub) unsubscribe(currentOrderbookSub, "orderbook");
    if (currentMarketSub) unsubscribe(currentMarketSub, "market");
  };

  return (
    <OrderbookViewContainer>
      <OrderbookViewTitle>Orderbook</OrderbookViewTitle>
      <MarketSelector
        selectedMarket={marketType}
        handleChange={handleUnsubscribe}
      />
      <Orderbook market={marketType} />
    </OrderbookViewContainer>
  );
};

export default OrderbookView;
