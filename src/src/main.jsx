import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Application from './application';

const appNode = document.getElementById('app');

render(
  <AppContainer>
    <Application />
  </AppContainer>,
  appNode);

if (module.hot) {
  module.hot.accept('./application', () => render(
    <AppContainer>
      <Application />
    </AppContainer>,
    appNode));
}
