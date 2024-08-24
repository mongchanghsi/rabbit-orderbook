import { FC } from "react";
import { IPrizeSizePair, ORDER_TYPE } from "../../type";
import {
  OrderbookTableItem,
  OrderbookTableItemOverlay,
  OrderbookTableItemText,
} from "../style";

interface IProps {
  orderType: ORDER_TYPE;
  order: IPrizeSizePair;
  totalSize: number;
  currentSize: number;
}

const OrderbookTableRow: FC<IProps> = ({
  orderType,
  order,
  totalSize,
  currentSize,
}) => {
  const width = (currentSize * 100) / totalSize;

  return (
    <OrderbookTableItem
      key={`${orderType}-${order[0]}`}
      bid={orderType === ORDER_TYPE.BID ? 1 : 0}
    >
      <td>
        <OrderbookTableItemText
          textcolor={orderType === ORDER_TYPE.BID ? "#28856a" : "#cc3548"}
        >
          {(+order[0]).toFixed(1)}
        </OrderbookTableItemText>
      </td>
      <td>
        <OrderbookTableItemText>
          {(+order[1]).toFixed(4)}
        </OrderbookTableItemText>
      </td>
      <td style={{ position: `relative` }}>
        <OrderbookTableItemOverlay
          style={{
            width: `${width}%`,
            backgroundColor:
              orderType === ORDER_TYPE.BID ? "#28856a" : "#cc3548",
          }}
        ></OrderbookTableItemOverlay>
        <OrderbookTableItemText>
          {currentSize.toFixed(4)}
        </OrderbookTableItemText>
      </td>
    </OrderbookTableItem>
  );
};

export default OrderbookTableRow;
