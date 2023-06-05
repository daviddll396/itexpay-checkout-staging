import { useSelector, useDispatch } from "react-redux";
import { ReactComponent as Cancel } from "../../assets/icons/cancel2.svg";
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
      <div onClick={onClose} className="absolute top-2 right-2 switch:top-6 switch:right-6 switch:w-3/5 py-3 pl-5 pr-3 bg-[#ee1a1a] z-[1000] rounded-theme cursor-pointer">
        <div className="">
          <Cancel className="absolute top-3 right-3 text-white w-3 h-3"  onClick={onClose} />

          <p className="pr-5 text-white">{error.message}</p>
        </div>
      </div>
      </Transition>
  
  );
};

export default Toast;
