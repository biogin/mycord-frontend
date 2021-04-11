import React, { useRef, useState, useEffect } from 'react';
import { gql, useMutation, useQuery } from "@apollo/client";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import Layout, { ContentWidth } from "../../ui/Layout";
import Conversation from './components/Conversation';
import { Conversation as IConversation } from '../../types/conversation';

const CONVERSATIONS_QUERY = gql`
    query UserConversations{
        conversations{
            id,
            receivingUserProfile{
                username,
                imageUrl
            },
            messages{
                text
            },
            status
        }
    }
`;

const SEND_MESSAGE_MUTATION = gql`
    mutation SendMessage($receiverId: ID, $message: String){
        sendMessage(receiverId: $receiverId, message: $message){
            text
        }
    }
`;

interface ConversationsProps {

}

function Conversations(_props: ConversationsProps) {
  const { data, error, loading } = useQuery(CONVERSATIONS_QUERY);

  const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION);

  const conversations: undefined | Array<IConversation> = data?.conversations?.length || [
    {
      id: 1,
      receivingUserProfile: {
        username: 'Shlala',
        imageUrl: 'lol'
      },
      status: 'default',
      messages: [{
        text: 'LOL YOU DIDNT'
      }]
    },
    {
      id: 2,
      receivingUserProfile: {
        username: 'Sergery',
        imageUrl: 'lol'
      },
      status: 'default',
      messages: [{
        text: 'Up To anything??!?!'
      }]
    }
  ];

  const containerRef = useRef<null | HTMLDivElement>(null);

  const [activeConversationId, setActiveConversationId] = useState(conversations?.[0]?.id);

  const [{ messagesWidth, conversationWidth }, setContainerWidths] = useState<{ [containerName: string]: string }>({});

  const resize = (e: any) => {
    const containerWidth = containerRef.current!.offsetWidth;

    const conversationWidth = (containerWidth / 2.5) / containerWidth * 100;
    const messagesWidth = (containerWidth - (containerWidth / 2.5)) / containerWidth * 100;

    setContainerWidths({
      messagesWidth: `${messagesWidth}%`,
      conversationWidth: `${conversationWidth}%`
    })
  };

  useEffect(() => {
    if (containerRef.current) {
      window.addEventListener('resize', resize);

      const containerWidth = containerRef.current!.offsetWidth;
      const conversationContainerWidth = (containerWidth / 2.5);

      const conversationWidth =  conversationContainerWidth / containerWidth * 100;
      const messagesWidth = (containerWidth - conversationContainerWidth ) / containerWidth * 100;

      setContainerWidths({
        messagesWidth: `${messagesWidth}%`,
        conversationWidth: `${conversationWidth}%`
      })
    }

    return () => {
      window.removeEventListener('resize', resize);
    }
  }, [containerRef]);

  return (
      <Layout mainContentWidth={ContentWidth.ThreeFourth}>
        <div ref={containerRef} className="flex flex-col bg-white h-full relative">
          {/*<h1 className='font-bold text-2xl p-4 border-b-2 border-grey-100'>*/}
          {/*  Conversations*/}
          {/*</h1>*/}
          {loading ?
              <SkeletonTheme color="#f3f3f3" highlightColor="lightgrey">
                <Skeleton height={100} count={6}/>
              </SkeletonTheme>
              : error ? <p className='text-red-400 text-center'>Error loading conversations.</p>
                  : !conversations?.length ?
                      <p className='text-center text-xl font-light mt-8'>No conversations found</p> :
                      <div className='bg-grey-100 h-full'>
                        <div className='relative m-4 bg-white'>
                          {conversations?.map(({
                                                 id,
                                                 receivingUserProfile,
                                                 status,
                                                 messages
                                               }) => (
                              <Conversation
                                  active={activeConversationId === id}
                                  id={id}
                                  key={id}
                                  lastMessage={messages[0]}
                                  userProfile={receivingUserProfile}
                                  status={status}
                                  sendMessage={sendMessage}
                                  containerWidths={{
                                    messages: messagesWidth,
                                    conversation: conversationWidth
                                  }}
                                  setActiveConversationId={setActiveConversationId}
                              />
                          ))
                          }
                        </div>
                      </div>
          }
        </div>
      </Layout>
  );
}

export default Conversations;
