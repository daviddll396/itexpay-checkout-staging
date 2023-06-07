import { useSelector, useDispatch } from "react-redux";
import { ReactComponent as Cancel } from "../../assets/icons/cancel2.svg";
import { ReactComponent as ErrorIcon } from "../../assets/icons/error.svg";
import { RootState } from "src/redux";
import { hide_error } from "src/redux/PaymentReducer";
import { Transition } from "@headlessui/react";

const Toast = () => {
  const error = useSelector((state: RootState) => state.payment.error);
  const dispatch = useDispatch();
  const onClose = () => {
    dispatch(hide_error());
  };
  return (
    <Transition
      show={error.show}
      enter="transition-opacity duration-75"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        onClick={onClose}
        className="absolute top-2 right-2 switch:top-4 switch:right-4 switch:w-[64.5%] p-3 bg-[#F8D7D9] z-[1000] rounded-tr-theme cursor-pointer"
      >
        <div className="flex items-center gap-x-2">
          <Cancel
            className="absolute top-3 right-3 text-[#ff0000b6] w-3 h-3"
            onClick={onClose}
          />
          <ErrorIcon className=" text-[#ff0000b6] w-6 h-6" onClick={onClose} />
          <p className="pr-5 text-[#e80505b6] text-sm font-semibold">{error.message}</p>
        </div>
      </div>
    </Transition>
  );
};

export default Toast;
