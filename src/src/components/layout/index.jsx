import React from 'react';
import Header from '../header';

const Layout = ({children}) => (
  <div className="b-layout">
    <Header />
    <div>
      {children}
    </div>
  </div>
);

export default Layout;
