import * as React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

interface PrivateRouteProps extends RouteProps {
  component: any;
  condition: boolean;
  redirectPath: string;
}

const PrivateRoute = (props: PrivateRouteProps) => {
  const { component: Component, condition, redirectPath, ...rest } = props;

  return (
    <Route
      {...rest}
      render={(routeProps) =>
        condition ? (
          <Component {...routeProps} />
        ) : (
          <Redirect
            to={{
              pathname: redirectPath,
              state: { from: routeProps.location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
