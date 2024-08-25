import { Toaster } from "react-hot-toast";
import "./App.css";
import { CentrifugeProvider } from "./context/useCentrifuge";
import OrderbookView from "./views/OrderbookView";

function App() {
  return (
    <div className="App">
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          className: "",
          style: {
            color: "#fff",
            backgroundColor: "#101624",
          },
        }}
      />
      <CentrifugeProvider>
        <OrderbookView />
      </CentrifugeProvider>
    </div>
  );
}

export default App;
