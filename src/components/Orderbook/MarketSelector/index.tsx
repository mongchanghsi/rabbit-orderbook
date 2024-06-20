import { FC } from "react";
import { MARKET_TYPE } from "../utils";
import Select from "react-select";

interface IProps {
  selectedMarket: MARKET_TYPE;
  handleChange: (order: MARKET_TYPE) => void;
}

type Option = {
  value: string;
  label: string;
};

const GenerateOptions = (): Option[] => {
  return Object.values(MARKET_TYPE).map((_orderType) => {
    return {
      value: _orderType,
      label: _orderType,
    };
  });
};

const MarketSelector: FC<IProps> = ({ selectedMarket, handleChange }) => {
  return (
    <Select
      options={GenerateOptions()}
      value={GenerateOptions().find(
        (option) => option.value === selectedMarket
      )}
      onChange={(e) => {
        if (e) {
          handleChange(e.value as MARKET_TYPE);
        }
      }}
    />
  );
};

export default MarketSelector;
