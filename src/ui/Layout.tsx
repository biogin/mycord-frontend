import React from 'react';
import { useMutation, gql } from "@apollo/client";
import { useHistory } from "react-router-dom";

import Topbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Button from "./Button";

export enum ContentWidth {
  OneFourth = '1/4',
  ThreeFourth = '3/4',
  Half = '1/2',
  Full = 'full'
}

interface Props {
  children: React.ReactNode;
  topbar?: boolean;
  mainContentWidth?: ContentWidth;
}

const Layout = ({ children, topbar = false, mainContentWidth = ContentWidth.Half }: Props) => {
    const [signout, { error }] = useMutation(gql`
        mutation SignoutMain{
            signout{
                email
            }
        }
    `);

  const router = useHistory();

  return (
      <div className='w-full h-full overflow-scroll'>
        <div className='flex flex-col w-full justify-start items-center mx-auto h-full'>
          <Topbar/>
          <div className='flex h-full w-full'>
            <Sidebar/>
            <div className={`bg-white w-full sm:w-1/2 ${mainContentWidth && `sm:w-${mainContentWidth}`} border-l-2 border-r-2 border-grey-200`}>
              {children}
            </div>
            <div className='flex-1'>
              <Button click={async () => {
                await signout();

                router.push('/');

                window.location.reload();
              }}>
                Signout
              </Button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Layout;
