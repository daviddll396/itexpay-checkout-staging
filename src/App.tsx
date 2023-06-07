// import React from "react";
import Checkout from "./pages/Checkout";
import { Provider } from "react-redux";
import { store } from "./redux";

function App() {
  return (
    <div className="font-sans">
      <Provider store={store}>
        <Checkout />
      </Provider>
    </div>
  );
}

export default App;
