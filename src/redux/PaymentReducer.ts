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
};

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setTransactionResponse(state, payload) {
      state.userPayload = { ...state.bankTransferResponse, ...payload };
    },
    setReferences(state, payload) {
      state.references = { ...state.references, ...payload };
    },
    setBankTransferResponse(state, payload) {
      state.bankTransferResponse = {
        paymentid: payload.payload.paymentid,
        response: payload.payload.response,
      };
    },
    setPaymentCompleted(state, payload) {
      state.payment = {
        paymentid: payload.payload.paymentid,
        paycompleted: payload.payload.paycompleted,
        message: payload.payload.message,
        code: payload.payload.code,
      };
    },
    setProcessing(state, { payload }) {
      state.inProcess = payload;
    },
    show_error(state, payload) {
      state.error = { show: true, message: payload.payload.message };
    },
    hide_error(state) {
      state.error = { show: false, message: "" };
    },
  },
});

export const {
  setTransactionResponse,
  setReferences,
  setBankTransferResponse,
  setPaymentCompleted,
  show_error,
  hide_error,
} = paymentSlice.actions;
export default paymentSlice.reducer;
