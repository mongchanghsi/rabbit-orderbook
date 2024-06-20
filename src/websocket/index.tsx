import { Centrifuge } from "centrifuge";
import ENV_CONFIG from "../configuration/environment";

if (!ENV_CONFIG.WS_URL) {
  console.log("Configure RabbitX Websocket URL");
}

if (!ENV_CONFIG.WS_JWT) {
  console.log("Configure RabbitX Public JWT");
}

const centrifugeClient = new Centrifuge(ENV_CONFIG.WS_URL, {
  token: ENV_CONFIG.WS_JWT,
});

export default centrifugeClient;
