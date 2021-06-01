import React from 'react';

import Topbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export enum ContentWidth {
  OneFourth = '1/4',
  ThreeFourth = '3/4',
  Half = '1/2',
  Full = 'full'
}

interface Props {
  children: React.ReactNode;
  mainContentWidth?: ContentWidth;
}

const Layout = ({ children, mainContentWidth = ContentWidth.Half }: Props) => {
  return (
      <div className='w-full h-full'>
        <div className='flex flex-col w-full h-full justify-start items-center mx-auto'>
          <Topbar/>
          <div className='flex h-full w-full'>
            <Sidebar/>
            <div className={`bg-grey-100 w-full sm:w-1/2 z-10 ${mainContentWidth && `sm:w-${mainContentWidth}`} border-l-2 border-r-2 border-grey-200`}>
              {children}
            </div>
            <div>
              shit
            </div>
          </div>
        </div>
      </div>
  );
};

export default Layout;
