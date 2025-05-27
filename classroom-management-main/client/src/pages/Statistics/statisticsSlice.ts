import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import statisticsService from "./statisticsService";

export const getStatistics = createAsyncThunk(
  "statistics/getStatistics",
  async (payload: any) => {
    const response = await statisticsService.getStatistics(payload);
    return response.data;
  }
);
export const drawChart = createAsyncThunk(
  "statistics/drawChart",
  async (payload: any) => {
    const response = await statisticsService.drawChart(payload);
    return response.data;
  }
);
export const downloadImage = createAsyncThunk(
  "statistics/downloadImage",
  async (id: any) => {
    const response = await statisticsService.downloadImage(id);
    return response;
  }
);
export const exportExcel = createAsyncThunk(
  "statistics/exportExcel",
  async (payload: any) => {
    const response = await statisticsService.exportExcel(payload);
    return response;
  }
);

interface StatisticsState {
  data: any;
  chart: any;
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  data: null,
  chart: null,
  loading: "idle",
} as StatisticsState;

const statisticsSlice = createSlice({
  name: "statistics",
  initialState,
  reducers: {
    resetStatistics: (state) => {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getStatistics.pending, (state, action) => {
      state.loading = "pending";
    });
    builder.addCase(getStatistics.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.data = action.payload.data;
    });
    builder.addCase(getStatistics.rejected, (state, action) => {
      state.loading = "failed";
    });
    builder.addCase(drawChart.pending, (state, action) => {
      state.loading = "pending";
    });
    builder.addCase(drawChart.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.chart = action.payload.data;
    });
    builder.addCase(drawChart.rejected, (state, action) => {
      state.loading = "failed";
    });
    builder.addCase(downloadImage.fulfilled, (state, action) => {
      state.loading = "succeeded";
    });
    builder.addCase(downloadImage.rejected, (state, action) => {
      state.loading = "failed";
    });
    builder.addCase(exportExcel.fulfilled, (state, action) => {
      state.loading = "succeeded";
    });
    builder.addCase(exportExcel.rejected, (state, action) => {
      state.loading = "failed";
    });
  },
});

export default statisticsSlice.reducer;
export const { resetStatistics } = statisticsSlice.actions;
