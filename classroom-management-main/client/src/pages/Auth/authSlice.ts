import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import CookieService from "../../services/CookieService";
import authService from "./authService";

export const login = createAsyncThunk(
  "auth/login",
  // if you type your function argument here
  async (account: any) => {
    const response = await authService.login(account);
    return response.data;
  }
);
export const signup = createAsyncThunk(
  "auth/signup",
  // if you type your function argument here
  async (account: any) => {
    const response = await authService.register(account);
    return response.data;
  }
);

interface AuthState {
  token: string | any;
  role: number | string | any;
  isError: boolean;
  message: string;
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  token: CookieService.get("token"),
  role: CookieService.get("role"),
  loading: "idle",
  isError: false,
  message: "",
} as AuthState;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // fill in primary logic here
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state, action) => {
      state.loading = "pending";
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.isError = false;
      state.token = action.payload.access_token;
      state.role = action.payload.role;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = "failed";
      state.isError = true;
      state.token = null;
    });
    builder.addCase(signup.pending, (state, action) => {
      state.loading = "pending";
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.isError = false;
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.loading = "failed";
      state.isError = true;
    });
  },
});

export default authSlice.reducer;
