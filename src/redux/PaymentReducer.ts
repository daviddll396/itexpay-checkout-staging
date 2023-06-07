import { createSlice } from "@reduxjs/toolkit";

export interface InitialState {
  userPayload: any;
  references: any;
  bankTransferResponse: any;
  payment: any;
  inProcess: boolean;
  error: {
    show: boolean;
    message: string;
  };
  show: boolean;
}

const initialState: InitialState = {
  userPayload: {},
  references: {},
  bankTransferResponse: {},
  payment: {},
  inProcess: false,
  error: {
    show: false,
    message: "",
  },
  show: true,
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
    show_error(state, { payload }) {
      state.error = { show: true, message: payload.message };
    },
    hide_error(state) {
      state.error = { show: false, message: "" };
    },
    close_modal(state) {
      state.show = false;
    },
  },
});

export const {
  setTransactionResponse,
  setReferences,
  setBankTransferResponse,
  setPaymentCompleted,
  setProcessing,
  show_error,
  hide_error,
  close_modal,
} = paymentSlice.actions;
export default paymentSlice.reducer;
