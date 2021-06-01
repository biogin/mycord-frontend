import React, { FunctionComponent } from 'react';
import Player from "../../../ui/Player";

interface PostProps {
  audioUrl: string;
  title: string;
  likesCount?: number;
  profileImageUrl: string;
  createdAt: Date;
}

const Post: FunctionComponent<PostProps> = ({ audioUrl, title, likesCount, profileImageUrl, createdAt }) => {
  return (
      <div className='flex shadow-sm flex shadow-lg lg:flex-row justify-between items-center p-5 my-5 mx-8 rounded-xl bg-white rounded-3xl'>
        <div className="flex flex-col justify-between items-start w-20">
          <img className='rounded-full w-3/4' src={profileImageUrl} alt="User"/>
          <div className='flex text-muted items-center w-1/4'>
            <img src='/icons/messageIcon.svg' className='w-1/4' alt='Post comments'/>
          </div>
        </div>
        <div className='flex flex-col ml-4'>
          <div className='flex'>
            <h1 className='font-bold'>{title}</h1>
            <p className='text-muted ml-4'>{new Date(+createdAt).getDate()}</p>
          </div>
          <div className='flex flex-col'>
            <Player url={audioUrl} />
          </div>
        </div>
      </div>
  );
}

export default Post;
