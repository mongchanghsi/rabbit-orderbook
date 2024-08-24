import { FC } from "react";
import { IPrizeSizePair, ORDER_TYPE } from "../type";
import {
  OrderbookTableContainer,
  OrderbookTableHeader,
  OrderbookTableTab,
  OrderbookWrapper,
} from "./style";
import { MARKET_TYPE, getMarketAndCurrency } from "../utils";
import OrderbookTableRow from "./OrderbookTableRow";

interface IProps {
  market: MARKET_TYPE;
  orderType: ORDER_TYPE;
  orders: IPrizeSizePair[];
}

const OrderbookTable: FC<IProps> = ({ market, orderType, orders }) => {
  const [_market, _currency] = getMarketAndCurrency(market);
  const totalSize = orders.reduce((acc, order) => (acc += +order[1]), 0);
  let currentSize = 0;

  return (
    <OrderbookWrapper>
      <OrderbookTableContainer>
        <thead>
          <tr>
            <th>
              <OrderbookTableHeader>
                Price
                <OrderbookTableTab>{_currency}</OrderbookTableTab>
              </OrderbookTableHeader>
            </th>
            <th>
              <OrderbookTableHeader>
                Size
                <OrderbookTableTab>{_market}</OrderbookTableTab>
              </OrderbookTableHeader>
            </th>
            <th>
              <OrderbookTableHeader>
                Total
                <OrderbookTableTab>{_market}</OrderbookTableTab>
              </OrderbookTableHeader>
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            currentSize += +order[1];
            return (
              <OrderbookTableRow
                key={order[0]}
                order={order}
                orderType={orderType}
                totalSize={totalSize}
                currentSize={currentSize}
              />
            );
          })}
        </tbody>
      </OrderbookTableContainer>
    </OrderbookWrapper>
  );
};

export default OrderbookTable;
