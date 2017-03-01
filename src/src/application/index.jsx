import React from 'react';
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';
import Layout from '../components/layout';
import Appartments from '../components/appartments';
import Appartment from '../components/appartment';
import Order from '../components/order';
import './styles.sass';

const Application = () => (
  <Router history={browserHistory}>
    <Route path="/" component={Layout}>
      <IndexRedirect to="appartments" />
      <Route path="appartments" component={Appartments} />
      <Route path="appartments/:appartmentId" component={Appartment} />
      <Order path="order/:appartmentId" component={Order} />
    </Route>
  </Router>
);

export default Application;
