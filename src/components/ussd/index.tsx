import { useState } from "react";
import BankLogo from "../../assets/images/merchantlogo.png";
import { ReactComponent as ArrowLeft } from "../../assets/icons/arrow-left.svg";
import { ReactComponent as CopyIcon } from "../../assets/icons/copy-icon.svg";

const Card = (props: { bank: any; item: any }) => {
  return (
    <div
      className={`shadow-bank_shadow bg-white rounded-[10px]  border  py-4 px-3  ${
        props.bank === props.item ? " border-[#041926]" : "border-transparent"
      }`}
    >
      <div className="w-4/5 mx-auto mb-3">
        <img src={BankLogo} alt="logo" className="rounded-full" />
      </div>
      <p className="text-[11px] text-center">Wema Bank</p>
    </div>
  );
};

const USSDPayment = () => {
  const [bank, setBank] = useState<any>(null);

  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  const [showCode, setShowCode] = useState(false);

  const onShowCode = () => {
    if (bank) {
      setShowCode(true);
    } else {
      alert("Please select a bank");
    }
  };
  const onGoBack=()=>{
    setShowCode(false);
  }
  return (
    <>
      {!showCode && (
        <div className="px-1">
          <p className="mb-6 text-sm font-medium">Please Select your bank </p>

          <div className="grid grid-cols-2 switch:grid-cols-2 min-[620px]:grid-cols-3 min-[720px]:grid-cols-4 gap-4  p-1 max-h-[300px] overflow-scroll">
            {data.map((item) => (
              <div onClick={() => setBank(item)}>
                <Card bank={bank} item={item} />
              </div>
            ))}
          </div>
          <div className=" my-6">
            <button onClick={onShowCode} className="button w-full">
              Continue
            </button>
          </div>
        </div>
      )}
      {showCode && (
        <div className="">
          <div onClick={onGoBack} className="flex items-center w-fit gap-x-1 text-[#979797] text-[11px] mb-4 cursor-pointer">
            <ArrowLeft /> <span>Select another bank</span>
          </div>
          <div className="flex items-center gap-x-2">
            <div className="rounded-full w-7 h-7  ">
              <img src={BankLogo} alt="logo" className="w-7 h-7" />
            </div>
            <span>Wema Bank</span>
          </div>

          <p className="text-xs w-4/6 mx-auto text-center my-4">
            Dial the <strong>USSD</strong> code below on your mobile phone to
            complete the payment
          </p>
          <div className="bg-theme/10 w-fit mx-auto py-1.5 px-5 rounded-3xl flex items-center gap-x-2 my-2">
            <p className="text-theme font-extrabold text-2xl ">
              *901*000*9628#
            </p>
            <CopyIcon className=" text-theme" />
          </div>
          <p className="text-xs w-5/6 mx-auto text-center mb-8 mt-4">
            You have 26secs left to complete this payment
          </p>
          <div className=" my-8">
            <button onClick={onShowCode} className="button w-full">
              I have completed this payment
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default USSDPayment;
