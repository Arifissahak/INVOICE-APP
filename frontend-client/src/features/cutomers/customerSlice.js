import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import customerService from "./customerService";

export const getallClients = createAsyncThunk(
  "clients/get-clients",
  async (thunkAPI) => {
    try {
      return await customerService.getAllClients();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createNewClient = createAsyncThunk(
  "client/create-client",
  async (clntData, thunkAPI) => {
    try {
      return await customerService.createClient(clntData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getaClient = createAsyncThunk(
  "client/geta-client",
  async (username, thunkAPI) => {
    try {
      return await customerService.getAClient(username);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// export const selectClient = (clientId) => {
//   return { type: 'client/selected', payload: clientId };
// };
export const selectClient = createAsyncThunk(
  'client/selected',
  async (clientId, thunkAPI) => {
    try {
      return {clientId };
    }catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
)
export const deleteClient = createAsyncThunk(
  "clients/delete-client",
  async (clientId, thunkAPI) => {
    try {
      await customerService.deleteClient(clientId);
      return clientId; // Return the deleted client ID on success
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetState = createAction("Reset_all");

const initialState = {
  clients: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const clientSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getallClients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getallClients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.clients = action.payload;
      })
      .addCase(getallClients.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getaClient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getaClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.clients = action.payload;
      })
      .addCase(getaClient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(createNewClient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createClients = action.payload;
      })
      .addCase(createNewClient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(selectClient.fulfilled, (state, action) => {
        state.selectedClient =  action.payload.clientId;
      })
      .addCase(deleteClient.pending, (state) => {
        state.isLoading = true;
        state.isError = false; // Reset error flag
        state.isSuccess = false; // Reset success flag
    })
    .addCase(deleteClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.deletedClient = action.payload;
    })
    .addCase(deleteClient.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.message = action.payload.message; // Store only the error message
  })
  
    
      .addCase(resetState, () => initialState);
  },
});

export default clientSlice.reducer;
