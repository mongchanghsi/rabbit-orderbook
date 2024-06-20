import { FC } from "react";
import { IPrizeSizePair, ORDER_TYPE } from "../type";
import {
  OrderbookTableContainer,
  OrderbookTableHeader,
  OrderbookTableItem,
  OrderbookTableItemText,
  OrderbookTableLabel,
} from "./style";
import { MARKET_TYPE } from "../utils";

interface IProps {
  market: MARKET_TYPE;
  orderType: ORDER_TYPE;
  orders: IPrizeSizePair[];
}

const OrderbookTable: FC<IProps> = ({ market, orderType, orders }) => {
  return (
    <OrderbookTableContainer>
      <thead>
        <tr>
          <th colSpan={3}>
            <OrderbookTableLabel>{orderType.toUpperCase()}</OrderbookTableLabel>
          </th>
        </tr>
        <tr>
          <th>
            <OrderbookTableHeader>Price ($)</OrderbookTableHeader>
          </th>
          <th>
            <OrderbookTableHeader>
              Amount ({market.replace("-USD", "")})
            </OrderbookTableHeader>
          </th>
          <th>
            <OrderbookTableHeader>Total ($)</OrderbookTableHeader>
          </th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <OrderbookTableItem key={`${orderType}-${order[0]}`}>
            <td>
              <OrderbookTableItemText
                textcolor={orderType === ORDER_TYPE.BID ? "#28856a" : "#cc3548"}
              >
                {order[0]}
              </OrderbookTableItemText>
            </td>
            <td>
              <OrderbookTableItemText>{order[1]}</OrderbookTableItemText>
            </td>
            <td>
              <OrderbookTableItemText>
                {(+order[0] * +order[1]).toFixed(3)}
              </OrderbookTableItemText>
            </td>
          </OrderbookTableItem>
        ))}
      </tbody>
    </OrderbookTableContainer>
  );
};

export default OrderbookTable;
