import { useSelector, useDispatch } from "react-redux";
import { ReactComponent as Cancel } from "../../assets/icons/cancel2.svg";
import { RootState } from "src/redux";
import { hide_error } from "src/redux/PaymentReducer";

const Toast = () => {
  const error = useSelector((state: RootState) => state.payment.error);
  const dispatch = useDispatch();
  const onClose = () => {
    dispatch(hide_error());
  };
  return (
    error.show && (
      <div className="absolute top-0 right-0 w-3/5 p-4 bg-rose-600 z-[1000]">
        <div className="">
          <Cancel className="absolute top-2 right-2" onClick={onClose} />

          <p>{error.message}</p>
        </div>
      </div>
    )
  );
};

export default Toast;
