const ENV_CONFIG = {
  WS_URL: process.env.REACT_APP_RABBIT_WEBSOCKET_URL || "",
  WS_JWT: process.env.REACT_APP_RABBIT_WS_JWT || "",
  API_URL: process.env.REACT_APP_RABBIT_API_URL || "",
};

export default ENV_CONFIG;
