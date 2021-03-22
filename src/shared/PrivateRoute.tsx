import React from "react";
import { Route, Redirect, RouteProps } from 'react-router-dom';

import { useLoggedIn } from "../components/auth/AuthProvider";

export type PrivateRouteProps = RouteProps & {
  component: any;
  redirect?: any;
};

export function PrivateRoute({ component: Component, redirect: RedirectComponent, ...rest }: PrivateRouteProps) {
  const loggedIn = useLoggedIn();

  return (
      <Route {...rest} render={props => (
          loggedIn ?
              <Component {...props} />
              : RedirectComponent ? <RedirectComponent /> : <Redirect to='/login'/>
      )}/>)
}
