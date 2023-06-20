import { Fragment, useState } from "react";
import { Menu, Transition, RadioGroup } from "@headlessui/react";
import { ReactComponent as CaretDown } from "../../assets/icons/caret-down.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/redux";
import { setProcessing, show_error } from "src/redux/PaymentReducer";
import { create_enaira_transaction, encrypt_data } from "src/api/utility";
import { charge } from "src/api";
import useCustomFunctions from "src/hooks/useCustomFunctions";
import PIN from "../pin";
import OTP from "../otp";
import {
  isValidEmail,
  isValidNuban,
  validateNuban,
  validatePhone,
} from "src/utils";
import  { SpinnerInline } from "../shared/Spinner";

const ENaira = () => {
  const options = [
    {
      name: "Alias",
      id: "alias",
    },
    {
      name: "Phone",
      id: "phone",
    },
    {
      name: "Email",
      id: "email",
    },
    {
      name: "Nuban",
      id: "nuban",
    },
  ];
  const validation = [
    {
      name: "PIN",
      id: "pin",
      description: "Use your e-naira wallet PIN to pay.",
    },
    {
      name: "TOKEN",
      id: "token",
      description: "Generate your token from the e-naira app.",
    },
  ];
  const transaction_data = useSelector(
    (state: RootState) => state.payment.userPayload
  );
  const customer = useSelector(
    (state: RootState) => state.payment.userPayload?.source?.customer
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
  const dispatch = useDispatch();
  const { runTransaction } = useCustomFunctions();

  const [selected, setSelected] = useState<any>(options[0]);
  const [ref, setRef] = useState(validation[0].id);
  const [value, setValue] = useState("");
  const [tokenValue, setTokenValue] = useState("");
  const [pin, setPin] = useState<any>({
    one: "",
    two: "",
    three: "",
    four: "",
  });
  const [paymentMade, setPaymentMade] = useState(false);
  const [err, setErr] = useState("");
  const [stage, setStage] = useState("enaira");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [alias, setAlias] = useState("@");
  const [nuban, setNuban] = useState("");
  const [phone, setPhone] = useState("");

  const onChangeSelected = (option: { id: string; name: string }) => {
    setSelected(option);
    setErr("");
    setValue("");
    setEmail("");
    setNuban("");
    setAlias("");
    setPhone("");
  };
  const onChange = (e: any) => {
    let val = e.target.value;
    // eslint-disable-next-line no-control-regex
    if (!selected) {
      setErr("Please select a validation method");
      return;
    }
    if (!val || val === "") {
      setErr("");
    }
    if (selected?.id === "email") {
      let regexEmail = new RegExp(
        /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/
      );
      let isValidEmail = regexEmail.test(val);
      if (!isValidEmail) {
        setErr("Email must be a valid email address");
      } else {
        setErr("");
      }
      setEmail(val);
    }
    if (selected?.id === "phone") {
      setPhone(validatePhone(val));
    }
    if (selected?.id === "alias") {
      if (val.startsWith("@")) {
        setAlias(val);
      } else {
        setAlias("@" + val);
      }
    }
    if (selected?.id === "nuban") {
      setNuban(validateNuban(val));
    }
    setValue(val);
  };
  const onNext = () => {
    const val = selected.id;
    if (!val) {
      setErr("Please select a validaton method");
      // dispatch(show_error({ message: "Please select a validaton method" }));
      return;
    }
    if (
      val === "alias" &&
      (!alias || !alias.startsWith("@" || alias.length < 5))
    ) {
      setErr("Please input your alias");
      return;
    }
    if (val === "nuban" && !isValidNuban(nuban)) {
      // dispatch(show_error({ message: "Please input a valid nuban" }));
      setErr("Please input a valid nuban");
      return;
    }
    if (val === "phone" && (!phone || phone.length < 11 || phone.length > 13)) {
      setErr("Please input your phone number");
      return;
    }
    if (val === "email" && !isValidEmail(email)) {
      setErr("Please input a valid email address");
      // dispatch(show_error({ message: "Please input a valid email address" }));
      return;
    }
    if (ref === "pin") {
      setStage("pin");
      dispatch(setProcessing(true))
      return;
    }
    if (ref === "token") {
      setStage("token");
      dispatch(setProcessing(true))
      return;
    }
    dispatch(
      show_error({ message: "Please select an authentication method!" })
    );
  };
  const onHandlePayment = () => {
    setPaymentMade(true);
    dispatch(setProcessing(true));
    handleTransaction();
    // runInterval();
  };
  const handleGoBack = () => {
    setStage("enaira");
    dispatch(setProcessing(false))
    setPin({
      one: "",
      two: "",
      three: "",
      four: "",
    });
    setTokenValue("");
  };
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

  const handleTransaction = () => {
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
    let authdata;
    if (ref === "pin" && pin.one && pin.two && pin.three && pin.four) {
      console.log("here");
      authdata = `${pin.one}${pin.two}${pin.three}${pin.four}`;
    } else {
      if (ref === "token") {
        authdata = tokenValue;
      } else {
        dispatch(show_error({ message: `Please input your ${stage}` }));
      }
    }

    try {
      let data = create_enaira_transaction(
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
        paymentid,
        value,
        selected.id,
        ref,
        authdata
      );
      if (data === null || data === undefined) return;

      let request = encrypt_data(JSON.stringify(data), encryptpublickey);

      charge(transaction_data.paymentid, publickey, request)
        .then((response: any) => {
          if (response.code === "09") {
            runInterval();
            return;
          }
          dispatch(
            show_error({
              message: response?.data?.message || response?.message,
            })
          );
          setLoading(false);
          dispatch(setProcessing(false));
        })
        .catch((error: any) => {
          console.log({ error });
          dispatch(
            show_error({
              message: error?.response?.data?.message || error?.message,
            })
          );
          setLoading(false);
          dispatch(setProcessing(false));
        });
    } catch (err: any) {
      console.log(err?.message);
      dispatch(setProcessing(false));
      setLoading(false);
    }
  };

  return (
    <>
      {/* {paymentMade && (
        <Spinner md withText text="Checking Transaction. Please wait..." />
      )} */}
      {stage === "enaira" && (
        <div className="w-full">
          <p className="mb-4 text-sm switch:text-base  font-semibold text-text/80">
            Pay using your e-naira wallet
          </p>

          <div className="mb-4">
            <div className="flex items-center flex-nowrap input focus:outline-dark/50 focus:outline-[0.5px] w-full">
              <div className="flex-1">
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="inline-flex w-full justify-center  bg-transparent border-r border-r-[#B9B9B9]  pr-3 text-xs md:text-sm font-medium whitespace-nowrap overflow-x-hidden text-text hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                      {selected?.name || "Select method"}
                      <CaretDown
                        className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-36 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-2 py-2 ">
                        {options.map((option) => (
                          <Menu.Item key={option.id}>
                            {({ active }) => (
                              <button
                                onClick={() => onChangeSelected(option)}
                                className={`${
                                  active ? "bg-theme/10 text-text" : "text-text"
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm capitalize`}
                              >
                                {option.name}
                              </button>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>

              <div className="w-full">
                {selected.id === "alias" && (
                  <input
                    className=" w-full  pl-3 focus:outline-none "
                    placeholder=""
                    value={alias}
                    onChange={onChange}
                  />
                )}
                {selected.id === "email" && (
                  <input
                    className=" w-full  pl-3 focus:outline-none "
                    placeholder=""
                    value={email}
                    onChange={onChange}
                  />
                )}
                {selected.id === "nuban" && (
                  <input
                    className=" w-full  pl-3 focus:outline-none "
                    placeholder=""
                    value={nuban}
                    onChange={onChange}
                  />
                )}
                {selected.id === "phone" && (
                  <input
                    className=" w-full  pl-3 focus:outline-none "
                    placeholder=""
                    value={phone}
                    onChange={onChange}
                  />
                )}

                {/* <input
                  className=" w-full  pl-3 focus:outline-none "
                  placeholder=""
                  value={value}
                  onChange={onChange}
                /> */}
              </div>
            </div>
            <p className="text-[10px] text-[#FF0000]">{err}</p>
          </div>

          <div>
            <RadioGroup value={ref} onChange={setRef}>
              <RadioGroup.Label className={" font-semibold text-text/80"}>
                Complete Payment with:
              </RadioGroup.Label>
              <div className="w-full grid grid-cols-1 ">
                {validation.map((item, i) => (
                  <RadioGroup.Option
                    key={item.id}
                    value={item.id}
                    as={Fragment}
                  >
                    {({ active, checked }) => (
                      <li
                        className={`  bg-white w-full px-6 py-2 shadow-custom_shadow_three my-3 rounded-md text-text  list-none cursor-pointer border ${
                          checked ? "border-theme" : "border-transparent"
                        }`}
                      >
                        <div className="flex items-center mb-1">
                          <div className="flex items-center">
                            <div
                              className={`w-4 h-4 rounded-full border-2 border-theme p-0.5  ${
                                checked ? "bg-theme/10 " : ""
                              }`}
                            >
                              <div
                                className={`w-full h-full rounded-full  ${
                                  checked ? "bg-theme" : ""
                                }`}
                              ></div>
                            </div>
                          </div>

                          <span className="ml-2 font-semibold ">
                            Pay with {item.name}
                          </span>
                        </div>

                        <p className="text-xs pl-7">{item.description}</p>
                      </li>
                    )}
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          </div>
          <div className=" my-8">
            <button
              className={`button w-full `}
              onClick={onNext}
              style={{
                backgroundColor: button_color ? button_color.value : "#27AE60",
              }}
              disabled={loading}
            >
              {loading ? <SpinnerInline white /> : " Continue"}
            </button>
          </div>
        </div>
      )}
      {stage === "pin" && (
        <PIN
          pin={pin}
          setPin={setPin}
          onContinue={onHandlePayment}
          message="Enter your 4-digit PIN to complete this transaction"
          back
          onGoBack={handleGoBack}
          loading={paymentMade}
        />
      )}
      {stage === "token" && (
        <OTP
          value={tokenValue}
          setValue={setTokenValue}
          buttonText="Continue"
          message="Enter your token to complete this transaction"
          onVerifyOTP={onHandlePayment}
          back
          onGoBack={handleGoBack}
          loading={paymentMade}
        />
      )}
    </>
  );
};

export default ENaira;
