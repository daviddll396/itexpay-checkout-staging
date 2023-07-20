import { useEffect } from "react";
import Checkout from "./pages/Checkout";
import { Provider } from "react-redux";
import { store } from "./redux";
import axios from "axios";

function App() {
  // Add a request interceptor
  axios.interceptors.request.use(
    function (config) {
      const userip = localStorage.getItem("ip") || "";
      const { ip } = JSON.parse(userip) || null;
      config.headers.IP = `${ip}`;
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
          localStorage.setItem("ip", JSON.stringify(data));
        })
        .catch((error) => console.log(error));
    }
    if (localStorage.getItem("ip")) {
      return;
    } else {
      getIP();
    }
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
