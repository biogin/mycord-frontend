import React from 'react';
import { useHistory, useLocation } from "react-router-dom";

import SidebarTab from "./SidebarTab";
import { useLoggedIn, useUsername, useUserProfileImage } from "./auth/AuthProvider";

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

  const router = useHistory();
  const location = useLocation();

  return (
      <div className='flex flex-col sticky w-28'>
        <ul className='flex flex-col pt-2 w-full max-h-screen md:mt-4 space-y-2'>
          {(loggedIn ? accountTabs : userTabs).map(({ name, getIcon, path }: any) => <SidebarTab
              image={getIcon(userProfileImage)}
              onClick={() => router.push(name === 'Profile' ? `/${username}` : path)}
              active={path === location.pathname}
              key={name} name={name}/>)}
        </ul>
      </div>
  );
};

export default Sidebar;
