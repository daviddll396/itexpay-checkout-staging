import { useEffect } from "react";
import Checkout from "./pages/Checkout";

import axios from "axios";
import { useAppSelector, useAppDispatch } from "./redux/hooks";
import { update_ip } from "./redux/PaymentReducer";
function App() {
  const dispatch = useAppDispatch();
  const ip = useAppSelector((state) => state.payment.ip);

  // const [ip, setIp] = useState("");
  // Add a request interceptor
  axios.interceptors.request.use(
    function (config) {
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
          dispatch(update_ip(data));
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="font-sans">
        <Checkout />
    </div>
  );
}

export default App;
