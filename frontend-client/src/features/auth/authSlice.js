import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import authService from "./authServices";

const getUserfromLocalStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;
const initialState = {
  user: getUserfromLocalStorage,
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};
export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      return await authService.login(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const register = createAsyncThunk(
  "auth/register",
  async (values, thunkAPI) => {
    try {
      return await authService.register(values);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getallClients = createAsyncThunk(
  "user/get-user",
  async (thunkAPI) => {
    try {
      return await authService.getAllClient();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const getaClient = createAsyncThunk(
  "user/geta-user",
  async (username, thunkAPI) => {
    try {
      return await authService.getClient(username);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const logOutUser = createAsyncThunk(
  "user/logout",
  async (_, thunkAPI) => {
    try {
      await authService.logOut();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const resetState = createAction("Reset_all");


export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isSuccess = true;
        state.message = "success";
        state.isLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.isError = true;
        state.message = action.error.message;
        state.isLoading = false;
      })
  
      // Handle register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        // state.newuser = action.payload;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.isError = true;
        state.message = action.error.message;
        state.isLoading = false;
      })
  
      // Handle getallClients
      .addCase(getallClients.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(getallClients.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isSuccess = true;
        state.message = "success";
        state.isLoading = false;
      })
      .addCase(getallClients.rejected, (state, action) => {
        state.isError = true;
        state.message = action.error.message;
        state.isLoading = false;
      })
  
      // Handle getaClient
      .addCase(getaClient.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(getaClient.fulfilled, (state, action) => {
        state.orderbyuser = action.payload;
        state.isSuccess = true;
        state.message = "success";
        state.isLoading = false;
      })
      .addCase(getaClient.rejected, (state, action) => {
        state.isError = true;
        state.message = action.error.message;
        state.isLoading = false;
      })
  
      // Handle logOutUser
      .addCase(logOutUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(logOutUser.fulfilled, (state) => {
        // Clear user data from local storage
        localStorage.removeItem("user");
        state.isSuccess = true;
        state.message = "success";
        state.isLoading = false;
        state.user = null; // Set user to null
      })
      .addCase(logOutUser.rejected, (state, action) => {
        state.isError = true;
        state.message = action.error.message;
        state.isLoading = false;
      })
  
      // Handle resetState
      .addCase(resetState, () => initialState);
  },
  
});

export default authSlice.reducer;
