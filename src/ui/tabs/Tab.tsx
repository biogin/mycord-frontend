import React, { FunctionComponent } from 'react';

export interface TabProps {
  label: string;
  activeTab: string;

  onClick(label: string): void;
}

const Tab: FunctionComponent<TabProps> = ({ label, onClick, activeTab }) => {
  return (
      <div onClick={() => onClick(label)} className={`p-3 flex-1 cursor-pointer text-center border-b-2 hover:border-secondary ${activeTab === label ? 'border-secondary' : 'border-grey-200'}`}>
        {label}
      </div>
  );
};

export default Tab;
