import React, { Suspense } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { useAppSelector } from "./app/hooks";
import NotFound from "./components/NotFound";
import PrivateRoute from "./hoc/PrivateRoute";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import DashBoard from "./pages/DashBoard/DashBoard";
import CookieService from "./services/CookieService";

import "./theme/App.css";

function App() {
  const token = useAppSelector((state) => state.auth.token);

  return (
    <BrowserRouter>
      <Suspense fallback={<></>}>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
          <PrivateRoute
            path="/"
            component={DashBoard}
            condition={token || CookieService.get("token")}
            redirectPath="/login"
          ></PrivateRoute>
          <Route path="/404" component={NotFound} />
          <Redirect to="/404" />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
