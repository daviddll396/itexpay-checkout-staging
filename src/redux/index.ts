import { configureStore } from "@reduxjs/toolkit";
import PaymentReducer from "./PaymentReducer";
export const store = configureStore({
    reducer: {
        payment: PaymentReducer
    }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch