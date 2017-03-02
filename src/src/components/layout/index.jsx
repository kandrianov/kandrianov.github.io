import React from 'react';
import Header from '../header';

const Layout = ({children, location }) => (
  <div className="b-layout">
    <Header location={location} />
    <div>
      {children}
    </div>
  </div>
);

export default Layout;
