import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import clientReducer from "../features/cutomers/customerSlice";
import invoiceReducer from "../features/invoice/invoiceSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    client: clientReducer,
    invoice: invoiceReducer,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
