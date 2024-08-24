import { styled } from "styled-components";

export const MarketPriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #2e3342;
  width: 100%;

  padding: 8px 18px;
  box-sizing: border-box;
`;

export const MarketPriceArrow = styled.div<{ up: number }>`
  position: relative;
  height: 18px;
  aspect-ratio: 1/1;

  color: ${({ up }) => (up ? `#28856a` : `#cc3548`)};
`;

export const MarketPriceText = styled.p<{ up: number }>`
  font-size: 18px;
  font-weight: 600;

  color: ${({ up }) => (up ? `#28856a` : `#cc3548`)};
`;
