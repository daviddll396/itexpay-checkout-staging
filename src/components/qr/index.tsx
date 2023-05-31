import React from "react";
import qrsample from "../../assets/images/qr-sample.png";

const QRPayment = () => {
  return (
    <div>
      <p className="text-xs text-center w-10/12 mx-auto">
        Scan the QR Code below on your Bank’s mobile app to complete the payment
      </p>

      <div className="max-w-[250px] max-h-[250px] w-[250px] h-[250px] mx-auto bg-theme/5 rounded-theme p-3 mt-6 mb-11">
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
