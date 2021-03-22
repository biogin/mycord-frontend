import React from 'react';

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
      <div className={'mx-auto'}>
        <Navbar />
        <Sidebar />
        <div>
          {children}
        </div>
      </div>
  );
};

export default Layout;
