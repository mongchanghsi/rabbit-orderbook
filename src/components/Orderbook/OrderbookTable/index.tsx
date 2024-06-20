import { FC } from "react";
import { IPrizeSizePair, ORDER_TYPE } from "../type";
import { OrderbookTableContainer } from "./style";

interface IProps {
  orderType: ORDER_TYPE;
  orders: IPrizeSizePair[];
}

const OrderbookTable: FC<IProps> = ({ orderType, orders }) => {
  return (
    <OrderbookTableContainer>
      <thead>
        <tr>
          <th colSpan={3}>{orderType.toUpperCase()}</th>
        </tr>
        <tr>
          <th>Price ($)</th>
          <th>Amount</th>
          <th>Total ($)</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={`${orderType}-${order[0]}`}>
            <td>{order[0]}</td>
            <td>{order[1]}</td>
            <td>{(+order[0] * +order[1]).toFixed(3)}</td>
          </tr>
        ))}
      </tbody>
    </OrderbookTableContainer>
  );
};

export default OrderbookTable;
