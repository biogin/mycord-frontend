import React, { FunctionComponent } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

import { useLoggedIn } from "../components/auth/AuthProvider";

export type PublicRouteProps = RouteProps & {
  component: any;
  restricted: boolean;
};

const PublicRoute: FunctionComponent<PublicRouteProps> = ({ component: Component, restricted, ...rest }) => {
  const loggedIn = useLoggedIn();

  return (
      <Route {...rest} render={props => (
          loggedIn && restricted ?
              <Redirect to='/' />
              : <Component {...props} />
      )}/>
  );
};

export default PublicRoute;
