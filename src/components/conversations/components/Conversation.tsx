import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";

import Messages, { MESSAGES_SUBSCRIPTION } from "./Messages";
import { Profile } from "../../../types/profile";
import { ConversationStatus } from "../../../types/conversation-status";
import { Message } from "../../../types/message";
import { useSendMessage } from "../ConversationsProvider";
import { useRefCallback } from "../../../shared/hooks/useRefCallback";
import { gql, useQuery } from "@apollo/client";

export const CONVERSATION_QUERY = gql`
    query Conversation($conversationId: ID!) {
        conversation(id: $conversationId) {
            id,
            messages{
                authorProfile{
                    imageUrl,
                    username
                },
                text
            }
        }
    }
`;

interface ConversationProps {
  id: number;
  active: boolean;
  user: {
    id: number;
    profile: Profile;
  };
  status: ConversationStatus;
  lastMessage: Message;

  setLastSentMessages(message: Message, id: number): void;

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
                        setLastSentMessages
                      }: ConversationProps) => {
  const [ref, refCallback] = useRefCallback();

  const updateScroll = () => {
    if (ref.current) {
      ref.current.scrollTo(0, ref.current.scrollHeight);
    }
  }

  const { data, error, loading, subscribeToMore } = useQuery(CONVERSATION_QUERY, { variables: { conversationId: id } });

  useEffect(() => {
    const unsubscribe = subscribeToMore?.({
      document: MESSAGES_SUBSCRIPTION,
      variables: { subscriptionId: id },
      updateQuery(prev, { subscriptionData }) {
        if (!subscriptionData.data || subscriptionData.data.messageSent.currentConversationId !== id) return prev;

        const newMessage = subscriptionData.data.messageSent;

        setLastSentMessages(newMessage, id);

        setTimeout(() => {
          updateScroll();
        });

        if (!active) {
          
        }

        return {
          ...prev,
          conversation: {
            id,
            messages: [...prev.conversation.messages, newMessage]
          }
        }
      },
      onError(err) {
        console.log(JSON.stringify(err, null, 4));
      }
    })

    return () => {
      unsubscribe();
    };
  }, []);

  const { sendMessage } = useSendMessage();

  const { register, handleSubmit, setValue } = useForm();

  const onMessageSent = async ({ message }: any) => {
    try {
      await sendMessage({ receiverId: user.id, text: message, currentConversationId: id });
    } catch (error) {
      console.log(JSON.stringify(error, null, 4));
    }

    setValue('message', '');
  };

  return (
      <div
          className={`flex flex-row`}>
        <div onClick={() => setActiveConversationId(id)}
             className={`flex justify-between items-center bg-white shadow-sm p-5 cursor-pointer w-full h-1/3 border-r-4 border-transparent ${active && 'border-r-4 border-secondary'}`}
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
                      messages={data?.conversation.messages}
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
