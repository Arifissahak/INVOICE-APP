import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import invoiceService from "./invoiceService";

export const getallInvoice = createAsyncThunk(
  "invoice/get-invoices",
  async (_, thunkAPI) => {
    try {
      return await invoiceService.getAllInvoice();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createNewInvoice = createAsyncThunk(
  "invoice/create-invoice",
  async ({ invoice, selectedClient }, thunkAPI) => { // Destructure invoice and selectedClient from payload
    try {
      const response = await invoiceService.createInvoice(invoice, selectedClient);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'An error occurred');
    }
  }
);

export const getaInvoice = createAsyncThunk(
  "invoice/geta-invoice",
  async (invoiceId, thunkAPI) => {
    try {
      return await invoiceService.getAInvoice(invoiceId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  "invoice/deleteInvoice",
  async ({ id, username }, thunkAPI) => {
    try {
      const response = await invoiceService.deleteInvoice(id, username);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const resetState = createAction("Reset_all");

const initialState = {
  invoice:[],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: ""
};

export const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getallInvoice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getallInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.invoice = action.payload;
      })
      .addCase(getallInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload.message; // Access error message from payload
      })
      .addCase(getaInvoice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getaInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.invoice = action.payload;
      })
      .addCase(getaInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(createNewInvoice.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(createNewInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createInvoice = action.payload;
        state.message = "";
      })
      .addCase(createNewInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload?.message; // Access error message from payload
      })
      .addCase(deleteInvoice.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.deletedInvoice = action.payload;
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(resetState, () => initialState);
  },
});

export default invoiceSlice.reducer;
