import React from 'react';
import { render } from 'react-dom';
import { StoreProvider } from 'easy-peasy';
import Routes from './Routes';
import './index.global.css';
import { store } from './store/upload';

render(
  <StoreProvider store={store}>
    <Routes />
  </StoreProvider>,
  document.getElementById('root')
);
