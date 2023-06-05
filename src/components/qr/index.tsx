import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useCustomFunctions from "src/hooks/useCustomFunctions";
import { hide_error, show_error } from "src/redux/PaymentReducer";
import { RootState } from "src/redux";
import { create_qr_transaction, encrypt_data } from "src/api/utility";
import { initiate_charge } from "src/api";
import QRCode from "react-qr-code";
import Spinner from "../shared/Spinner";

const QRPayment = () => {
  const dispatch = useDispatch();
  const transaction_data = useSelector(
    (state: RootState) => state.payment.userPayload
  );
  const references = useSelector(
    (state: RootState) => state.payment.references
  );
  const customer = useSelector(
    (state: RootState) => state.payment.userPayload?.source?.customer
  );
  const { runTransaction } = useCustomFunctions();

  const [isLoading, setIsLoading] = useState(true);
  const [qrCodeAvailable, setQrCodeAvailable] = useState(false);
  const [qrCode, setQrCode] = useState("");
  // const [server, setServer] = useState({
  //   message: "",
  //   otp: "",
  //   linkingreference: "",
  //   reference: "",
  //   redirecturl: "",
  //   code: "",
  //   note: "",
  // });
  let statusCheck: any;

  // get transaction status at intervals
  const runInterval = () => {
    statusCheck = setInterval(async () => {
      try {
        await runTransaction();
      } catch {
        clearInterval(statusCheck);
      }
    }, 5000);
  };

  const get_qr_code = () => {
    const {
      reference,
      redirecturl,
      amount,
      currency,
      country,
      paymentid,
      callbackurl,
      publickey,
      encryptpublickey,
    } = transaction_data;
    const { firstname, lastname, email, phone } = customer;
    const { fingerprint, modalref, paymentlinkref } = references;

    //   qrCodeAvailable = false
    setQrCodeAvailable(false);
    setIsLoading(true);
    //   isLoading = true
    let data = create_qr_transaction(
      reference,
      callbackurl,
      redirecturl,
      amount,
      currency,
      country,
      firstname,
      lastname,
      email,
      phone,
      fingerprint,
      modalref,
      paymentlinkref,
      paymentid
    );
    let request = encrypt_data(JSON.stringify(data), encryptpublickey);
    initiate_charge(transaction_data.paymentid, publickey, request)
      .then((response: any) => {
        if (response.code === "09") {
          setQrCodeAvailable(true);
          setIsLoading(false);
          setQrCode(response.transaction.redirecturl);
          runInterval();
          return;
        }
        dispatch(show_error({ message: response.message }));
        setQrCodeAvailable(false);
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(show_error({ message: err?.response?.data?.message ||err?.message }));
        setQrCodeAvailable(false);
        setIsLoading(false);
        clearInterval(statusCheck);
      });
  };

  // hides all errors on load
  useEffect(() => {
    dispatch(hide_error());
    get_qr_code();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {isLoading && !qrCodeAvailable && <Spinner lg />}
      {!isLoading && qrCodeAvailable && (
        <div>
          <p className="text-sm text-center w-10/12 mx-auto">
            Scan the QR Code below on your Bank’s mobile app to complete the
            payment
          </p>

          <div className="max-w-[250px] max-h-[250px] w-[250px] h-[250px] mx-auto bg-theme/5 rounded-theme p-3 mt-6 mb-11">
            <div className="bg-white w-full h-full rounded-theme p-3">
              {qrCode && (
                <QRCode
                  value={qrCode}
                  bgColor={"#FFFFFF"}
                  fgColor={"#000000"}
                  size={250}
                />
              )}
            </div>
          </div>

          <div className=" my-8">
            <button className="button w-full">I have made this payment</button>
          </div>
        </div>
      )}
    </>
  );
};

export default QRPayment;
