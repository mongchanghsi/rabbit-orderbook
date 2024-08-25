import { FC } from "react";
import { ORDER_TYPE } from "./type";
import { MARKET_TYPE } from "./utils";
import { OrderbookContainer } from "./style";
import OrderbookTable from "./OrderbookTable";
import MarketPrice from "../MarketPrice";
import useOrderbook from "../../hooks/useOrderbook";

interface IProps {
  market: MARKET_TYPE;
}

const Orderbook: FC<IProps> = ({ market }) => {
  const { bids, asks } = useOrderbook(market);

  return (
    <OrderbookContainer>
      <OrderbookTable
        market={market}
        orderType={ORDER_TYPE.BID}
        orders={bids}
      />
      <MarketPrice market={market} />
      <OrderbookTable
        market={market}
        orderType={ORDER_TYPE.ASK}
        orders={asks}
      />
    </OrderbookContainer>
  );
};

export default Orderbook;
