import React, { useEffect } from 'react';
import { gql } from "@apollo/client";

import { useUsername } from "../../auth/AuthProvider";
import Spinner from "../../../ui/Spinner";
import { Message } from "../../../types/message";

export const MESSAGES_SUBSCRIPTION = gql`
    subscription MessageSent($subscriptionId: ID) {
        messageSent(subscriptionId: $subscriptionId) {
            text,
            authorProfile {
                username,
                imageUrl
            }
        }
    }

`;

interface MessagesProps {
  messages: Array<Message>;
  error: any;
  loading: boolean;
  subscribeToNewMessages(): void
}

function Messages({ messages, loading, error, subscribeToNewMessages }: MessagesProps) {
  const username = useUsername();

  useEffect(() => {
    subscribeToNewMessages();
  }, []);

  messages = messages || [
    {
      text: `Hey, how r u?`,
      authorProfile: {
        username: 'Shlala',
        imageUrl: 'https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png'
      }
    },
    {
      text: `Doing good?`,
      authorProfile: {
        username: 'Shlala',
        imageUrl: 'https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png'
      }
    },
    {
      text: `No response??`,
      authorProfile: {
        username: 'Shlala',
        imageUrl: 'https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png'
      }
    },
    {
      text: `Hey, how r u?`,
      authorProfile: {
        username,
        imageUrl: 'https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png'
      }
    },
    {
      text: `No response??`,
      authorProfile: {
        username: 'Shlala',
        imageUrl: 'https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png'
      }
    },
    {
      text: `No response??`,
      authorProfile: {
        username: 'Shlala',
        imageUrl: 'https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png'
      }
    },
    {
      text: `Hey, how r u?`,
      authorProfile: {
        username,
        imageUrl: 'https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png'
      }
    },
    {
      text: `No response??`,
      authorProfile: {
        username: 'Shlala',
        imageUrl: 'https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png'
      }
    },
    {
      text: `No response??`,
      authorProfile: {
        username: 'Shlala',
        imageUrl: 'https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png'
      }
    },
    {
      text: `Hey, how r u?`,
      authorProfile: {
        username,
        imageUrl: 'https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png'
      }
    },
    {
      text: `No response??`,
      authorProfile: {
        username: 'Shlala',
        imageUrl: 'https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png'
      }
    },
    {
      text: `No response??`,
      authorProfile: {
        username: 'Shlala',
        imageUrl: 'https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png'
      }
    },
    {
      text: `Hey, how r u?`,
      authorProfile: {
        username,
        imageUrl: 'https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png'
      }
    },
    {
      text: `No response??`,
      authorProfile: {
        username: 'Shlala',
        imageUrl: 'https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png'
      }
    },
    {
      text: `No response??`,
      authorProfile: {
        username: 'Shlala',
        imageUrl: 'https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png'
      }
    },

  ];

  return (
      <div className='flex flex-col'>
        <div className='flex justify-center items-center'>
          <Spinner loading={loading}>
            {error && (
                <p className='text-red-400'>Error loading messages. <button
                    className='border-none p-2 bg-transparent text-secondary'>
                  Try again.
                </button>
                </p>
            )}
            {messages && (
                <div className='flex flex-col justify-evenly items-center w-full p-4'>
                  {messages.map(({ text, authorProfile }: Message, i: number) => (
                      <div
                          key={i}
                          className={`flex my-2 space-x-2 w-1/2 ${authorProfile.username === username ? 'self-end justify-end text-right' : 'self-start'}`}>
                        {authorProfile.username !== username &&
                        <div className='w-1/6'>
                            <img src={authorProfile.imageUrl} alt="Profile"/>
                        </div>
                        }
                        <div
                            className={`rounded-xl text-secondary w-full p-2`}>
                          <p className='text-secondary'>
                            {text}
                          </p>
                        </div>
                      </div>
                  ))}
                </div>
            )}
          </Spinner>
        </div>
      </div>
  );
}

export default Messages;
