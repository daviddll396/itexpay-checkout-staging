/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import { ReactComponent as Cancel } from "../assets/icons/cancel.svg";
import CloseIcon from "../assets/icons/close.svg";
import SecureFooter from "../components/shared/SecureFooter";
import Logo from "../assets/images/merchantlogo.png";
import { ReactSVG } from "react-svg";
import { paymentChannels } from "../data";
import CardPayment from "../components/card/CardPayment";
import QRPayment from "src/components/qr";
import USSDPayment from "src/components/ussd";
import BankTransfer from "src/components/transfer";
import ChangePaymentDrawer from "../components/changePaymentDrawer";
import ENaira from "src/components/e-naira";
import { generate_reference } from "src/api/utility";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { get_payment_details, callEvent } from "src/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/redux";
import {
  setReferences,
  setTransactionResponse,
} from "src/redux/PaymentReducer";
import Spinner from "src/components/shared/Spinner";
import Success from "src/components/shared/Success";
import Invalid from "src/components/shared/Invalid";

// const DesktopCheckout = () => {
//   const [active, setActive] = useState(paymentChannels[0]);

//   return (
//     <div className="my-[8%] p-4">
//       <div className="relative max-w-[705px] h-[580px] max-h-[580px]   mx-auto border border-theme rounded-theme bg-white shadow-custom_shadow p-10 ">
//         <img
//           src={CloseIcon}
//           alt="close"
//           className="w-10 absolute  -left-4 -top-4 z-[10] cursor-pointer"
//         />
//         <Sidebar active={active} setActive={setActive} />

//         <div className=" ml-[30%]  pl-5 ">
//           <div className="text-end mt-3 mb-10">
//             <h2 className="font-extrabold text-3xl text-[#005B27]">
//               NGN 1,000.00
//             </h2>
//             <p className="text-text text-sm">philipkk@gmail.com</p>
//           </div>
//           {active.id === "card" && <CardPayment />}
//           {active.id === "qr" && <QRPayment />}
//           {active.id === "ussd" && <USSDPayment />}
//           {active.id === "transfer" && <BankTransfer />}
//         </div>
//       </div>
//       <div className="mt-6">
//         <SecureFooter />
//       </div>
//     </div>
//   );
// };
// const MobileCheckout = () => {
//   const [active, setActive] = useState(paymentChannels[0]);
//   const [selectState, setSelectState] = useState(false);

//   const handleChangePaymentMethod = () => {
//     setSelectState(true);
//   };
//   const getActive=(channelid:string)=>{
//   let channel = paymentChannels.find(({id})=> id = channelid)
//   return channel
//   }
//   return (
//     <div
//       className={`w-full relative bg-white h-screen   min-h-fit  flex flex-col justify-between `}
//     >
//       {selectState ? (
//         <div className="absolute top-0 bottom-0 left-0 right-0 bg-black/50 z-[3]"></div>
//       ) : null}

//       <div>
//         <div className="bg-dark text-white">
//           <div className=" flex items-center justify-between px-5 py-3">
//             <div className="flex items-center ">
//               <img src={Logo} alt="logo" className="w-9 h-9 mr-1" />
//               <h3 className="text-sm font-bold ml-1">Test MyParfait</h3>
//             </div>
//             <div className="flex items-center">
//               <Cancel className="w-5 h-5" />
//               <span className="ml-1 text-xs">Close</span>
//             </div>
//           </div>
//         </div>
//         {!selectState ? (
//           <div className="border-y border-y-theme bg-theme/10 py-3 flex items-center justify-between px-4">
//             <div className="flex items-center ml-3">
//               <ReactSVG
//                 src={active.icon}
//                 className="w-4"
//                 stroke="#001E31"
//               />
//               <span className="text-[#001E31] ml-3">
//                 {active.name}
//               </span>
//             </div>

//             <button
//               onClick={handleChangePaymentMethod}
//               className="p-2 bg-transparent text-theme font-bold text-xs"
//             >
//               Change
//             </button>
//           </div>
//         ) : null}

//         <div className="px-6">
//           <div className="text-end my-8">
//             <h2 className="font-extrabold text-2xl text-[#005B27]">
//               NGN 1,000.00
//             </h2>
//             <p className="text-text text-xs font-medium">philipkk@gmail.com</p>
//           </div>
//           {/* {selectState === true ? (
//             <div>
//               <p className="text-[#555555]/70 mb-4">Make payment with:</p>

//               <ul className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-4  text-[#89B4CF] w-full ">
//                 {paymentChannels.map(({ name, icon }, i) => (
//                   <li
//                     key={name}
//                     onClick={() => {
//                       setActive(i);
//                       setSelectState(false);
//                     }}
//                     className={`col-span-1 flex items-center text-xs py-3 pl-6 cursor-pointer font-medium text-[#3d3e42] rounded-theme hover:bg-theme/10 ${
//                       active === i
//                         ? "bg-theme/10 border border-theme  "
//                         : "bg-[#EDEDEDBD]/70 "
//                     }`}
//                   >
//                     <ReactSVG src={icon} className="w-4" stroke="#2837a8" />
//                     <span className="ml-3">{name}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ) : ( */}
//           {active.id === "card" && <CardPayment />}
//           {active.id === "qr" && <QRPayment />}
//           {active.id === "ussd" && <USSDPayment />}
//           {active.id === "transfer" && <BankTransfer />}
//           {/* )} */}
//           {selectState === true ? (
//             <ChangePaymentDrawer
//               active={active}
//               setActive={setActive}
//               selectState={selectState}
//               setSelectState={setSelectState}
//             />
//           ) : null}
//         </div>
//       </div>
//       <SecureFooter />
//     </div>
//   );
// };
// const MobileCheckout2 = () => {
//   const [active, setActive] = useState(0);
//   const [selectState, setSelectState] = useState(false);

//   const handleChangePaymentMethod = () => {
//     setSelectState(true);
//   };

//   return (
//     <div>
//       <div className="w-full relative bg-white min-h-screen switch:min-h-fit switch:h-full  flex flex-col justify-between   desktop-card">
//         {/* {selectState ? (
//           <div className="fixed top-0 bottom-0 left-0 right-0 bg-black/50 z-[2]"></div>
//         ) : null} */}
//         <div>
//           <div className="bg-dark text-white switch:rounded-tl-theme switch:rounded-tr-theme">
//             <div className=" flex items-center justify-between gap-3 px-6 py-3">
//               {/* {!selectState ? (
//                 <div onClick={handleChangePaymentMethod}>
//                   <ArrowLeft className="w-9 h-9 p-1 md:hidden" />
//                 </div>
//               ) : (
//                 <div className="h-1 w-1 bg-transparent"></div>
//               )} */}

//               <div className="flex items-center ">
//                 <img src={Logo} alt="logo" className="w-12 h-12 mr-1" />
//                 <h3 className="text-base font-bold ml-2 max-w-[12rem] truncate">
//                   Test MyParfait mdfbavfgvafuyabdfgvafjghbadf
//                 </h3>
//               </div>
//               <div className="flex items-center ">
//                 <Cancel className="w-5 h-5" />
//                 <span className="ml-1 text-xs">Close</span>
//               </div>
//             </div>
//           </div>

//           <div className="border-y border-y-theme bg-theme/10 py-3 flex items-center justify-between px-4">
//             <div className="flex items-center ml-3">
//               {/* <ReactSVG
//                   src={paymentChannels[active].icon}
//                   className="w-4"
//                   stroke="#001E31"
//                 /> */}
//               <img src={CreditCard} alt="card" className="w-6" />
//               <span className="text-[#001E31] text-[15px] font-semibold ml-3">
//                 Pay with {paymentChannels[active].name}
//               </span>
//             </div>

//             <button
//               onClick={handleChangePaymentMethod}
//               className="py-1 px-2 bg-theme text-white font-bold text-xs rounded"
//             >
//               Change
//             </button>

//             {/* <Menu as="div" className="relative inline-block text-left z-[5]">
//                 <Menu.Button>
//                   <button
//                     // onClick={handleChangePaymentMethod}
//                     className="py-1 px-2 bg-theme text-white font-bold text-xs rounded"
//                   >
//                     Change
//                   </button>
//                 </Menu.Button>

//                 <Transition
//                   enter="transition duration-100 ease-out"
//                   enterFrom="transform scale-95 opacity-0"
//                   enterTo="transform scale-100 opacity-100"
//                   leave="transition duration-75 ease-out"
//                   leaveFrom="transform scale-100 opacity-100"
//                   leaveTo="transform scale-95 opacity-0"
//                 >
//                   <Menu.Items className="absolute z-[1000] right-0  mt-2 w-[320px] origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow ring-opacity-5 focus:outline-none">
//                     {paymentChannels.map(({ name, icon }, i) => (
//                       <Menu.Item>
//                         <div
//                           onClick={() => setActive(i)}
//                           className="flex items-center text-xs py-3 pl-6 cursor-pointer font-medium text-[#001E31]"
//                         >
//                           <ReactSVG
//                             src={icon}
//                             className="w-4"
//                             stroke="#001E31"
//                           />
//                           <span className="ml-3">{name}</span>
//                         </div>
//                       </Menu.Item>
//                     ))}
//                   </Menu.Items>
//                 </Transition>
//               </Menu> */}
//           </div>

//           <div className="px-6">
//             <div className="text-end my-8">
//               <h2 className="font-extrabold text-2xl text-text">
//                 NGN 1,000.00
//               </h2>
//               <p className="text-[#555555]/80 text-xs ">philipkk@gmail.com</p>
//             </div>
//             {/* {selectState === true ? (
//               <div>
//                 <p className="text-[#555555]/70 mb-4">Make payment with:</p>

//                 <ul className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-4  text-[#89B4CF] w-full ">
//                   {paymentChannels.map(({ name, icon }, i) => (
//                     <li
//                       onClick={() => {
//                         setActive(i);
//                         setSelectState(false);
//                       }}
//                       className={`col-span-1 flex items-center text-xs py-3 pl-6 cursor-pointer font-medium text-[#001E31] rounded-theme ${
//                         active === i
//                           ? "bg-theme/10 border border-theme  "
//                           : "bg-[#EDEDEDBD]/70 "
//                       }`}
//                     >
//                       <ReactSVG src={icon} className="w-4" stroke="#001E31" />
//                       <span className="ml-3">{name}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ) : (
//               <CardPayment />
//             )} */}
//             <CardPayment />
//           </div>
//         </div>
//         <div className="switch:hidden">
//           <SecureFooter />
//         </div>

//         {/* change paymentdrawer */}
//         {selectState === true ? (
//           <ChangePaymentDrawer
//             active={active}
//             setActive={setActive}
//             selectState={selectState}
//             setSelectState={setSelectState}
//           />
//         ) : null}
//       </div>
//       <div className="hidden switch:block mt-6">
//         <SecureFooter />
//       </div>
//     </div>
//   );
// };

const Checkout = () => {
  const dispatch = useDispatch();
  const transaction_data = useSelector(
    (state: RootState) => state.payment.userPayload
  );

  const [active, setActive] = useState(paymentChannels[0]);
  const [selectState, setSelectState] = useState(false);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [invalidPaymentId, setInvalidPaymentId] = useState(false);
  const [invalidRedirectUrl, setInvalidRedirectUrl] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [fee, setFee] = useState("");
  const [paymentid, setPaymentId] = useState("");
  const [messageFrom3ds, setMessageFrom3ds] = useState<string | null>("");
  const [customErroeMessage, setCustomerrorMessage] = useState<string | null>("");
  const [paymentAlreadyMade, setPaymentAlreadyMade] = useState<boolean>(false);
  const [isTestEnv, setIsTestEnv] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [merchantDataRecieved, setMerchantDataRecieved] = useState(true);
  const [params, setParams] = useState<any>(null);


  // changes the selected payment method
  const handleChangePaymentMethod = () => {
    setSelectState(true);
  };
  // updates state
  // const handleStateChange = (name: any, value: any) => {
  //   // console.log('here')
  //   // setState({
  //   //   ...state,
  //   //   [name]: value,
  //   // });
  // };
  // toggles loading state to true/false
  const toggleLoading = (value: boolean) => {
    setIsLoading(value);
  };
  // check if url is a valid url or not
  const isValidUrl = (urlString: string) => {
    try {
      return Boolean(new URL(urlString));
    } catch (e) {
      return false;
    }
  };
  // function to log event
  const sendEvent = ({
    type,
    activity,
  }: {
    type: string;
    activity: string;
  }) => {
    //type is "{init,redirect,otp,scan}"
    const { paymentid, publickey } = transaction_data;
    const evtData = {
      paymentid,
      eventtype: type,
      activity,
      // "modalreference": modalref,
      // "paymentlinkreference": paymentlinkref,
      // "context": "web",
      // "actor": email,
    };
    callEvent(paymentid, evtData, publickey).then((response) => {
      console.log("event response", response);
      // handle failed
    });
  };
  const paymentDetailsHandler = (paymentId: string) => {
    get_payment_details(paymentId)
      .then((response: any) => {
        const { code, redirecturl } = response.data;
        if (code === "00") {
          setPaymentAlreadyMade(true);
          toggleLoading(false);
          return;
        }
        // check if it is a valid redirect url
        if (redirecturl && !isValidUrl(redirecturl)) {
          // handleStateChange("invalidRedirectUrl", true);
          setInvalidRedirectUrl(true)
          toggleLoading(false);
          return;
        }
        setInvalidRedirectUrl(true);
        // handleStateChange("invalidRedirectUrl", true);
        setSelectedOption('card')
        // handleStateChange("selectedOption", "card");

        // send initialize event
        try {
          sendEvent({ type: "init", activity: "Payment initialized" });
        } catch (error) {
          console.log({ prejjurTiWa: error });
        }
      })
      .then((response: any) => {

        // handleStateChange("fee", response?.order?.fee?.value);
        setFee(response?.order?.fee?.value)
        // this.fee = response?.order?.fee?.value;
        dispatch(
          setTransactionResponse({
            transaction_amount:
              parseFloat(transaction_data.transaction_amount) + parseFloat(fee) + "",
          })
        );
        // transaction_data.transaction_amount =
        //   parseFloat(transaction_data.transaction_amount) + state.fee + "";
        toggleLoading(false);
      })
      .catch((error) => {
        const { message } = error;
        if (error.response) {
          const { status } = error?.response;
          if (status === 404) {
            // handleStateChange("invalidPaymentId", true);
            setInvalidPaymentId(true)
            // this.invalidPaymentId = true;
          }
        }
        toggleLoading(false);
        // this.isLoading = false;
        // handleStateChange("customErrorResponse", message);
        setCustomerrorMessage(message)
        // this.customErrorResponse = message;
        // this.$store.commit("show_error", { message: message });
      });
  };
  const onLoad = async () => {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const fingerprint = result.visitorId;
    const modalref = generate_reference("MOD", 35);
    const paymentlinkref = generate_reference("PLR", 40);
    // set references to state
    dispatch(setReferences({ fingerprint, modalref, paymentlinkref }));
    const params = new URLSearchParams(window.location.search);
    setParams(params)
    // check if url param has a linking reference to determine if transaction (if initiated) was successful or not
    if (params.has("linkingreference")) {
      const code = params.get("code");
      if (code !== "00") {
        let message = params.get("message");
        setMessageFrom3ds(message);
        toggleLoading(false);
      } else {
        // if code is success
        console.log("hi");
        setPaymentSuccessful(true);
        toggleLoading(false);
      }
      return;
    }
    //get the data from query param, if no paymentid,set invalidpaymentid to true
    const { pathname } = new URL(window.location.href);
    const paymentIdFromUrl = pathname?.split("/")[1];
    if (!paymentIdFromUrl) {
      setInvalidPaymentId(true);
      toggleLoading(false);
      return;
    }
    dispatch(setTransactionResponse({ paymentid: paymentIdFromUrl }));
    paymentDetailsHandler(paymentIdFromUrl);
  };

  // get url to go back to merchant site
  const goToMerchantSite = () => {
    console.log(params);
    const paymentID = params.get("paymentid");
    const redirecturl  = `https://heroicons.com`;
    // const { redirecturl } = response.data;
    // show success page and redirect to merchant
    if (redirecturl) {
      window.open(`${redirecturl}?paymentid=${paymentID}`, "_top");
    }
    // get_payment_details(paymentID).then((response: any) => {
    //   const { redirecturl } = response.data;
    //   // show success page and redirect to merchant
    //   if (redirecturl) {
    //     window.open(`${redirecturl}?paymentid=${paymentID}`, "_top");
    //   }
    // });
  };

  useEffect(() => {
    if (transaction_data?.paymentid?.split("_")[0] === "TEST") {
      setIsTestEnv(true);
    }
  }, [transaction_data?.paymentid]);

  useEffect(() => {
    setTimeout(() => {
      onLoad();
    }, 2000);
  }, []);

  return (
    <div className="flex items-center justify-center">
      {isLoading && <Spinner xl={true} />}
      {paymentSuccessful && <Success />}
      {invalidPaymentId && <Invalid description="Invalid Payment ID"  go={goToMerchantSite} />}
      {invalidRedirectUrl && (
        <Invalid description="Redirect URL must be a fully qualified domain name!"go={goToMerchantSite} />
      )}
      {paymentAlreadyMade && (
        <Invalid description="Payment already made.!"go={goToMerchantSite} />
      )}
      {selectedOption && !isLoading && (
        <>
          <div className="hidden switch:block ">
            <div className="my-[8%] p-4 ">
              <div className="relative max-w-[680px] h-[580px] max-h-[580px]   mx-auto border border-theme rounded-theme bg-white shadow-custom_shadow p-10 ">
                <img
                  src={CloseIcon}
                  alt="close"
                  className="w-10 absolute  -left-4 -top-4 z-[10] cursor-pointer"
                />
                <Sidebar
                  active={active}
                  setActive={setActive}
                  changePaymentOption={setSelectedOption}
                  // disabled={!processing && !success}
                />
                <div className=" ml-[30%]  pl-5 ">
                  <div className="text-end mt-3 mb-10">
                    <h2 className="font-extrabold text-3xl text-[#005B27]">
                      NGN 1,000.00
                    </h2>
                    <p className="text-text text-sm">philipkk@gmail.com</p>
                  </div>
                  {selectedOption === "card" && <CardPayment />}
                  {selectedOption === "qr" && <QRPayment />}
                  {selectedOption === "ussd" && <USSDPayment />}
                  {selectedOption === "transfer" && <BankTransfer />}
                  {selectedOption === "enaira" && <ENaira />}
                </div>
              </div>

              <div className="mt-6">
                <SecureFooter />
              </div>
            </div>
          </div>
          <div className="switch:hidden ">
            {/* <Toast /> */}
            <div
              className={`w-full relative bg-white h-screen pb-2   flex flex-col justify-between `}
            >
              {selectState ? (
                <div className="absolute top-0 bottom-0 left-0 right-0 bg-black/50 z-[3]"></div>
              ) : null}

              <div className=" flex-1 ">
                <div className="bg-dark text-white">
                  <div className=" flex items-center justify-between px-5 py-3">
                    <div className="flex items-center ">
                      <img src={Logo} alt="logo" className="w-9 h-9 mr-1" />
                      <h3 className="text-sm font-bold ml-1">Test MyParfait</h3>
                    </div>
                    <div className="flex items-center">
                      <Cancel className="w-5 h-5" />
                      <span className="ml-1 text-xs">Close</span>
                    </div>
                  </div>
                </div>
                {!selectState ? (
                  <div className="border-y border-y-theme bg-theme/10 py-3 flex items-center justify-between px-4">
                    <div className="flex items-center ml-3">
                      <ReactSVG
                        src={active.icon}
                        className="w-4"
                        stroke="#001E31"
                      />
                      <span className="text-[#001E31] ml-3">{active.name}</span>
                    </div>

                    <button
                      onClick={handleChangePaymentMethod}
                      className="p-2 bg-transparent text-theme font-bold text-xs"
                    >
                      Change
                    </button>
                  </div>
                ) : null}

                <div className="px-6 max-h-[500px] overflow-auto">
                  <div className="text-end my-8">
                    <h2 className="font-extrabold text-2xl text-[#005B27]">
                      NGN 1,000.00
                    </h2>
                    <p className="text-text text-xs font-medium">
                      philipkk@gmail.com
                    </p>
                  </div>
                  {selectedOption === "card" && <CardPayment />}
                  {selectedOption === "qr" && <QRPayment />}
                  {selectedOption === "ussd" && <USSDPayment />}
                  {selectedOption === "transfer" && <BankTransfer />}
                  {selectedOption === "enaira" && <ENaira />}

                  {selectState === true ? (
                    <ChangePaymentDrawer
                      active={active}
                      setActive={setActive}
                      selectState={selectState}
                      setSelectState={setSelectState}
                      changePaymentOption={setSelectedOption}
                    />
                  ) : null}
                </div>
              </div>
              <SecureFooter />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;
