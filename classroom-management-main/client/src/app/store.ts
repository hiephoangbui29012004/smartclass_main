import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import authReducer from "../pages/Auth/authSlice";
import classroomReducer from "../pages/Classroom/classroomSlice";
import cameraReducer from "../pages/Camera/cameraSlice";
import actionReducer from "../pages/Action/actionSlice";
import accountReducer from "../pages/Account/accountSlice";
import statisticsReducer from "../pages/Statistics/statisticsSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    classroom: classroomReducer,
    camera: cameraReducer,
    action: actionReducer,
    account: accountReducer,
    statistics: statisticsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
