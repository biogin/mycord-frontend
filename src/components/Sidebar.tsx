import React, { useEffect, useRef, MouseEvent, useState } from 'react';
import { useHistory, useLocation } from "react-router-dom";

import SidebarTab from "./SidebarTab";
import { useLoggedIn, useSignout, useUsername, useUserProfileImage } from "./auth/AuthProvider";
import Button from "../ui/Button";
import { useClickOutside } from "../shared/hooks/useClickOutside";

interface Tab {
  name: string;
  path: string;

  getIcon(url?: string): string;
}

const accountTabs: Array<Tab> = [
  {
    name: 'Home',
    getIcon() {
      return '/icons/homeIcon.svg';
    },
    path: '/'
  },
  {
    name: 'Conversations',
    getIcon() {
      return '/icons/messageIcon.svg';
    },
    path: '/conversations'
  },
  {
    name: 'Profile',
    getIcon(imageUrl: string) {
      return imageUrl;
    },
    path: '/profile'
  }
];

const userTabs = [
  {
    name: 'Discover',
    getIcon() {
      return '/icons/exploreIcon.svg';
    },
    path: '/discover',
  }
];

const Sidebar = () => {
  const userProfileImage = useUserProfileImage() || '';
  const username = useUsername();
  const loggedIn = useLoggedIn();

  const signout = useSignout();

  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const router = useHistory();
  const location = useLocation();

  const container = useRef<HTMLUListElement>(null);
  const accountContainerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => {
    setShowAccountMenu(false);
  });

  useEffect(() => {
    accountContainerRef.current!.style.width = `${container.current?.offsetWidth}px`;

    return () => {
    }
  }, []);

  const handleAccountClick = (e: MouseEvent) => {
    setShowAccountMenu(true);
  }

  return (
      <div className='flex flex-col sticky w-28 top-0 self-start' style={{ height: '90vh' }}>
        <ul ref={container} className='flex flex-col h-full pt-2 w-full max-h-screen md:mt-4 space-y-2 relative'>
          {(loggedIn ? accountTabs : userTabs).map(({ name, getIcon, path }: any) => <SidebarTab
              image={getIcon(userProfileImage)}
              onClick={() => router.push(name === 'Profile' ? `/${username}` : path)}
              active={path === location.pathname}
              key={name} name={name}/>)}
          <div ref={accountContainerRef} onClick={handleAccountClick}
               className={`flex justify-center p-3 items-center fixed bottom-5 cursor-pointer`}>
            <img className='w-full md:w-2/3 xl:w-1/3 rounded-full' src="/icons/userIcon.svg" alt="Account"/>
            {showAccountMenu && <div ref={menuRef} className='flex flex-col rounded-md border-2 border-grey-200 justify-center w-40 py-5 px-3 absolute bottom-full left-1/2 bg-grey-100'>
                <img className='border-b-2 w-1/2 mx-auto mb-5 rounded-full border-grey-200' src={userProfileImage} alt="Profile"/>
                <button className='mb-2 text-white font-light border-2 border-grey-200 p-2 bg-secondary'>
                    Settings
                </button>
                <button onClick={() => signout()} className='border-2 text-white font-light border-grey-200 p-2 bg-secondary z-50'>
                    Logout
                </button>
            </div>
            }
          </div>
        </ul>
      </div>
  );
};

export default Sidebar;
