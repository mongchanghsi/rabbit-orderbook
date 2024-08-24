import { Toaster } from "react-hot-toast";
import "./App.css";
import Orderbook from "./components/Orderbook";
import { CentrifugeProvider } from "./context/useCentrifuge";

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
        <Orderbook />
      </CentrifugeProvider>
    </div>
  );
}

export default App;
