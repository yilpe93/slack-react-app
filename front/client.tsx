import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from 'react-dom';

import App from '@layouts/App';

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector('#app'),
);
