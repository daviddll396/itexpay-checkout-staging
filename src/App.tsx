import { useEffect, useState } from "react";
import Checkout from "./pages/Checkout";
import { Provider } from "react-redux";
import { store } from "./redux";
import axios from "axios";

function App() {
  const [ip, setIp] = useState("");
  // Add a request interceptor
  axios.interceptors.request.use(
    function (config) {
      // const userip = localStorage.getItem("ip") || "";
      // const { ip } = JSON.parse(userip) || null;
      config.headers["Clientaddress"] = `${ip}`;
      // Do something before request is sent
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    async function getIP() {
      await fetch("https://api.ipify.org?format=json")
        .then((response) => response.json())
        .then((data) => {
          setIp(data)
          // localStorage.setItem("ip", JSON.stringify(data));
        })
        .catch((error) => console.log(error));
    }

    window.addEventListener("load", () => {
      window.parent.postMessage(
        {
          checkoutMounted: true,
        },
        "*"
      );
    });

    getIP();
  }, []);

  return (
    <div className="font-sans">
      <Provider store={store}>
        <Checkout />
      </Provider>
    </div>
  );
}

export default App;
