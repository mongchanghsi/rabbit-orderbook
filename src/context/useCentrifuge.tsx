import React, { useEffect, useRef, useState } from "react";
import { PropsWithChildren } from "react";
import { Centrifuge } from "centrifuge";
import centrifugeClient from "../websocket";

type State = {
  centrifuge: Centrifuge | undefined;
  isConnected: boolean;
};

const initialState: State = {
  centrifuge: undefined,
  isConnected: false,
};

const CentrifugeContext = React.createContext<State>(initialState);

const CentrifugeProvider = ({ children }: PropsWithChildren) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const centrifuge = useRef<Centrifuge>();

  useEffect(() => {
    // Create a new Centrifuge instance if not already created or disconnected
    if (!centrifuge.current || centrifuge.current.state === "disconnected") {
      centrifuge.current = centrifugeClient;

      // Event handler for when the connection is established
      centrifuge.current.on("connected", () => {
        console.log("connected");
        setIsConnected(true);
      });

      // Event handler for connection errors
      centrifuge.current.on("error", ({ error }) => {
        console.log("error", error);
        setIsConnected(false);
      });

      // Event handler for disconnection
      centrifuge.current.on("disconnected", () => {
        console.log("disconnected");
        setIsConnected(false);
      });

      centrifuge.current.connect();
    }

    return () => centrifuge.current?.disconnect();
  }, []);

  return (
    <CentrifugeContext.Provider
      value={{ centrifuge: centrifuge.current, isConnected }}
    >
      {children}
    </CentrifugeContext.Provider>
  );
};

const useCentrifuge = () => {
  const context = React.useContext(CentrifugeContext);
  if (context === undefined) {
    throw new Error("useCentrifuge do not have context");
  }
  return context;
};

export { CentrifugeProvider, useCentrifuge };
