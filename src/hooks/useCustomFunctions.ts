import { useDispatch, useSelector } from "react-redux";
import { get_transaction_status, callEvent } from "src/api";
import { RootState } from "src/redux";
import { setPaymentCompleted, show_error } from "src/redux/PaymentReducer";

function useCustomFunctions() {
  const transaction_data = useSelector(
    (state: RootState) => state.payment.userPayload
  );
  const dispatch = useDispatch();
  const sendEvent = ({
    type,
    activity,
  }: {
    type: string;
    activity: string;
  }) => {
    //type is "{init,redirect,otp,scan}"
    const { paymentid, publickey } = transaction_data;
    const evtData = {
      paymentid,
      eventtype: type,
      activity,
    };
    callEvent(paymentid, evtData, publickey)
      .then((response: any) => {
        console.log("event response", response);
        // handle failed
      })
      .catch((error: any) => {
        console.log("event response", {
          errorMsg: error?.response?.data?.messgae || error?.message,
        });
      });
  };
  const openUrl = (redirecturl: string) => {
    window.open(redirecturl, "_blank");
  };
  const success = (
    response: {
      message: any;
      transaction: { linkingreference: any };
      code: any;
    },
    status: string
  ) => {
    const { redirecturl, paymentid } = transaction_data;
    const message = response.message;
    const linkingreference = response.transaction.linkingreference;
    const code = response.code;
    dispatch(
      setPaymentCompleted({
        paymentid: transaction_data.paymentid,
        paycompleted: status,
        message,
        code,
      })
    );
    if (status === "success") {
      if (redirecturl) {
        setTimeout(() => {
          return window.open(
            `${redirecturl}?paymentid=${paymentid}&linkingreference=${linkingreference}&code=${code}&message=${message}`,
            "_top",
            "toolbar=no,scrollbars=no,resizable=yes"
          );
        }, 2000);
      } else {
        setTimeout(() => {
          let url =
            window.location !== window.parent.location
              ? document.referrer
              : document.location.href;
          window.parent.postMessage(
            { name: "vbvcomplete", response: response },
            url
          );
        }, 2000);
      }
    }
  };
  const runTransaction = async () => {
    return new Promise((resolve, reject) => {
      const { paymentid, publickey } = transaction_data;

      get_transaction_status(publickey, paymentid)
        .then((response: any) => {
          const code = response.code;
          if (code !== "09") {
            if (code === "00") {
              success(response, "success");
              resolve("success");
            } else {
              success(response, "failed");
              reject(response);
            }
          }
          // handle failed
        })
        .catch((error: any) => {
          console.log(error);
          dispatch(
            show_error({
              message: error?.response?.data?.message || error.message,
            })
          );
          reject("failed");
        });
    });
  };
  const closeFrame = (onClose:any) => {
    // alert('hi')
    let url =
      window.location !== window.parent.location
        ? document.referrer
        : document.location.href;
        console.log(url,'url');

        // onClose(false);
        
    window.parent.postMessage({ name: "closeiframe" }, url);
    window.parent.postMessage(
      {
        closeModal: true,
      },
      "*"
    );
  };

  return { sendEvent, openUrl, success, runTransaction,closeFrame };
}

export default useCustomFunctions;
