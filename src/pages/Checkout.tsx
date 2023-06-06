import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import { ReactComponent as Cancel } from "../assets/icons/cancel.svg";
import CloseIcon from "../assets/icons/close.svg";
import SecureFooter from "../components/shared/SecureFooter";
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
import { get_payment_details } from "src/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/redux";
import {
  close_modal,
  hide_error,
  setPaymentCompleted,
  setReferences,
  setTransactionResponse,
  show_error,
} from "src/redux/PaymentReducer";
import useCustomFunctions from "src/hooks/useCustomFunctions";
import Spinner from "src/components/shared/Spinner";
import Success from "src/components/shared/Success";
import Invalid from "src/components/shared/Invalid";
import Toast from "src/components/shared/Toast";

const Checkout = () => {
  const dispatch = useDispatch();
  const transaction_data = useSelector(
    (state: RootState) => state.payment.userPayload
  );
  const show = useSelector((state: RootState) => state.payment.show);
  const payment = useSelector((state: RootState) => state.payment.payment);
  const { sendEvent } = useCustomFunctions();
  const [active, setActive] = useState(paymentChannels[0]);
  const [selectState, setSelectState] = useState(false);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [invalidPaymentId, setInvalidPaymentId] = useState(false);
  const [invalidRedirectUrl, setInvalidRedirectUrl] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  // const [fee, setFee] = useState("0");
  const [messageFrom3ds, setMessageFrom3ds] = useState<string | null>("");
  const [customErrorMessage, setCustomErrorMessage] = useState<string | null>(
    ""
  );
  const [paymentAlreadyMade, setPaymentAlreadyMade] = useState<boolean>(false);
  const [isTestEnv, setIsTestEnv] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [params, setParams] = useState<any>(null);

  // changes the selected payment method
  const handleChangePaymentMethod = () => {
    setSelectState(true);
  };
  // updates state
  // const handleStateChange = (name: any, value: any) => {
  //   // //console.log('here')
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
  // gets transaction details
  const paymentDetailsHandler = (paymentId: string) => {
    // calls endpoint to get details of the transaction
    get_payment_details(paymentId)
      .then((response: any) => {
        const { code, redirecturl } = response?.data;
        // if response contains code, show error payment already made
        if (code === "00") {
          setPaymentAlreadyMade(true);
          toggleLoading(false);
          return;
        }
        // check if it is a valid redirect url nad show error if it isn't
        if (redirecturl && !isValidUrl(redirecturl)) {
          setInvalidRedirectUrl(true);
          toggleLoading(false);
          return;
        }
        dispatch(setTransactionResponse({ ...response.data, callbackurl: "" }));
        dispatch(
          setPaymentCompleted({
            paymentid: response.data.paymentid,
            paycompleted: null,
          })
        );
        setSelectedOption("card");
        dispatch(hide_error());
        toggleLoading(false);
      })
      .catch((error) => {
        let errMsg =
          error?.response?.data?.status || error?.response?.data?.message;
        if (error.response) {
          const { status } = error?.response;
          if (status === 404) {
            setInvalidPaymentId(true);
          }
        }
        toggleLoading(false);
        // sets any  error that comes up and shows error screen
        setCustomErrorMessage(errMsg);
        // dispatch(show_error({ message: `${errMsg}` }));
      });
  };
  // page init
  const onLoad = async () => {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const fingerprint = result.visitorId;
    const modalref = generate_reference("MOD", 35);
    const paymentlinkref = generate_reference("PLR", 40);
    // set references to state
    dispatch(setReferences({ fingerprint, modalref, paymentlinkref }));
    const params = new URLSearchParams(window.location.search);
    setParams(params);
    // check if url param has a linking reference to determine if transaction (if initiated) was successful or not
    if (params.has("linkingreference")) {
      const code = params.get("code");
      if (code !== "00") {
        let message = params.get("message");
        setMessageFrom3ds(message);
        toggleLoading(false);
      } else {
        // if code is success
        //console.log("hi");
        setPaymentSuccessful(true);
        toggleLoading(false);
      }
      return;
    }
    //get the data from query param, if no paymentid,set invalidpaymentid to true
    const { pathname } = new URL(window.location.href);
    const paymentIdFromUrl = pathname.split("/")[1];
    // check if paymentid exists, show error if it doesn't
    if (!paymentIdFromUrl) {
      setInvalidPaymentId(true);
      toggleLoading(false);
      return;
    }
    // set paymentid to state
    //console.log("transactionres set");
    dispatch(setTransactionResponse({ paymentid: paymentIdFromUrl }));
    paymentDetailsHandler(paymentIdFromUrl);
  };
  // get url to go back to merchant site
  const goToMerchantSite = () => {
    // const { pathname } = new URL(window.location.href);
    const paymentID = params.get("paymentid");
    // const paymentID = pathname.split("/")[1];
    // show success page and redirect to merchant
    get_payment_details(paymentID)
      .then((response: any) => {
        const { redirecturl } = response.data;
        // show success page and redirect to merchant
        if (redirecturl) {
          window.open(`${redirecturl}?paymentid=${paymentID}`, "_top");
        } else {
          setTimeout(() => {
            let url =
              window.location !== window.parent.location
                ? document.referrer
                : document.location.href;
            window.parent.postMessage(
              { name: "vbvcomplete", response: response },
              url
            );
            dispatch(close_modal());
          }, 1000);
        }
      })
      .catch((error) => {
        console.log({
          errMsg:
            error?.response?.data?.message ||
            error?.response?.data?.status ||
            error?.message,
        });
        dispatch(close_modal());
      });
  };
  // close frame
  const onCloseFrame = () => {
    dispatch(close_modal());
  };
  // watches value of public key and logs event when it is is available
  useEffect(() => {
    if (!transaction_data.publickey) {
      return;
    }
    sendEvent({ type: "init", activity: "Payment initialized" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transaction_data?.publickey]);
  // watches the value of the payment object and updates if payment was successful or not
  useEffect(() => {
    if (
      payment?.paymentid === transaction_data?.paymentid &&
      payment?.paycompleted === "success"
    ) {
      setPaymentSuccessful(true);
    } else {
      payment?.message &&
        dispatch(
          show_error({
            message: `${payment?.message}. Please, try another payment method`,
          })
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payment?.paycompleted]);
  // watched the value of payment id to determine if it is test mode or not
  useEffect(() => {
    if (transaction_data?.paymentid?.split("_")[0] === "TEST") {
      setIsTestEnv(true);
    }
  }, [transaction_data?.paymentid]);

  useEffect(() => {
    dispatch(hide_error());
    setTimeout(() => {
      onLoad();
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {show && (
        <div className="relative max-w-[680px] h-[580px] max-h-[580px] mx-auto">
          <div className="switch:my-[8%] switch:p-4 ">
            <Toast />
            {isLoading && <Spinner lg={true} />}
            {paymentSuccessful && <Success />}
            {invalidPaymentId && <Invalid description="Invalid Payment ID" />}
            {invalidRedirectUrl && (
              <Invalid
                description="Redirect URL must be a fully qualified domain name!"
                // go={goToMerchantSite}
              />
            )}
            {paymentAlreadyMade && (
              <Invalid
                description="Payment already made.!"
                go={goToMerchantSite}
              />
            )}
            {customErrorMessage && (
              <Invalid description={customErrorMessage}  />
            )}
            {messageFrom3ds && (
              <Invalid description={messageFrom3ds} go={goToMerchantSite} />
            )}
            {!paymentSuccessful &&
              !paymentAlreadyMade &&
              !customErrorMessage &&
              !invalidPaymentId &&
              selectedOption !== "" &&
              !isLoading && (
                <>
                  <div className="hidden switch:block ">
                    <div className="relative  w-full border rounded-theme border-dark/70 shadow-custom_shadow p-10 bg-white ">
                      <img
                        src={CloseIcon}
                        alt="close"
                        className="w-10 absolute  -right-4 -top-4 z-[10] cursor-pointer"
                        onClick={onCloseFrame}
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
                            {transaction_data?.currency}{" "}
                            {transaction_data?.amount}
                          </h2>
                          <p className="text-text text-sm">
                            {transaction_data?.source?.customer?.email}
                          </p>
                        </div>
                        <div className="min-h-[350px]">
                          {selectedOption === "card" && <CardPayment />}
                          {selectedOption === "qr" && <QRPayment />}
                          {selectedOption === "ussd" && <USSDPayment />}
                          {selectedOption === "account" && <BankTransfer />}
                          {selectedOption === "enaira" && <ENaira />}
                        </div>
                      </div>
                    </div>
                    {isTestEnv && (
                      <div className="py-2 px-12 bg-test/20 rounded-theme w-fit mx-auto my-3">
                        <p className="text-[#d3b869] text-base font-semibold">
                          You are currently in test mode
                        </p>
                      </div>
                    )}

                    <div className="mt-6">
                      <SecureFooter />
                    </div>
                  </div>
                  <div className="switch:hidden ">
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
                              <img
                                src={transaction_data?.merchant_logo}
                                alt="logo"
                                className="w-9 h-9 mr-1"
                              />
                              <h3 className="text-sm font-bold ml-1 pr-3 truncate">
                                {transaction_data?.tradingname}
                              </h3>
                            </div>
                            <div
                              className="flex items-center"
                              onClick={onCloseFrame}
                            >
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
                              <span className="text-[#001E31] ml-3">
                                {active.name}
                              </span>
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
                          {selectedOption === "account" && <BankTransfer />}
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

            {/* <>
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
                    {transaction_data?.currency}{" "}
                    {transaction_data?.transaction_amount}
                  </h2>
                  <p className="text-text text-sm">
                    {transaction_data?.source?.customer?.email}
                  </p>
                </div>
                {selectedOption === "card" && <CardPayment />}
                {selectedOption === "qr" && <QRPayment />}
                {selectedOption === "ussd" && <USSDPayment />}
                {selectedOption === "transfer" && <BankTransfer />}
                {selectedOption === "enaira" && <ENaira />}
              </div>
            </div>
            {isTestEnv && (
              <div className="py-2 px-12 bg-test/20 rounded-theme w-fit mx-auto my-3">
                <p className="text-[#d3b869] text-base font-semibold">
                  You are currently in test mode
                </p>
              </div>
            )}

            <div className="mt-6">
              <SecureFooter />
            </div>
          </div>
        </div>
        <div className="switch:hidden ">
        
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
      </> */}
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;
