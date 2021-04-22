import React from 'react';
import { gql } from "@apollo/client";

import { useUsername } from "../../auth/AuthProvider";
import { Message } from "../../../types/message";
import { useHistory } from "react-router-dom";

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
  messages?: Array<Message>;
  error: any;
  loading: boolean;
}

function Messages({ messages, loading, error }: MessagesProps) {
  const username = useUsername();

  const history = useHistory();

  return (
      <div className='flex flex-col'>
        <div className='flex justify-center items-center'>
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
                        className={`flex items-center p-1 my-2 space-x-2 w-1/2 ${authorProfile.username === username ? 'self-end justify-end text-right' : 'self-start'}`}>
                      {authorProfile.username !== username &&
                        <div className='w-1/6'>
                            <img onClick={() => history.push(`/${authorProfile.username}`)} className='rounded-full cursor-pointer' src={authorProfile.imageUrl} alt="Profile"/>
                        </div>
                      }
                      <div
                          className={`rounded-xl w-full p-2`}>
                        <p className='text-black-100 font-light'>
                          {text}
                        </p>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>
      </div>
  );
}

export default Messages;
