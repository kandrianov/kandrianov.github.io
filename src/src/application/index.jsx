import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Layout from '../components/layout';
import Appartments from '../components/appartments';
import Appartment from '../components/appartment';
import Order from '../components/order';
import Airline from '../components/airline';
import AirlineOrder from '../components/airlineOrder';
import './styles.sass';

const Application = () => (
  <Router history={browserHistory}>
    <Route path="/" component={Layout}>
      <IndexRoute component={Appartments} />
      <Route path="appartments/:appartmentId" component={Appartment} />
      <Route path="order/:appartmentId" component={Order} />
      <Route path="airline" component={Airline} />
      <Route path="airline/order" component={AirlineOrder} />
    </Route>
  </Router>
);

export default Application;
