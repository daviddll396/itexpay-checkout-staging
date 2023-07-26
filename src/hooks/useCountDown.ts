import { useState } from "react";

const useCountdown = (value: number) => {
  const [countDown, setCountDown] = useState(value);
  const [remValue, setRemValue] = useState<number[]>([0, 0, 0, 0]);
  const [timerDone, setTimerDone] = useState(false);

  const onTimer = () => {
    // console.log("timerstarts");
    const timer = setInterval(() => {
      let num = countDown;
      num -= 1;
      setCountDown(num);
      setRemValue(getReturnValues(num));

      // console.log(countDown);
      if (countDown <= 0) {
        setTimerDone(true);
        clearInterval(timer);
      }
    }, 1000);
  };

  const getReturnValues = (countDown: number) => {
    // calculate time left
    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

    return [days, hours, minutes, seconds];
  };

  return { onTimer, remValue, timerDone };
};

export { useCountdown };
