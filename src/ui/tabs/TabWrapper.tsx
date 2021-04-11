import React, { FunctionComponent, ReactNode } from 'react';

export interface TabWrapperProps {
  children: ReactNode;
  label: string;
}

const TabWrapper: FunctionComponent<TabWrapperProps> = ({ children }) => {
  return <>
    <div>
      {children}
    </div>
  </>;
};

export default TabWrapper;
