import React, { useLayoutEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import { gql, MutationFunction, useQuery } from "@apollo/client";

import Messages, { MESSAGES_SUBSCRIPTION } from "./Messages";
import { Profile } from "../../../types/profile";
import { ConversationStatus } from "../../../types/conversation-status";
import { Message } from "../../../types/message";

const CONVERSATION_QUERY = gql`
    query Conversation($conversationId: ID) {
        conversation(id: $conversationId) {
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
  userProfile: Profile;
  status: ConversationStatus;
  lastMessage: Message;
  sendMessage: MutationFunction;

  containerWidths: {
    messages: string;
    conversation: string;
  };

  setActiveConversationId(id: number): void;
}

const Conversation = ({
                        id,
                        active,
                        setActiveConversationId,
                        containerWidths: { messages, conversation },
                        status,
                        userProfile,
                        lastMessage,
                        sendMessage
                      }: ConversationProps) => {
  const messagesContainer = useRef<null | HTMLDivElement>(null);

  const { register, handleSubmit } = useForm();

  const { subscribeToMore, error, loading, data } = useQuery(CONVERSATION_QUERY, {
    fetchPolicy: 'cache-and-network',
    variables: {
      conversationId: id
    }
  });

  useLayoutEffect(() => {
    if (messagesContainer.current) {
      messagesContainer.current!.scrollTop = messagesContainer.current!.scrollHeight;
    }
  }, [messagesContainer]);

  const onMessageSent = async ({ message }: any) => {
    try {
      await sendMessage({ variables: { receiverId: userProfile.id, message } });
    } catch (error) {
      console.log(JSON.stringify(error, null, 4));
    }
  };

  return (
      <div onClick={() => setActiveConversationId(id)}
           className={`flex flex-row`}>
        <div
            className={`flex rounded-md justify-between items-center p-3 cursor-pointer w-1/2 h-1/3 ${active && 'bg-secondary'}`}
            style={{ ...(conversation && { width: conversation }) }}
        >
          <div className='flex flex-col justify-center items-start w-1/12'>
            <img className='w-full'
                 src="https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png" alt="Profile"/>
          </div>
          <div className='flex flex-col items-start w-11/12 ml-4'>
            <p className={`text-center text-xl text-secondary ${active && 'text-white'}`}>{userProfile.username}</p>
            <p className={`w-1/2 font-thin`}>
              {lastMessage.text}
            </p>
          </div>
        </div>
        {
          active && <div
              className='flex overflow-scroll flex-col justify-between absolute right-0 top-0 transform ml-auto bg-white'
              style={{ height: '85vh', ...(messages && { width: messages }) }}>
              <div
                  ref={messagesContainer}
                  className='h-full overflow-scroll'>
                  <Messages
                      error={error}
                      loading={loading}
                      messages={data?.messages}
                      subscribeToNewMessages={() =>
                          subscribeToMore({
                            document: MESSAGES_SUBSCRIPTION,
                            variables: { conversationId: id },
                            updateQuery(prev, { subscriptionData }) {
                              if (!subscriptionData.data) return prev;

                              const newMessage = subscriptionData.data.messageSent;

                              return {
                                ...prev,
                                conversation: {
                                  messages: [...prev.conversation.messages, newMessage]
                                }
                              }
                            }
                          })
                      }
                  />
              </div>
              <form className='flex justify-self-end' onSubmit={handleSubmit(onMessageSent)}>
                  <div className='w-full'>
                      <input
                          type="text"
                          className='w-full h-full rounded-md p-2'
                          {...register('message', { required: true })}
                      />
                  </div>
                  <button type='submit' className='h-full mr-4 ml-2 outline-none focus:outline-none'>
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
