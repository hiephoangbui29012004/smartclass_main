import * as React from "react";
import { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import NotFound from "../../components/NotFound";
import HomeLayout from "../../layouts/HomeLayout";
import routes from "../../routes";

export interface IDashBoardProps {}

export default function DashBoard(props: IDashBoardProps) {
  return (
    <HomeLayout>
      <Suspense fallback={<></>}>
        <Switch>
          {routes.map((route, idx) => {
            return (
              <Route
                key={idx}
                path={route.path}
                component={route.component}
                exact={route.exact}
              />
            );
          })}
          <Route path="/404" component={NotFound} />
          <Redirect to="/404" />
        </Switch>
      </Suspense>
    </HomeLayout>
  );
}
