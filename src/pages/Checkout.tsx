import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import CloseIcon from "../assets/icons/close.svg";
import SecureFooter from "../components/shared/SecureFooter";
import { paymentChannels } from "../data";
import CardPayment from "../components/card/CardPayment";
import QRPayment from "src/components/qr";
// import USSDPayment from "src/components/ussd";
import BankTransfer from "src/components/transfer";
import ChangePaymentDrawer from "../components/changePaymentDrawer";
import ENaira from "src/components/e-naira";
import { generate_reference } from "src/api/utility";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { get_payment_details } from "src/api";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import {
  close_modal,
  hide_error,
  setPaymentCompleted,
  setReferences,
  setTransactionResponse,
  // show_error,
  update_custom,
} from "src/redux/PaymentReducer";
import useCustomFunctions from "src/hooks/useCustomFunctions";
import Spinner from "src/components/shared/Spinner";
import Success from "src/components/shared/Success";
import Invalid from "src/components/shared/Invalid";
import Toast from "src/components/shared/Toast";
import PayAttitude from "src/components/payattitude";

const Checkout = () => {
  const dispatch = useAppDispatch();
  const transaction_data = useAppSelector((state) => state.payment.userPayload);

  const show = useAppSelector((state) => state.payment.show);
  const payment = useAppSelector((state) => state.payment.payment);
  const transactionError = useAppSelector(
    (state) => state.payment.transactionErrorMessage
  );
  const { sendEvent } = useCustomFunctions();
  const [active, setActive] = useState(paymentChannels[0]);
  const [activeImgUrl, setActiveImgUrl] = useState("");
  const [selectState, setSelectState] = useState(false);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [invalidPaymentId, setInvalidPaymentId] = useState(false);
  const [invalidRedirectUrl, setInvalidRedirectUrl] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [messageFrom3ds, setMessageFrom3ds] = useState<string | null>("");
  const [customErrorMessage, setCustomErrorMessage] = useState<string | null>(
    ""
  );
  const [paymentAlreadyMade, setPaymentAlreadyMade] = useState<boolean>(false);
  const [isTestEnv, setIsTestEnv] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [params, setParams] = useState<any>(null);

  useEffect(() => {
    if (transactionError) {
      setCustomErrorMessage(transactionError.message);
    }
  }, [transactionError]);

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
        dispatch(
          setTransactionResponse({
            ...response.data,
            callbackurl: "",
          })
        );
        dispatch(
          setPaymentCompleted({
            paymentid: response.data.paymentid,
            paycompleted: null,
          })
        );
        if (
          Array.isArray(response.data?.custom) &&
          response.data?.custom.length > 0
        ) {
          dispatch(update_custom(response.data.custom));
        }

        if (response.data.paymentmethods.length < 1) {
          setCustomErrorMessage("Payment not allowed.");
          return;
        }
        setSelectedOption("card");
        setActive(transaction_data?.paymentmethods[0]);
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
    dispatch(close_modal());
    // const { pathname } = new URL(window.location.href);
    // const paymentID = params.get("paymentid");
    // // const paymentID = pathname.split("/")[1];
    // // show success page and redirect to merchant
    // get_payment_details(paymentID)
    //   .then((response: any) => {
    //     const { redirecturl } = response.data;
    //     // show success page and redirect to merchant
    //     if (redirecturl) {
    //       window.open(`${redirecturl}?paymentid=${paymentID}`, "_top");
    //     } else {
    //       setTimeout(() => {
    //         let url =
    //           window.location !== window.parent.location
    //             ? document.referrer
    //             : document.location.href;
    //         window.parent.postMessage(
    //           { name: "vbvcomplete", response: response },
    //           url
    //         );
    //         dispatch(close_modal());
    //       }, 1000);
    //     }
    //   })
    //   .catch((error) => {
    //     console.log({
    //       errMsg:
    //         error?.response?.data?.message ||
    //         error?.response?.data?.status ||
    //         error?.message,
    //     });
    //     dispatch(close_modal());
    //   });
  };
  // close frame
  const onCloseFrame = () => {
    dispatch(close_modal());
  };

  useEffect(() => {
    setActiveImgUrl(`cards/${selectedOption}.png`);
  }, [selectedOption]);
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
        // dispatch(
        //   show_error({
        //     message: `${payment?.message}. Please, try another payment method`,
        //   })
        // );
        setCustomErrorMessage(payment?.message);
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
    onLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {show && (
        <div className="relative w-full  max-w-[680px] min-h-screen switch:h-[580px] switch:max-h-[580px] mx-auto bg-white switch:bg-transparent">
          <Toast />
          {isLoading && <Spinner lg={true} />}
          {paymentSuccessful && <Success go={goToMerchantSite} />}
          {invalidPaymentId && (
            <Invalid description="Invalid Payment ID" go={goToMerchantSite} />
          )}
          {invalidRedirectUrl && (
            <Invalid
              description="Redirect URL must be a fully qualified domain name!"
              go={goToMerchantSite}
            />
          )}
          {paymentAlreadyMade && (
            <Invalid
              description="Payment already made.!"
              go={goToMerchantSite}
            />
          )}
          {customErrorMessage && (
            <Invalid description={customErrorMessage} go={goToMerchantSite} />
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
                <div className=" switch:my-[8%] switch:p-4 ">
                  {selectState ? (
                    <div className="absolute top-0 bottom-0 left-0 right-0 bg-black/50 z-[3]"></div>
                  ) : null}
                  <div className="relative w-full max-w-[680px] switch:max-h-[580px]  mx-auto  switch:rounded-theme bg-white switch:shadow-custom_shadow switch:p-10 ">
                    <img
                      src={CloseIcon}
                      alt="close"
                      className="w-10 hidden switch:block absolute  -right-4 -top-4 z-[10] cursor-pointer"
                      onClick={onCloseFrame}
                    />
                    <Sidebar
                      active={active}
                      setActive={setActive}
                      changePaymentOption={setSelectedOption}
                      selectState={selectState}
                      setSelectState={setSelectState}
                      onClose={onCloseFrame}
                    />

                    <div className="p-4 switch:ml-[32%]  switch:pl-5 ">
                      <div className=" mt-2 mb-4 pb-2 border-b border-b-[#B9B9B9] flex items-center justify-between">
                        <div className="max-w-[200px]">
                          <img src={activeImgUrl} alt="" className="w-36" />
                        </div>
                        <div>
                          <h2 className="font-extrabold text-lg sm:text-xl text-title">
                            {transaction_data?.currency}{" "}
                            {transaction_data?.amount}
                          </h2>
                          <p className="text-text text-xs switch:text-sm">
                            {transaction_data?.source?.customer?.email}
                          </p>
                        </div>
                      </div>
                      <div className="min-h-[300px] flex items-center ">
                        {selectedOption === "card" && <CardPayment />}
                        {selectedOption === "qr" && <QRPayment />}
                        {/* {selectedOption === "ussd" && <USSDPayment />} */}
                        {selectedOption === "account" && <BankTransfer />}
                        {selectedOption === "enaira" && <ENaira />}
                        {selectedOption === "phone" && <PayAttitude />}
                      </div>
                    </div>
                  </div>
                </div>
                {isTestEnv && (
                  <div className="py-2 px-8 switch:px-12 bg-test/20 rounded-theme w-fit mx-auto my-3">
                    <p className="text-[#d3b869] text-sm switch:text-base font-semibold">
                      You are currently in test mode
                    </p>
                  </div>
                )}
                <div className="mt-6">
                  <SecureFooter />
                </div>
                {selectState === true ? (
                  <ChangePaymentDrawer
                    active={active}
                    setActive={setActive}
                    selectState={selectState}
                    setSelectState={setSelectState}
                    changePaymentOption={setSelectedOption}
                  />
                ) : null}
              </>
            )}
        </div>
      )}
    </>
  );
};

export default Checkout;
