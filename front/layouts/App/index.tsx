import React from 'react';
// 코드 스플리팅을 위한 lib
import loadable from '@loadable/component';
import { Switch, Route, Redirect } from 'react-router-dom';

// Lazy Load
const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Workspace = loadable(() => import('@layouts/Workspace'));

const App = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={LogIn} />
      <Route path="/signup" component={SignUp} />
      {/* 라우터 파라미터 */}
      <Route path="/workspace/:workspace" component={Workspace} />
    </Switch>
  );
};

export default App;

/**
 * Flux(Redux, Zustand)
 * Proxy(Mobx, Valtio)
 * Atomc(Recoil, Jotai)
 */
