import { useEffect, useState } from "react";
import centrifugeClient from "../../websocket";
import { IPrizeSizePair, IRabbitOrderbook, ORDER_TYPE } from "./type";
import { ORDER_BOOK_TYPES } from "./utils";
import { OrderbookContainer, OrderbookContent, OrderbookTitle } from "./style";
import OrderbookTable from "./OrderbookTable";
import { Subscription } from "centrifuge";

const MAX_ITEMS = 10; // For displaying and also removing excess data

const Orderbook = () => {
  const [orderType, setOrderType] = useState<ORDER_BOOK_TYPES>(
    ORDER_BOOK_TYPES.BTC_USD
  );
  const [bids, setBids] = useState<IPrizeSizePair[]>([]);
  const [asks, setAsks] = useState<IPrizeSizePair[]>([]);
  const [currentSequence, setCurrentSequence] = useState<number>(0);

  useEffect(() => {
    centrifugeClient.connect();

    const sub = subscribeToOrderbookChannel();
    sub.subscribe();

    return () => {
      centrifugeClient.disconnect();
      unsubscribe(sub);
    };
  }, []);

  const subscribeToOrderbookChannel = () => {
    const sub = centrifugeClient.newSubscription(`orderbook:${orderType}`);

    sub.on("publication", (ctx) => {
      const data = ctx.data as IRabbitOrderbook;
      console.log(data);
      if (currentSequence !== 0 && data.sequence - currentSequence !== 1) {
        console.log("Data not in sequence anymore");
        unsubscribe(sub);
      } else {
        setCurrentSequence(data.sequence);
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

    return sub;
  };

  const unsubscribe = (sub: Subscription) => {
    sub.unsubscribe();
    sub.removeAllListeners();
  };

  const getSnapshot = () => {
    subscribeToOrderbookChannel();
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

  return (
    <OrderbookContainer>
      <OrderbookTitle>Orderbook</OrderbookTitle>
      <OrderbookContent>
        <OrderbookTable
          orderType={ORDER_TYPE.BID}
          orders={bids.slice(0, MAX_ITEMS)}
        />
        <OrderbookTable
          orderType={ORDER_TYPE.ASK}
          orders={asks.slice(0, MAX_ITEMS)}
        />
      </OrderbookContent>
    </OrderbookContainer>
  );
};

export default Orderbook;
