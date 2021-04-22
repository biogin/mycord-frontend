import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useForm } from "react-hook-form";

import Messages from "./Messages";
import { Profile } from "../../../types/profile";
import { ConversationStatus } from "../../../types/conversation-status";
import { Message } from "../../../types/message";
import { useSendMessage } from "../ConversationsProvider";
import { useRefCallback } from "../../../shared/hooks/useRefCallback";
import { ApolloError } from "@apollo/client";
import { Conversation as IConversation } from "../../../types/conversation";

interface ConversationProps {
  id: number;
  active: boolean;
  user: {
    id: number;
    profile: Profile;
  };
  status: ConversationStatus;
  lastMessage: Message;

  subscribeToNewMessages(): undefined | (() => void);

  fetchConversation: Function;

  conversationData: {
    loading: boolean;
    error?: ApolloError;
    data?: {
      conversation?: IConversation;
    };
  }

  containerWidths: {
    messages: string;
    conversation: string;
  };

  setActiveConversationId(id?: number): void;
}

const Conversation = ({
                        id,
                        active,
                        setActiveConversationId,
                        containerWidths: { messages, conversation },
                        status,
                        user,
                        lastMessage,
                        subscribeToNewMessages,
                        fetchConversation,
                        conversationData: { loading, error, data }
                      }: ConversationProps) => {
  const [ref, refCallback] = useRefCallback();

  const updateScroll = () => {
    if (ref.current) {
      ref.current.scrollTo(0, ref.current.scrollHeight);
    }
  }

  useEffect(() => {
    fetchConversation({ variables: { conversationId: id } });

  }, [fetchConversation, id]);

  useLayoutEffect(() => {
    const unsubscribe = subscribeToNewMessages?.();

    return () => {
      unsubscribe?.();
    };
  });

  const { sendMessage } = useSendMessage();

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (ref.current) {
      updateScroll();
    }
  }, [ref, lastMessage]);

  const onMessageSent = async ({ message }: any) => {
    try {
      await sendMessage(user.id, message);
    } catch (error) {
      console.log(JSON.stringify(error, null, 4));
    }

    setValue('message', '');
  };

  return (
      <div
          className={`flex flex-row`}>
        <div onClick={() => setActiveConversationId(id)}
             className={`flex justify-between items-center bg-white rounded shadow-md hover:shadow-lg p-3 cursor-pointer w-full h-1/3 ${active && 'border-r-4 border-secondary'}`}
             style={{ ...(conversation && { width: conversation }) }}
        >
          <div className='flex flex-col justify-center items-start w-1/12'>
            <img className='w-full rounded-full'
                 src={user.profile.imageUrl || '/profilePlaceholder.png'} alt="Profile"/>
          </div>
          <div className='flex flex-col items-start w-11/12 ml-4'>
            <p className={`text-center text-xl text-secondary`}>{user.profile.username}</p>
            <p className={`w-1/2 font-thin`}>
              {lastMessage?.text}
            </p>
          </div>
        </div>
        {
          active && <div
              className='flex flex-col justify-between absolute right-0 top-0 transform ml-auto bg-white'
              style={{ height: '85vh', ...(messages && { width: messages }) }}>
              <div
                  ref={refCallback}
                  className='h-full overflow-scroll'>
                  <Messages
                      error={error}
                      loading={loading}
                      messages={data?.conversation?.messages}
                  />
              </div>
              <form className='flex items-center justify-self-end m-2' onSubmit={handleSubmit(onMessageSent)}>
                  <div className='w-full'>
                      <input
                          type="text"
                          className='w-full h-full rounded-md p-2'
                          {...register('message', { required: true })}
                      />
                  </div>
                  <button type='submit' className='flex items-center h-full mr-4 ml-2 outline-none focus:outline-none'
                          style={{ width: '5%' }}>
                      <img className='transform -rotate-90 h-full cursor-pointer' src="/icons/planeIcon.svg"
                           alt="Plane"/>
                  </button>
              </form>
          </div>
        }
      </div>
  );
}

export default Conversation;
