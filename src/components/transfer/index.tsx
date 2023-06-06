import { useEffect, useState } from "react";
import { ReactComponent as CopyIcon } from "../../assets/icons/copy-icon.svg";
import useCustomFunctions from "src/hooks/useCustomFunctions";
import useCopyToClipboard from "src/hooks/useCopyToClipboard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/redux";
import { setBankTransferResponse, show_error } from "src/redux/PaymentReducer";
import {
  create_bank_transfer_transaction,
  encrypt_data,
} from "src/api/utility";
import { initiate_charge } from "src/api";
import Spinner from "../shared/Spinner";

const BankTransfer = () => {
  const dispatch = useDispatch();
  const transaction_data = useSelector(
    (state: RootState) => state.payment.userPayload
  );
  // const bankTransferResponse = useSelector(
  //   (state: RootState) => state.payment.bankTransferResponse
  // );
  // const references = useSelector(
  //   (state: RootState) => state.payment.references
  // );
  const customer = useSelector(
    (state: RootState) => state.payment.userPayload?.source?.customer
  );
  const { runTransaction } = useCustomFunctions();
  const [value, copy] = useCopyToClipboard();
  const [isLoading, setIsLoading] = useState(true);
  const [bankAccountAvailable, setBankAccountAvailable] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [bank, setBank] = useState("");

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
    let request = encrypt_data(JSON.stringify(data), encryptpublickey);
    setIsLoading(true);
    initiate_charge(transaction_data.paymentid, publickey, request)
      .then((response: any) => {
        console.log("transfer res", response);
        dispatch(
          setBankTransferResponse({
            paymentid: transaction_data.paymentid,
            response,
          })
        );
        if (response.code === "09") {
          setIsLoading(false);
          setBankAccountAvailable(true);
          setAccountNumber(
            response.source.customer.account.recipientaccountnumber
          );
          setBank(response.source.customer.account.bank);
          runInterval();
          return;
        }
        setIsLoading(false);
        setBankAccountAvailable(false);
        dispatch(show_error({ message: response.message }));
      })
      .catch((error) => {
        setIsLoading(false);
        dispatch(show_error({ message: error.message }));
      });
  };

  useEffect(() => {
    // if (
    //   bankTransferResponse.paymentid &&
    //   bankTransferResponse.paymentid === transaction_data.paymentid
    // ) {
    //   const { response } = bankTransferResponse;

    //   if (response.code === "09") {
    //     setIsLoading(false);
    //     setBankAccountAvailable(true);
    //     setAccountNumber(
    //       response.source.customer.account.recipientaccountnumber
    //     );
    //     setBank(response.source.customer.account.bank);
    //     runInterval();
    //     return;
    //   }
    //   setIsLoading(false);
    //   setBankAccountAvailable(false);
    //   dispatch(show_error({ message: response.message }));
    // } else {
    //   get_bank_account();
    // }
    get_bank_account();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      {isLoading && <Spinner lg />}
      {bankAccountAvailable  && (
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
                  <h5 className="text-center font-medium">{bank}</h5>
                </div>
                <div className="col-span-1 px-3">
                  <p className="text-[10px] text-center mb-1">
                    Beneficiary Name
                  </p>
                  <h5 className="text-center font-medium">Testmy Perfait</h5>
                </div>
              </div>
              <p className="text-[10px] w-4/6 mx-auto text-center mb-8">
                The account details is only valid for this specific transaction
                and it'll expire by 11:46AM (today)
              </p>
            </div>
            <div className=" my-8">
              <button className="button w-full">
                I have made this payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankTransfer;
