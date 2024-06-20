import { styled } from "styled-components";

export const OrderbookTableContainer = styled.table`
  background-color: #101624;
  border-radius: 4px;
  width: 400px;
  border-collapse: collapse;
`;

export const OrderbookTableLabel = styled.p`
  color: #eeefef;
  padding-top: 12px;
`;

export const OrderbookTableHeader = styled.p`
  color: #808ba2;
  padding: 12px 0;
`;

// export const OrderbookTableItem = styled.p<{isBid: boolean}>`
//   padding: 8px;
// `

export const OrderbookTableItem = styled.tr`
  &:hover {
    background-color: #4c546c;
  }
`;

export const OrderbookTableItemText = styled.p<{ textColor?: string }>`
  color: ${({ textColor }) => (textColor ? textColor : "#808ba2")};
  padding: 4px 0;
  cursor: default;
`;
