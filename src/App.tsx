import { useEffect, useState } from "react";
import Checkout from "./pages/Checkout";
import axios from "axios";

function App() {
  const [globalState, setGlobalState] = useState(null);
  // Add a request interceptor
  axios.interceptors.request.use(
    function (config) {
      if (globalState) {
        config.headers["Clientaddress"] = `${globalState}`;
      }
      // Do something before request is sent
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
  function getIP() {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        setGlobalState(data.ip);
      })
      .catch((error) => console.log(error));
  }
  useEffect(() => {
    getIP();

    window.addEventListener("load", () => {
      window.parent.postMessage(
        {
          checkoutMounted: true,
        },
        "*"
      );
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="font-sans">
      <Checkout />
    </div>
  );
}

export default App;
