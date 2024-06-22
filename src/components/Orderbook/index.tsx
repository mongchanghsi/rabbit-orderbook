import { useEffect, useRef, useState } from "react";
import centrifugeClient from "../../websocket";
import { IPrizeSizePair, IRabbitOrderbook, ORDER_TYPE } from "./type";
import { MARKET_TYPE } from "./utils";
import { OrderbookContainer, OrderbookContent, OrderbookTitle } from "./style";
import OrderbookTable from "./OrderbookTable";
import { Subscription } from "centrifuge";
import toast from "react-hot-toast";
import MarketSelector from "./MarketSelector";
import { RabbitXService } from "../../service";

const MAX_ITEMS = 10; // For displaying and also removing excess data

const Orderbook = () => {
  const rabbitXService = new RabbitXService();
  const [marketType, setMarketType] = useState<MARKET_TYPE>(
    MARKET_TYPE.BTC_USD
  );
  const [bids, setBids] = useState<IPrizeSizePair[]>([]);
  const [asks, setAsks] = useState<IPrizeSizePair[]>([]);
  const currentSequence = useRef<number>(0);

  useEffect(() => {
    centrifugeClient.connect();

    return () => {
      centrifugeClient.disconnect();
    };
  }, []);

  useEffect(() => {
    let sub: Subscription | null = null;
    sub = centrifugeClient.getSubscription(`orderbook:${marketType}`);

    if (!sub) {
      addSubscription();
    }

    return () => {
      if (sub) {
        unsubscribe(sub);
      }
    };
  }, [marketType]);

  const addSubscription = () => {
    rabbitXService.getOrderbookSnapshot(marketType);
    const sub = centrifugeClient.newSubscription(`orderbook:${marketType}`);
    listenToSubscription(sub);
    sub.subscribe();
    toast.success("Successfully subscribed to channel.");
  };

  const listenToSubscription = (sub: Subscription) => {
    sub.on("publication", (ctx) => {
      const data = ctx.data as IRabbitOrderbook;
      if (
        currentSequence.current !== 0 &&
        data.sequence - currentSequence.current !== 1
      ) {
        console.log("Data not in sequence anymore");
        unsubscribe(sub);
        addSubscription();
      } else {
        currentSequence.current = data.sequence;
        setBids((prev) => {
          const output = [...prev];
          slotAndSort(output, data.bids);
          return output;
        });
        setAsks((prev) => {
          const output = [...prev];
          slotAndSort(output, data.asks);
          return output;
        });
      }
    });
  };

  const resetData = () => {
    currentSequence.current = 0;
    setBids([]);
    setAsks([]);
  };

  const unsubscribe = (sub: Subscription) => {
    resetData();
    sub.unsubscribe();
    toast.error("Unsubscribed to channel.");
    sub.removeAllListeners();
    centrifugeClient.removeSubscription(sub);
  };

  const slotAndSort = (
    currentOrders: IPrizeSizePair[],
    newOrders: IPrizeSizePair[]
  ) => {
    newOrders.forEach((newOrder) => {
      const index = currentOrders.findIndex(
        (currentOrder) => currentOrder[0] === newOrder[0]
      );
      if (index !== -1) {
        if (+newOrder[1] === 0) {
          currentOrders.splice(index, 1);
        } else {
          currentOrders[index] = newOrder;
        }
      } else if (+newOrder[1] > 0) {
        currentOrders.push(newOrder);
      }
    });
    currentOrders.sort((a, b) => +b[0] - +a[0]);
  };

  const handleUnsubscribe = (newMarket: MARKET_TYPE) => {
    const currentMarket = marketType;
    const currentSub = centrifugeClient.getSubscription(
      `orderbook:${currentMarket}`
    );
    if (currentSub) {
      unsubscribe(currentSub);
    }
    resetData();
    setMarketType(newMarket);
  };

  return (
    <OrderbookContainer>
      <OrderbookTitle>Orderbook</OrderbookTitle>
      <MarketSelector
        selectedMarket={marketType}
        handleChange={handleUnsubscribe}
      />
      <OrderbookContent>
        <OrderbookTable
          market={marketType}
          orderType={ORDER_TYPE.BID}
          orders={bids.slice(0, MAX_ITEMS)}
        />
        <OrderbookTable
          market={marketType}
          orderType={ORDER_TYPE.ASK}
          orders={asks.slice(0, MAX_ITEMS)}
        />
      </OrderbookContent>
    </OrderbookContainer>
  );
};

export default Orderbook;
