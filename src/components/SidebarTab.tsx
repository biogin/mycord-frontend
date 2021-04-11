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
          className={`flex w-full sm:m-0 justify-start p-3 lg:justify-end items-center transition transform hover:scale-105 ${active && 'text-secondary'}`}
          onClick={onClick}>
        <img src={image} className='w-1/6 mx-auto sm:w-1/6 sm:m-0 rounded-full ml-auto' alt={name}/>
        <h3 className='font-medium text-left ml-5 text-xl w-2/3 hidden lg:block'>{name}</h3>
      </button>
  );
};

export default SidebarTab;
