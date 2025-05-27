import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import classroomService from "./classroomService";

export const getAllRoom = createAsyncThunk("classroom/getAllRoom", async () => {
  const response = await classroomService.getAllRoom();
  return response.data;
});
export const updateRoom = createAsyncThunk(
  "classroom/updateRoom",
  async (payload: any) => {
    const response = await classroomService.updateRoom(
      payload.id,
      payload.data
    );
    return response.data;
  }
);
export const deleteRoom = createAsyncThunk(
  "classroom/deleteRoom",
  async (payload: any) => {
    const response = await classroomService.deleteRoom(payload);
    return response.data;
  }
);
export const addRoom = createAsyncThunk(
  "classroom/addRoom",
  async (payload: any) => {
    const response = await classroomService.addRoom(payload);
    return response.data;
  }
);
export const importRoom = createAsyncThunk(
  "room/importRoom",
  // if you type your function argument here
  async (payload: any) => {
    const response = await classroomService.importRoom(payload);
    return response.data;
  }
);
interface ClassroomState {
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
} as ClassroomState;

const classroomSlice = createSlice({
  name: "classroom",
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
    builder.addCase(getAllRoom.pending, (state, action) => {
      state.loading = "pending";
    });
    builder.addCase(getAllRoom.fulfilled, (state, action) => {
      console.log("getAllRoom success:", action.payload);
      state.loading = "succeeded";
      state.data = action.payload?.data || [];
    });
    builder.addCase(getAllRoom.rejected, (state, action) => {
      state.loading = "failed";
    });
    builder.addCase(updateRoom.pending, (state, action) => {
      state.loading = "pending";
    });
    builder.addCase(updateRoom.fulfilled, (state, action) => {
      state.loading = "succeeded";
    });
    builder.addCase(updateRoom.rejected, (state, action) => {
      state.loading = "failed";
    });
    builder.addCase(deleteRoom.fulfilled, (state, action) => {
      state.loading = "succeeded";
    });
    builder.addCase(deleteRoom.rejected, (state, action) => {
      state.loading = "failed";
    });
    builder.addCase(addRoom.fulfilled, (state, action) => {
      state.loading = "succeeded";
    });
    builder.addCase(addRoom.rejected, (state, action) => {
      state.loading = "failed";
    });
    builder.addCase(importRoom.fulfilled, (state, action) => {
      state.loading = "succeeded";
    });
    builder.addCase(importRoom.rejected, (state, action) => {
      state.loading = "failed";
    });
  },
});

export default classroomSlice.reducer;
export const { setModalType, closeModal, setSnackbarOpen } =
  classroomSlice.actions;
