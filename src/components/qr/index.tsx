import React from "react";
import qrsample from "../../assets/images/qr-sample.png";

const QRPayment = () => {
  return (
    <div>
      <p className="text-xs text-center w-10/12 mx-auto">
        Scan the QR Code below on your Bank’s mobile app to complete the payment
      </p>

      <div className="max-w-[200px] max-h-[200px] w-[200px] h-[200px] mx-auto bg-theme/5 rounded-theme p-3 mt-6 mb-11">
        <div className="bg-white w-full h-full rounded-theme p-3">
          <img src={qrsample} alt="" className="w-full h-full" />
        </div>
      </div>

      <div className=" my-8">
        <button className="button w-full">I have made this payment</button>
      </div>
    </div>
  );
};

export default QRPayment;
