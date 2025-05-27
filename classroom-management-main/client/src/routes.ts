import React from "react";
const Home = React.lazy(() => import("./pages/Home"));
const RealtimeVideo = React.lazy(() => import("./pages/RealtimeVideo"));
const Classroom = React.lazy(() => import("./pages/Classroom"));
const Camera = React.lazy(() => import("./pages/Camera"));
const Account = React.lazy(() => import("./pages/Account"));
const Action = React.lazy(() => import("./pages/Action"));
const Statistics = React.lazy(() => import("./pages/Statistics"));

const routes: Array<any> = [
  {
    path: "/",
    exact: true,
    component: Home,
  },
  {
    path: "/realtime-video",
    component: RealtimeVideo,
  },
  {
    path: "/admin/classroom",
    component: Classroom,
  },
  {
    path: "/admin/camera",
    component: Camera,
  },
  {
    path: "/admin/action",
    component: Action,
  },
  {
    path: "/admin/account",
    component: Account,
  },
  {
    path: "/statistics",
    component: Statistics,
  },
];
export default routes;
