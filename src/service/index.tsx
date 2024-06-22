import { MARKET_TYPE } from "../components/Orderbook/utils";
import ENV_CONFIG from "../configuration/environment";

export class RabbitXService {
  async getOrderbookSnapshot(market: MARKET_TYPE) {
    const host = ENV_CONFIG.API_URL;
    const resource = `/markets/orderbook`;
    const params = `?market_id=${market}&p_limit=100&p_page=0&p_order=DESC`;

    try {
      const response = await fetch(host + resource + params);
      const result = await response.json();
      return result;
    } catch (error) {
      console.log("error", error);
    }
  }
}
