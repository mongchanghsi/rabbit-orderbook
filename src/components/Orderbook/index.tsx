import { useEffect, useRef, useState } from "react";
import { IPrizeSizePair, IRabbitOrderbook, ORDER_TYPE } from "./type";
import { MARKET_TYPE } from "./utils";
import { OrderbookContainer, OrderbookContent, OrderbookTitle } from "./style";
import OrderbookTable from "./OrderbookTable";
import { Subscription } from "centrifuge";
import toast from "react-hot-toast";
import MarketSelector from "./MarketSelector";
import MarketPrice from "../MarketPrice";
import { useCentrifuge } from "../../context/useCentrifuge";

const MAX_ITEMS = 10; // For displaying and also removing excess data

const Orderbook = () => {
  const { centrifuge, isConnected } = useCentrifuge();
  const [marketType, setMarketType] = useState<MARKET_TYPE>(
    MARKET_TYPE.BTC_USD
  );
  const [bids, setBids] = useState<IPrizeSizePair[]>([]);
  const [asks, setAsks] = useState<IPrizeSizePair[]>([]);
  const currentSequence = useRef<number>(0);

  useEffect(() => {
    let sub: Subscription | null = null;

    if (centrifuge) {
      if (isConnected) {
        sub = centrifuge.getSubscription(`orderbook:${marketType}`);
        if (!sub) addSubscription();
      } else {
        if (sub) unsubscribe(sub);
      }
    }

    return () => {
      if (sub) unsubscribe(sub);
    };
  }, [centrifuge, marketType]);

  const addSubscription = async () => {
    const sub = centrifuge!.newSubscription(`orderbook:${marketType}`);
    listenToSubscription(sub);
    sub.subscribe();
    toast.success("Successfully subscribed to orderbook channel.");
  };

  const listenToSubscription = (sub: Subscription) => {
    sub.on("subscribed", (ctx) => {
      const data = ctx.data as IRabbitOrderbook;
      currentSequence.current = data.sequence;
      setBids(() => {
        const output: IPrizeSizePair[] = [];
        slotAndSort(output, data.bids);
        return output;
      });
      setAsks(() => {
        const output: IPrizeSizePair[] = [];
        slotAndSort(output, data.asks);
        return output;
      });
    });

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
    if (!centrifuge) return;
    sub.unsubscribe();
    toast.error("Unsubscribed to orderbook channel.");
    sub.removeAllListeners();
    centrifuge.removeSubscription(sub);
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
    if (!centrifuge) return;
    const currentMarket = marketType;
    const currentOrderbookSub = centrifuge.getSubscription(
      `orderbook:${currentMarket}`
    );
    const currentMarketSub = centrifuge.getSubscription(
      `market:${currentMarket}`
    );
    if (currentOrderbookSub) unsubscribe(currentOrderbookSub);
    if (currentMarketSub) unsubscribe(currentMarketSub);
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
          orders={bids}
        />
        <MarketPrice market={marketType} />
        <OrderbookTable
          market={marketType}
          orderType={ORDER_TYPE.ASK}
          orders={asks}
        />
      </OrderbookContent>
    </OrderbookContainer>
  );
};

export default Orderbook;
