import { useEffect, useState } from "react";
import Checkout from "./pages/Checkout";
import axios from "axios";
import Spinner from "./components/shared/Spinner";

function App() {
  const [ip, setIp] = useState<any>("");
  const [mounted, setMounted] = useState(false);
  // Add a request interceptor
  axios.interceptors.request.use(
    function (config) {
      if (ip?.ip) {
        config.headers["Clientaddress"] = `${ip.ip}`;
      } else {
        config.headers["Clientaddress"] = `${ip}`;
      }
      // Do something before request is sent
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
  async function getIP() {
    await fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        // console.log(data)
        // alert(JSON.stringify(data))
        setIp(data);
        setMounted(true);
      })
      .catch((error) => console.log(error));
  }
  useEffect(() => {
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
      {mounted ? (
        <>
          <div>{ip}</div>
          <Checkout />
        </>
      ) : (
        <Spinner lg={true} />
      )}
    </div>
  );
}

export default App;
