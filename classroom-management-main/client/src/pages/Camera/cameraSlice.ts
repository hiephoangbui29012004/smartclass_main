import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import cameraService from "./cameraService";

export const getAllCamera = createAsyncThunk(
  "camera/getAllCamera",
  // if you type your function argument here
  async () => {
    const response = await cameraService.getAllCamera();
    return response.data;
  }
);
export const updateCamera = createAsyncThunk(
  "camera/updateCamera",
  // if you type your function argument here
  async (payload: any) => {
    const response = await cameraService.updateCamera(payload.id, payload.data);
    return response.data;
  }
);
export const deleteCamera = createAsyncThunk(
  "camera/deleteCamera",
  // if you type your function argument here
  async (payload: any) => {
    const response = await cameraService.deleteCamera(payload);
    return response.data;
  }
);
export const addCamera = createAsyncThunk(
  "camera/addRoom",
  // if you type your function argument here
  async (payload: any) => {
    const response = await cameraService.addCamera(payload);
    return response.data;
  }
);

export const importCamera = createAsyncThunk(
  "camera/importCamera",
  // if you type your function argument here
  async (payload: any) => {
    const response = await cameraService.importCamera(payload);
    return response.data;
  }
);
interface CameraState {
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
} as CameraState;

const cameraSlice = createSlice({
  name: "camera",
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
    builder.addCase(getAllCamera.pending, (state, action) => {
      state.loading = "pending";
    });
    builder.addCase(getAllCamera.fulfilled, (state, action) => {
      console.log("Camera payload", action.payload);
      state.loading = "succeeded";
      state.data = action.payload;
    });
    builder.addCase(getAllCamera.rejected, (state, action) => {
      state.loading = "failed";
    });
    // builder.addCase(updateRoom.pending, (state, action) => {
    //   state.loading = "pending";
    // });
    builder.addCase(updateCamera.fulfilled, (state, action) => {
      state.loading = "succeeded";
    });
    builder.addCase(updateCamera.rejected, (state, action) => {
      state.loading = "failed";
    });
    builder.addCase(deleteCamera.fulfilled, (state, action) => {
      state.loading = "succeeded";
    });
    builder.addCase(deleteCamera.rejected, (state, action) => {
      state.loading = "failed";
    });
    builder.addCase(addCamera.fulfilled, (state, action) => {
      state.loading = "succeeded";
    });
    builder.addCase(addCamera.rejected, (state, action) => {
      state.loading = "failed";
    });
    builder.addCase(importCamera.fulfilled, (state, action) => {
      state.loading = "succeeded";
    });
    builder.addCase(importCamera.rejected, (state, action) => {
      state.loading = "failed";
    });
  },
});

export default cameraSlice.reducer;
export const { setModalType, closeModal, setSnackbarOpen } =
  cameraSlice.actions;
