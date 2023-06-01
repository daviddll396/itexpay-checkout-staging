import React from "react";

const ThreeDS = () => {
  const handlePay = () => {
    alert("hi");
  };
  return (
    <div>
      <p className="mb-12">
        You will be redirected to your card issuer's verification page to
        complete this transaction
      </p>
      <div className=" my-8">
        <button onClick={handlePay} className="button w-full text-4xl">
          Continue
        </button>
      </div>
    </div>
  );
};

export default ThreeDS;
