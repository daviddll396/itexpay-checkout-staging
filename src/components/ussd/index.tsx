import { useState, Fragment, useEffect } from "react";
import BankLogo from "../../assets/images/merchantlogo.png";
import { ReactComponent as ArrowLeft } from "../../assets/icons/arrow-left.svg";
import { ReactComponent as CopyIcon } from "../../assets/icons/copy-icon.svg";
import { ReactComponent as CaretDown } from "../../assets/icons/caret-down.svg";
import { Combobox, Transition } from "@headlessui/react";
import useCopyToClipboard from "src/hooks/useCopyToClipboard";
import banksData from "src/data/banks.json";

const USSDPayment = () => {
  const [value,copy] = useCopyToClipboard();
  const [selected, setSelected] = useState<any>(banksData[0]);
  const [query, setQuery] = useState("");
  const [bankLogoUrl, setBankLogoUrl] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState<string>(`*${selected?.ussd}*000*9628#`);

  const filteredBank =
    query === ""
      ? banksData
      : banksData.filter((bank) =>
          bank.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  const onShowCode = () => {
    if (selected) {
      setShowCode(true);
    } else {
      alert("Please select a bank");
    }
  };
  const onGoBack = () => {
    setShowCode(false);
  };

  useEffect(() => {
    selected?.slug
      ? setBankLogoUrl(`logos/${selected?.slug}.png`)
      : setBankLogoUrl("");
  }, [selected]);

  return (
    <>
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
            <button onClick={onShowCode} className="button w-full">
              Continue
            </button>
          </div>
        </div>
      )}
      {showCode && (
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
            <p className="text-theme font-extrabold text-2xl">{code}</p>
            <CopyIcon
              className="text-theme cursor-pointer"
              onClick={() => copy(code)}
            />
          </div>
          <p className="text-xs w-5/6 mx-auto text-center mb-8 ">
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
