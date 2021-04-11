import React, { FunctionComponent } from 'react';
import Player from "../../ui/Player";

interface PostProps {
  audioUrl: string;
  description: string;
  title: string;
  likesCount?: number;
  profileImageUrl: string;
  createdAt: Date;
}

const Post: FunctionComponent<PostProps> = ({ audioUrl, description, title, likesCount, profileImageUrl, createdAt }) => {
  return (
      <div className='flex p-4 shadow-sm'>
        <div className="flex flex-col justify-between items-start w-20">
          <img className='rounded-full max-w-full' src={profileImageUrl} alt="User"/>
          <div className='flex text-muted items-center w-1/4'>
            <img src='/icons/messageIcon.svg' className='w-1/3' alt='Post comments'/>
            5000
          </div>
        </div>
        <div className='flex flex-col ml-4'>
          <div className='flex'>
            <h1 className='font-bold'>{title}</h1>
            <p className='text-muted ml-4'>{new Date(+createdAt).getUTCFullYear()} | now</p>
          </div>
          <div className='flex flex-col'>
            <p className='text-grey-300 font-light'>{description}</p>
            <Player url={audioUrl} />
          </div>
        </div>
      </div>
  );
}

export default Post;
