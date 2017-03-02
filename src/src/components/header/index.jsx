import React from 'react';
import { Link } from 'react-router';

const Header = ({location}) => (
  <div className="b-header">
    <div>
      <Link to="/">Case #1</Link>
      <Link to="/airline">Case #2</Link>
    </div>
    <h1>
      {/^\/airline/.test(location.pathname) ?
        'Case #2: Airline Tickets' :
        'Case #1: Apartment booking'}
    </h1>
  </div>
);

export default Header;
