import React from 'react';
import { Switch, Route, useLocation, useHistory } from "react-router-dom";
import Modal from "react-modal";

import './App.css';

import Login from "./auth/Login";
import Signup from "./auth/Signup";
import { PrivateRoute } from "../shared/PrivateRoute";

import UnauthorizedHome from "./UnauthorizedHome";
import Explore from "./Explore";
import Search from "./Search";
import Home from "./Home";
import PublicRoute from "../shared/PublicRoute";

function MyCordApp() {
  return (
      <h1>Hello application</h1>
  );
}

const customStyles = {
  content: {
    top: '50%',
    height: 'auto',
    width: '30%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)'
  }
};

function App() {
  const location = useLocation();
  const background = location.state && (location.state as any).background;

  const history = useHistory();

  return (
      <>
        <Switch location={background || location}>
          <Route path='/explore' exact>
            <Explore/>
          </Route>
          <Route path='/search' exact>
            <Search/>
          </Route>
          <PublicRoute restricted={true} path='/login' exact component={Login} />
          <PrivateRoute path='/' exact redirect={UnauthorizedHome} component={Home}/>
          <PrivateRoute path='/app' exact component={MyCordApp}/>
          <Route>
            404
          </Route>
        </Switch>

        <Route path='/signup'>
          <Modal
              isOpen={true}
              style={customStyles}
              onRequestClose={() => history.goBack()}
              contentLabel="Signup modal"
              appElement={document.getElementById('root')!}
          >
            <Signup/>
          </Modal>
        </Route>
      </>
  )
      ;
}

export default App;
