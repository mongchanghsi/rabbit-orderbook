import { styled } from "styled-components";
import { FlashGreen, FlashRed } from "../../Animation/flash";

export const OrderbookWrapper = styled.div`
  height: 350px;
  overflow-y: auto;

  &:-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

export const OrderbookTableContainer = styled.table`
  background-color: #101624;
  width: 420px;
  border-collapse: collapse;
  table-layout: fixed;

  & thead tr th {
    position: sticky;
    top: 0;
    z-index: 2;
  }
`;

export const OrderbookTableLabel = styled.p`
  color: #eeefef;
  padding-top: 12px;
`;

export const OrderbookTableHeader = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  color: #808ba2;
  padding: 12px 0;
  font-size: 14px;

  background-color: #0b0e18;
`;

export const OrderbookTableTab = styled.span`
  font-size: 10px;
  padding: 1px 2px;
  background-color: #4c546c;
  border-radius: 4px;
  color: #0b0e18;
`;

export const OrderbookTableItem = styled.tr<{ bid: number }>`
  animation: ${({ bid }) => (bid ? FlashGreen : FlashRed)} 1s;

  &:hover {
    background-color: #4c546c;
  }
`;

export const OrderbookTableItemText = styled.p<{ textcolor?: string }>`
  color: ${({ textcolor }) => (textcolor ? textcolor : "#808ba2")};
  padding: 4px 0;
  cursor: default;
`;

export const OrderbookTableItemOverlay = styled.div`
  opacity: 0.2;
  position: absolute;
  z-index: 1;
  height: 26px;
`;
