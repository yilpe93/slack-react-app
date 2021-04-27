import React from 'react';
// 코드 스플리팅을 위한 lib
import loadable from '@loadable/component';
import { Switch, Route, Redirect } from 'react-router-dom';

// Lazy Load
const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Channel = loadable(() => import('@pages/Channel'));

const App = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={LogIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/workspace/channel" component={Channel} />
    </Switch>
  );
};

export default App;

/**
 * Flux(Redux, Zustand)
 * Proxy(Mobx, Valtio)
 * Atomc(Recoil, Jotai)
 */
