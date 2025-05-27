import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountService from "./accountService";

export const getAllAccount = createAsyncThunk(
  "account/getAllAccount",
  // if you type your function argument here
  async () => {
    const response = await accountService.getAllAccount();
    return response.data;
  }
);
export const updateAccount = createAsyncThunk(
  "account/updateAccount",
  // if you type your function argument here
  async (payload: any) => {
    const response = await accountService.updateAccount(
      payload.id,
      payload.data
    );
    return response.data;
  }
);

export const deleteAccount = createAsyncThunk(
  "account/deleteAccount",
  // if you type your function argument here
  async (payload: any) => {
    const response = await accountService.deleteAccount(payload);
    return response.data;
  }
);

export const addAccount = createAsyncThunk(
  "account/addAccount",
  // if you type your function argument here
  async (payload: any) => {
    const response = await accountService.addAccount(payload);
    return response.data;
  }
);

export const resetPassword = createAsyncThunk(
  "account/resetPassword",
  // if you type your function argument here
  async (payload: any) => {
    const response = await accountService.resetPassword(payload);
    return response.data;
  }
);
export const importAccount = createAsyncThunk(
  "account/importAccount",
  // if you type your function argument here
  async (payload: any) => {
    const response = await accountService.importAccount(payload);
    return response.data;
  }
);

interface AccountState {
  data: Array<object> | any;
  message: string;
  loading: "idle" | "pending" | "succeeded" | "failed";
  modalType: "add" | "edit";
  modalOpen: boolean;
  snackbarOpen: boolean;
}

const initialState = {
  data: [],
  loading: "idle",
  modalType: "add",
  modalOpen: false,
  snackbarOpen: false,
} as AccountState;

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setModalType: (state, action) => {
      state.modalType = action.payload;
      state.modalOpen = true;
    },
    closeModal: (state) => {
      state.modalOpen = false;
    },
    setSnackbarOpen: (state, action) => {
      state.snackbarOpen = action.payload;
    },
    // fill in primary logic here
  },
  extraReducers: (builder) => {
    builder.addCase(getAllAccount.pending, (state, action) => {
      state.loading = "pending";
    });
    builder.addCase(getAllAccount.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.data = action.payload.data;
    });
    builder.addCase(getAllAccount.rejected, (state, action) => {
      state.loading = "failed";
    });
    builder.addCase(updateAccount.fulfilled, (state, action) => {
      state.loading = "succeeded";
    });
    builder.addCase(updateAccount.rejected, (state, action) => {
      state.loading = "failed";
    });
    builder.addCase(deleteAccount.fulfilled, (state, action) => {
      state.loading = "succeeded";
    });
    builder.addCase(deleteAccount.rejected, (state, action) => {
      state.loading = "failed";
    });
    builder.addCase(addAccount.fulfilled, (state, action) => {
      state.loading = "succeeded";
    });
    builder.addCase(addAccount.rejected, (state, action) => {
      state.loading = "failed";
    });
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.loading = "succeeded";
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.loading = "failed";
    });
    builder.addCase(importAccount.fulfilled, (state, action) => {
      state.loading = "succeeded";
    });
    builder.addCase(importAccount.rejected, (state, action) => {
      state.loading = "failed";
    });
  },
});

export default accountSlice.reducer;
export const { setModalType, closeModal, setSnackbarOpen } =
  accountSlice.actions;
