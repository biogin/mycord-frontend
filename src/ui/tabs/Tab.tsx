import React, { FunctionComponent } from 'react';

export interface TabProps {
  label: string;
  activeTab: string;

  onClick(label: string): void;
}

const Tab: FunctionComponent<TabProps> = ({ label, onClick, activeTab }) => {
  return (
      <div onClick={() => onClick(label)} className={`p-2 flex-1 cursor-pointer text-center ${activeTab === label && 'border-b-2 border-secondary'}`}>
        {label}
      </div>
  );
};

export default Tab;
