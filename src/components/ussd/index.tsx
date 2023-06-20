/* eslint-disable react-hooks/exhaustive-deps */
import { useState, Fragment, useEffect } from "react";
import BankLogo from "../../assets/images/merchantlogo.png";
import { ReactComponent as ArrowLeft } from "../../assets/icons/arrow-left.svg";
import { ReactComponent as CopyIcon } from "../../assets/icons/copy-icon.svg";
import { ReactComponent as CaretDown } from "../../assets/icons/caret-down.svg";
import { Combobox, Transition } from "@headlessui/react";
import useCopyToClipboard from "src/hooks/useCopyToClipboard";
import banksData from "src/data/banks.json";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "src/redux";
import { hide_error, setProcessing, show_error } from "src/redux/PaymentReducer";
import { create_ussd_transaction, encrypt_data } from "src/api/utility";
import { charge } from "src/api";
import useCustomFunctions from "src/hooks/useCustomFunctions";
import Spinner, { SpinnerInline } from "../shared/Spinner";

const USSDPayment = () => {
  const dispatch = useDispatch();
  const transaction_data = useSelector(
    (state: RootState) => state.payment.userPayload
  );
  const references = useSelector(
    (state: RootState) => state.payment.references
  );
  const customColor = useSelector(
    (state: RootState) => state.payment.customColor
  );
  const button_color = customColor.find(
    (item: any) => item.name === "button_color"
  );
  const { runTransaction } = useCustomFunctions();
  const [value, copy] = useCopyToClipboard();
  const [selected, setSelected] = useState<any>("");
  const [query, setQuery] = useState("");
  const [bankLogoUrl, setBankLogoUrl] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ussdAvailable, setUSSDAvailable] = useState(false);
  const [paymentMade, setPaymentMade] = useState(false);

  const [server, setServer] = useState({
    message: "",
    otp: "",
    linkingreference: "",
    reference: "",
    redirecturl: "",
    code: "",
    ussd: "",
  });

  // funtion to filter bank by query i.e value entered in the input
  const filteredBank =
    query === ""
      ? banksData
      : banksData.filter((bank) =>
          bank.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  // to get the transaction ussd code after selecting the bank
  const onGetUssdCode = () => {
    setLoading(true);
    if (selected) {
      // setShowCode(true);
      start_ussd_charge();
    } else {
      setLoading(false);
      dispatch(show_error({ message: "Please select a bank to proceed" }));
    }
  };
  // goes back to screen for picking bank
  const onGoBack = () => {
    setShowCode(false);
  };
  const onHandlePayment = () => {
    // clearInterval(timer.current);
    setPaymentMade(true);
    dispatch(setProcessing(true));
    runInterval();
  };
  // get transaction status at intervals
  const runInterval = () => {
    const statusCheck = setInterval(async () => {
      try {
        await runTransaction();
      } catch {
        clearInterval(statusCheck);
      }
    }, 5000);
  };
  const minutes: number = 300;
  let blockminutes = minutes;

  const onTimer = () => {
    runInterval();
    const timer = setInterval(() => {
      blockminutes -= 1;
      if (blockminutes <= 0) {
        clearInterval(timer);
        dispatch(
          show_error({
            message: "Payment request timed out",
          })
        );
      }
    }, 1000);
  };
  const start_ussd_charge = () => {
    dispatch(hide_error());
    setUSSDAvailable(false);
    if (!selected) {
      setLoading(false);
      return;
    }
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
    const { firstname, lastname, email, phone } =
      transaction_data?.source?.customer;
    const { fingerprint, modalref, paymentlinkref } = references;

    let data = create_ussd_transaction(
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
    // create_or_update_event(this.transaction_data.public_key, this.references.modalref, this.references.paymentlinkref, this.customer.email, 'Started USSD charge')

    let request = encrypt_data(JSON.stringify(data), encryptpublickey);
    if (data === null || data === undefined) {
      setLoading(false)
      return;
    }

    charge(transaction_data.paymentid, publickey, request)
      .then((response: any) => {
        setServer({
          ...server,
          message: response?.message,
          ussd: response?.transaction?.note,
          code: response?.code,
          linkingreference: response.transaction.linkingreference,
          reference: response?.transaction?.reference,
          redirecturl: response?.transaction?.redirecturl,
        });
        if (response.code === "09") {
          setUSSDAvailable(true);
          setShowCode(true)
          onTimer();
          // const minutes: number = 300;
          // // runInterval();
          // let blockminutes = minutes;
          // const timer = setInterval(() => {
          //   blockminutes -= 1;
          //   if (blockminutes <= 0) {
          //     clearInterval(timer);
          //     dispatch(
          //       show_error({
          //         message: "Payment request timed out",
          //       })
          //     );
          //   }
          // }, 1000);
          return;
        }
        setSelected("");
        setUSSDAvailable(false);
        setShowCode(false);
        setLoading(false)
        dispatch(show_error({ message: response.message }));
      })
      .catch((error) => {
        setSelected("");
        setUSSDAvailable(false);
        setShowCode(false);
        setLoading(false)
        dispatch(show_error({ message: error?.response?.data?.message || error?.message }));
      });
  };
  // open_vbv_ussd() {
  //   // create_or_update_event(this.transaction_data.public_key, this.references.modalref, this.references.paymentlinkref, this.customer.email, 'USSD verification page opened')
  //   this.$store.commit('hide_error')
  //   this.isLoading = true
  // }

  // get bank logo on bank select
  useEffect(() => {
    selected?.slug
      ? setBankLogoUrl(`logos/${selected?.slug}.png`)
      : setBankLogoUrl("");
  }, [selected]);

  // hides all errors on load
  useEffect(() => {
    dispatch(hide_error());
  }, []);

  return (
    <>
      {loading && <Spinner lg />}
      {!showCode && (
        <div className="px-1">
          <p className="mb-6 text-sm font-medium">Please Select your bank </p>
          <div className="">
            <Combobox value={selected} onChange={setSelected}>
              <div className="relative mt-1">
                <div className="relative w-full cursor-default overflow-hidden ">
                  <img src={bankLogoUrl} alt="" className="icon h-6" />
                  <Combobox.Input
                    className="w-full input_icon"
                    displayValue={(bank: any) => bank.name}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <CaretDown
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                </div>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  afterLeave={() => setQuery("")}
                >
                  <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredBank.length === 0 && query !== "" ? (
                      <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Nothing found.
                      </div>
                    ) : (
                      filteredBank.map((bank) => (
                        <Combobox.Option
                          key={bank.slug}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? "bg-theme/10 text-text" : "text-text"
                            }`
                          }
                          value={bank}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {bank.name}
                              </span>
                              {selected ? (
                                <span
                                  className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                    active ? "text-white" : "text-theme"
                                  }`}
                                >
                                  <CopyIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Combobox.Option>
                      ))
                    )}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>
          </div>
          <div className=" my-6">
            <button onClick={onGetUssdCode} className="button w-full">
              Continue
            </button>
          </div>
        </div>
      )}
      {ussdAvailable && selected && showCode && (
        <div className="">
          <div
            onClick={onGoBack}
            className="flex items-center w-fit gap-x-1 text-[#979797] text-[11px] mb-4 cursor-pointer"
          >
            <ArrowLeft /> <span>Select another bank</span>
          </div>
          <div className="flex items-center justify-center gap-x-2 mb-6">
            <div className="rounded-full w-7 h-7  ">
              <img src={BankLogo} alt="logo" className="w-7 h-7" />
            </div>
            <span>{selected.name}</span>
          </div>

          <p className="text-xs w-4/6 mx-auto text-center mb-6">
            Dial the <strong>USSD</strong> code below on your mobile phone to
            complete the payment
          </p>
          <div className="bg-theme/10 w-fit mx-auto py-1.5 px-5 rounded-3xl flex items-center gap-x-2 mb-6">
            <p className="text-theme font-extrabold text-2xl">{server?.ussd}</p>
            <CopyIcon
              className="text-theme cursor-pointer"
              onClick={() => {
                copy(server?.ussd);
                console.log(value);
              }}
            />
          </div>
          <p className="text-xs w-5/6 mx-auto text-center mb-8 ">
            You have {blockminutes}secs left to complete this payment
          </p>
          {/* <div className=" my-8">
            <button onClick={runInterval} className="button w-full">
              I have completed this payment
            </button>
          </div> */}
          <div className=" my-8">
            {paymentMade === true ? (
              <SpinnerInline
                lg
                withText
                text="Checking Transaction. Please wait ..."
              />
            ) : (
              <button
                className="button w-full"
                onClick={onHandlePayment}
                style={{
                  backgroundColor: button_color
                    ? button_color.value
                    : "#27AE60",
                }}
              >
                I have made this payment
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default USSDPayment;
