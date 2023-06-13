import { useEffect, useState, useRef } from "react";
import { ReactComponent as CopyIcon } from "../../assets/icons/copy-icon.svg";
import useCustomFunctions from "src/hooks/useCustomFunctions";
import useCopyToClipboard from "src/hooks/useCopyToClipboard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/redux";
import {
  close_modal,
  setBankTransferResponse,
  setProcessing,
  show_error,
} from "src/redux/PaymentReducer";
import {
  create_bank_transfer_transaction,
  encrypt_data,
} from "src/api/utility";
import { initiate_charge } from "src/api";
import Spinner, { SpinnerInline } from "../shared/Spinner";

const BankTransfer = () => {
  const dispatch = useDispatch();
  const transaction_data = useSelector(
    (state: RootState) => state.payment.userPayload
  );
  const bankTransferResponse = useSelector(
    (state: RootState) => state.payment.bankTransferResponse
  );
  const customer = useSelector(
    (state: RootState) => state.payment.userPayload?.source?.customer
  );
  const { runTransaction } = useCustomFunctions();
  const [value, copy] = useCopyToClipboard();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMade, setPaymentMade] = useState(false);
  const [bankAccountAvailable, setBankAccountAvailable] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [bank, setBank] = useState("");
  const [time, setTime] = useState<number[]>([0, 0]);
  // let paymentMade = useRef(false);

  let statusCheck: any;
  let timer = useRef<any>(null);
  const seconds: number = 300;
  let blockminutes = useRef<any>(seconds);
  const { redirecturl, paymentid } = transaction_data;

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
  const onHandlePayment = () => {
    clearInterval(timer.current);
    setPaymentMade(true);
    dispatch(setProcessing(true));
    runInterval();
  };
  const onTimerEnd = () => {
    // clearInterval(timer);
    dispatch(
      show_error({
        message: "Payment request timed out",
      })
    );
    setBankAccountAvailable(false);
    if (redirecturl) {
      setTimeout(() => {
        return window.open(
          `${redirecturl}?paymentid=${paymentid}`,
          "_top",
          "toolbar=no,scrollbars=no,resizable=yes"
        );
      }, 2000);
    } else {
      setTimeout(() => {
        dispatch(close_modal());
      }, 2000);
    }
  };

  const onTimer = () => {
    timer.current = setInterval(() => {
      if (blockminutes.current > 0) {
        blockminutes.current -= 1;
        const minutes = Math.floor(blockminutes.current / 60);
        const seconds = Math.floor(blockminutes.current % 60);
        setTime([minutes, seconds]);
        // console.log({ blockminutes, minutes, seconds });
      } else {
        onTimerEnd();
        clearInterval(timer.current);
      }
    }, 1000);
  };
  const get_bank_account = () => {
    const {
      reference,
      amount,
      currency,
      country,
      callbackurl,
      publickey,
      encryptpublickey,
      paymentid,
    } = transaction_data;
    const { firstname, lastname, email, phone } = customer;
    let data = create_bank_transfer_transaction(
      reference,
      callbackurl,
      amount,
      currency,
      country,
      firstname,
      lastname,
      email,
      phone,
      paymentid
    );
    // console.log({ data });

    let request = encrypt_data(JSON.stringify(data), encryptpublickey);
    setIsLoading(true);
    initiate_charge(transaction_data.paymentid, publickey, request)
      .then((response: any) => {
        // console.log("transfer res", response);
        dispatch(
          setBankTransferResponse({
            paymentid: transaction_data.paymentid,
            response,
          })
        );
        if (response.code && response.code === "09") {
          setBankAccountAvailable(true);
          setAccountNumber(
            response.source.customer.account.recipientaccountnumber
          );
          setAccountName(response.source.customer.account.recipientname);
          setBank(response.source.customer.account.bank);
          onTimer();
          setIsLoading(false);
          return;
        }
        setIsLoading(false);
        setBankAccountAvailable(false);
        dispatch(show_error({ message: response.message }));
        // onTimer();
      })
      .catch((error) => {
        // console.log({error})
        let errMsg = error?.response?.data?.message || error?.message;
        setIsLoading(false);
        dispatch(show_error({ message: errMsg }));
        // onTimer();
      });
  };
  useEffect(() => {
    if (
      bankTransferResponse.paymentid &&
      bankTransferResponse.paymentid === transaction_data.paymentid
    ) {
      const { response } = bankTransferResponse;

      if (response && response.code === "09") {
        setBankAccountAvailable(true);
        setAccountNumber(
          response.source.customer.account.recipientaccountnumber
        );
        setBank(response.source.customer.account.bank);
        setIsLoading(false);
        runInterval();
        return;
      }
      setIsLoading(false);
      setBankAccountAvailable(false);
      dispatch(show_error({ message: response.message }));
    } else {
      get_bank_account();
    }

    return () => {
      clearInterval(statusCheck);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      {isLoading && <Spinner lg />}
      {!isLoading && !bankAccountAvailable && (
        <div>
          <h3 className="font-semibold text-text/80">
            Unable to get bank account, please try a different method
          </h3>
        </div>
      )}
      {bankAccountAvailable && !isLoading && (
        <div>
          <p className="mb-4 text-sm font-medium">
            Transfer directly from your bank
          </p>

          <div className="px-2">
            <div>
              <p className="text-[11px] text-center">Account number</p>
              <div className="bg-theme/10 w-fit mx-auto py-1.5 px-5 rounded-3xl flex items-center gap-x-2 my-2">
                <p className="text-theme font-extrabold text-2xl ">
                  {accountNumber}
                </p>
                <CopyIcon
                  className="text-theme cursor-pointer"
                  onClick={() => {
                    copy(accountNumber);
                    console.log(value);
                  }}
                />
              </div>
              <div className="bg-[#B9B9B9]/[0.13] rounded-[10px] grid grid-cols-2 divide-x divide-[#B1B1B1]/50 py-3 my-4">
                <div className="col-span-1 px-3">
                  <p className="text-[10px] text-center mb-1">Bank Name</p>
                  <h5 className="text-center font-medium truncate">
                    {bank.replace("_", " ")}
                  </h5>
                </div>
                <div className="col-span-1 px-3">
                  <p className="text-[10px] text-center mb-1">
                    Beneficiary Name
                  </p>
                  <h5 className="text-center font-medium truncate">
                    {accountName}
                  </h5>
                </div>
              </div>
              <p className="text-[11px]  mx-auto text-center mb-8">
                The account details is only valid for this specific transaction
                and it'll expire in
                <span className="font-semibold text-[13px] mx-1">
                  {time[0]}
                </span>
                minutes and
                <span
                  className={`font-semibold text-[13px] mx-1 ${
                    blockminutes.current < 20 ? "text-rose-600" : ""
                  }`}
                >
                  {time[1]}
                </span>
                seconds.
              </p>
            </div>
            <div className=" my-8">
              {paymentMade === true ? (
                <SpinnerInline
                  lg
                  withText
                  text="Checking Transaction. Please wait ..."
                />
              ) : (
                <button className="button w-full" onClick={onHandlePayment}>
                  I have made this payment
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankTransfer;
