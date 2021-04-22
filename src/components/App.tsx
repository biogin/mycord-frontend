import React, { useEffect } from 'react';
import { Switch, Route, useLocation, useHistory } from "react-router-dom";
import Modal from "react-modal";
import './App.css';

import Login from "./auth/Login";
import Signup from "./auth/Signup";
import { PrivateRoute } from "../shared/PrivateRoute";

import UnauthorizedHome from "./UnauthorizedHome";
import Explore from "./Explore";
import Search from "./Search";
import Home from "./home/Home";
import PublicRoute from "../shared/PublicRoute";
import Profile from "./profile/Profile";
import UserPage from "./home/components/UserPage";
import ProfileEdit from "./profile/components/ProfileEdit";
import Conversations from "./conversations/Conversations";
import ConversationsProvider from "./conversations/ConversationsProvider";

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

  useEffect(() => {
  }, []);

  return (
      <>
        <Switch location={background || location}>
          <Route path='/discover' exact>
            <Explore/>
          </Route>
          <Route path='/search' exact>
            <Search/>
          </Route>
          <PublicRoute restricted={true} path='/login' exact component={Login}/>
          <PrivateRoute path='/' exact redirect={UnauthorizedHome} component={Home}/>
          <PrivateRoute path='/profile' exact component={Profile}/>
          <PrivateRoute path='/conversations' exact>
            <ConversationsProvider>
              <Conversations />
            </ConversationsProvider>
          </PrivateRoute>
          <Route path='/:username' exact>
            <ConversationsProvider>
              <UserPage/>
            </ConversationsProvider>
          </Route>
          <Route>
            404
          </Route>
        </Switch>

        <Route path='/signup'>
          <Modal
              isOpen={true}
              style={customStyles}
              onRequestClose={() => history.goBack()}
              contentLabel="Signup"
              appElement={document.getElementById('root')!}
          >
            <Signup/>
          </Modal>
        </Route>

        <Route path='/profile/edit'>
          <Modal
              isOpen={true}
              style={customStyles}
              onRequestClose={() => history.goBack()}
              contentLabel="Edit profile"
              appElement={document.getElementById('root')!}
          >
            <ProfileEdit/>
          </Modal>
        </Route>
      </>
  );
}

export default App;
