import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import actionService from "./actionService";

export const getAllAction = createAsyncThunk(
  "action/getAllAction",
  async () => {
    const response = await actionService.getAllAction();
    return response.data;
  }
);
export const updateAction = createAsyncThunk(
  "action/updateAction",
  async (payload: any) => {
    const response = await actionService.updateAction(payload.id, payload.data);
    return response.data;
  }
);
export const deleteAction = createAsyncThunk(
  "action/deleteAction",
  async (payload: any) => {
    const response = await actionService.deleteAction(payload);
    return response.data;
  }
);
export const addAction = createAsyncThunk(
  "action/addAction",
  async (payload: any) => {
    const response = await actionService.addAction(payload);
    return response.data;
  }
);

interface ActionState {
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
} as ActionState;

export const importAction = createAsyncThunk(
  "action/importAction",
  // if you type your function argument here
  async (payload: any) => {
    const response = await actionService.importAction(payload);
    return response.data;
  }
);

const actionSlice = createSlice({
  name: "action",
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
  },
  extraReducers: (builder) => {
    builder.addCase(getAllAction.pending, (state, action) => {
      state.loading = "pending";
    });
    builder.addCase(getAllAction.fulfilled, (state, action) => {
      console.log("Action data (final):", action.payload);
      state.loading = "succeeded";
      state.data = action.payload?.data || [];
    });
    builder.addCase(getAllAction.rejected, (state, action) => {
      state.loading = "failed";
    });
    builder.addCase(updateAction.pending, (state, action) => {
      state.loading = "pending";
    });
    builder.addCase(updateAction.fulfilled, (state, action) => {
      state.loading = "succeeded";
    });
    builder.addCase(updateAction.rejected, (state, action) => {
      state.loading = "failed";
    });
    builder.addCase(deleteAction.fulfilled, (state, action) => {
      state.loading = "succeeded";
    });
    builder.addCase(deleteAction.rejected, (state, action) => {
      state.loading = "failed";
    });
    builder.addCase(addAction.fulfilled, (state, action) => {
      state.loading = "succeeded";
    });
    builder.addCase(addAction.rejected, (state, action) => {
      state.loading = "failed";
    });
    builder.addCase(importAction.fulfilled, (state, action) => {
      state.loading = "succeeded";
    });
    builder.addCase(importAction.rejected, (state, action) => {
      state.loading = "failed";
    });
  },
});

export default actionSlice.reducer;
export const { setModalType, closeModal, setSnackbarOpen } =
  actionSlice.actions;
