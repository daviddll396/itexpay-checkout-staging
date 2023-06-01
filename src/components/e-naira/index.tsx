import { Fragment, useState } from "react";
import { Menu, Transition, RadioGroup } from "@headlessui/react";
import { ReactComponent as CaretDown } from "../../assets/icons/caret-down.svg";

const ENaira = () => {
  const options = [
    {
      name: "Phone Number",
      id: "phone",
    },
    {
      name: "E-naira Wallet",
      id: "wallet",
    },
    {
      name: "Email",
      id: "email",
    },
    {
      name: "Account Number",
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
  const [selected, setSelected] = useState<any>(options[0]);
  const [ref, setRef] = useState(validation[0].id);
  const [value, setValue] = useState("");
  const [err, setErr] = useState("");

  const onChangeSelected = (option: { id: string; name: string }) => {
    // alert(JSON.stringify(option));
    setSelected(option);
    setErr("");
    setValue("");
  };

  const onChange = (e: any) => {
    let val = e.target.value;
    // eslint-disable-next-line no-control-regex
    if (!selected) {
      setErr("Please select a validation method");
    }
    if (!val || val === "") {
      setErr("");
    }
    if (selected?.id === "email") {
      let regexEmail = new RegExp(
        // /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/
        /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/
      );
      let isValidEmail = regexEmail.test(val);
      if (!isValidEmail) {
        setErr("Email must be a valid email address");
      } else {
        setErr("");
      }
      setValue(val);
    }
    if (selected?.id === "phone") {
      let regexPhone = new RegExp("^[0-9]{11,11}$");
      let isValidPhone = regexPhone.test(val);
      if (!isValidPhone) {
        setErr("Please input a valid phone number");
      } else {
        setErr("");
        setValue(val);
      }
      setValue(val);
    }
    if (selected?.id === "wallet") {
      let regexEmail = new RegExp(
        ""
      );
      let isValidEmail = regexEmail.test(val);
      if (!isValidEmail) {
        setErr("Email must be a valid email address");
      } else {
        setErr("");
      }
      setValue(val);
    }
    if (selected?.id === "nuban") {
      let regexNuban = new RegExp("^[0-9]{11,11}$");
      let isValidNuban = regexNuban.test(val);
      if (!isValidNuban) {
        setErr("Account number must be 11 digits");
      } else {
        setErr("");
      }
      setValue(val);
    }
  };

  return (
    <div className="">
      <p className="mb-4 text-sm font-medium">Pay using your e-naira wallet</p>

      <div className="mb-6">
        <div className="flex items-center flex-nowrap input focus:outline-dark/50 focus:outline-[0.5px]">
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
                <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-2 py-2 ">
                    {options.map((option) => (
                      <Menu.Item key={option.id}>
                        {({ active }) => (
                          <button
                            onClick={() => onChangeSelected(option)}
                            className={`${
                              active ? "bg-theme/10 text-text" : "text-text"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
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
            <input
              className=" w-full  pl-3 focus:outline-none "
              placeholder=""
              value={value}
              onChange={onChange}
            />
          </div>
        </div>
        <p className="text-[10px] text-[#FF0000]">{err}</p>
      </div>

      <div>
        <RadioGroup value={ref} onChange={setRef}>
          <RadioGroup.Label>Complete Payment with:</RadioGroup.Label>
          <div className="w-full grid grid-cols-1 mt-3">
            {validation.map((item, i) => (
              <RadioGroup.Option key={item.id} value={item.id} as={Fragment}>
                {({ active, checked }) => (
                  <li
                    className={`  bg-white w-full p-4 shadow-custom_shadow my-3 rounded-md text-text  list-none cursor-pointer`}
                  >
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 rounded-full border-2 border-theme p-0.5  ${
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

                      <span className="ml-2">Pay with {item.name}</span>
                    </div>

                    <p className="text-sm pl-7">{item.description}</p>
                  </li>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default ENaira;
