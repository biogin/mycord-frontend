import React, { FunctionComponent } from 'react';

interface SidebarTabProps {
  name: string;
  active?: boolean;
  style?: object;
  image?: string;

  onClick?(e: any): void;
}

const SidebarTab: FunctionComponent<SidebarTabProps> = ({ name, onClick, active = true, image }) => {
  return (
      <button
          className={`flex justify-center p-3 items-center ${active && 'text-secondary'}`}
          onClick={onClick}>
        <img src={image} className='w-full md:w-2/3 xl:w-1/3 rounded-full' alt={name}/>
      </button>
  );
};

export default SidebarTab;
