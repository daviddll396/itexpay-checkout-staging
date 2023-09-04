import { createSlice } from "@reduxjs/toolkit";

export interface InitialState {
  userPayload: any;
  references: any;
  bankTransferResponse: any;
  qrResponse: any;
  payment: any;
  inProcess: boolean;
  customColor: any;
  error: {
    show: boolean;
    message: string;
  };
  show: boolean;
  threeDsModal: boolean;
  transactionErrorMessage: { message: string } | null;
  ip: "";
}

const initialState: InitialState = {
  userPayload: {},
  references: {},
  bankTransferResponse: {},
  qrResponse: {},
  payment: {},
  inProcess: false,
  error: {
    show: false,
    message: "",
  },
  customColor: [
    { name: "sidebar_color", value: "#041926" },
    { name: "button_color", value: "#27AE60" },
  ],
  show: true,
  threeDsModal: false,
  transactionErrorMessage: null,
  ip: "",
};

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setTransactionResponse(state, { payload }) {
      state.userPayload = { ...state.bankTransferResponse, ...payload };
    },
    setReferences(state, { payload }) {
      state.references = { ...state.references, ...payload };
    },
    setBankTransferResponse(state, { payload }) {
      state.bankTransferResponse = {
        paymentid: payload.paymentid,
        response: payload.response,
      };
    },
    setQRResponse(state, { payload }) {
      state.qrResponse = {
        paymentid: payload.paymentid,
        response: payload.response,
      };
    },
    setPaymentCompleted(state, { payload }) {
      state.payment = {
        paymentid: payload.paymentid,
        paycompleted: payload.paycompleted,
        message: payload.message,
        code: payload.code,
      };
    },
    setProcessing(state, { payload }) {
      state.inProcess = payload;
    },
    setTransactionErrorMessage(state, { payload }) {
      state.transactionErrorMessage = payload;
    },
    show_error(state, { payload }) {
      state.error = { show: true, message: payload.message };
    },
    hide_error(state) {
      state.error = { show: false, message: "" };
    },
    close_modal(state) {
      let redirecturl = state.userPayload?.redirecturl || null;
      if (redirecturl) {
        window.open(`${redirecturl}`, "_top");
      } else {
        window.parent.postMessage({ name: "closeiframe" }, "*");
        window.parent.postMessage(
          {
            closeModal: true,
          },
          "*"
        );
      }
      // state.show = false;
    },
    setThreeDSModal(state, { payload }) {
      state.threeDsModal = payload as boolean;
    },
    update_custom(state, { payload }) {
      state.customColor = [...payload];
    },
    update_ip(state, { payload }) {
      state.ip = payload;
    },
  },
});

export const {
  setTransactionResponse,
  setReferences,
  setBankTransferResponse,
  setQRResponse,
  setPaymentCompleted,
  setProcessing,
  setTransactionErrorMessage,
  setThreeDSModal,
  show_error,
  hide_error,
  close_modal,
  update_custom,update_ip
} = paymentSlice.actions;
export default paymentSlice.reducer;
