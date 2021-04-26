import React, { useRef, useState, useEffect } from 'react';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { gql, useLazyQuery, useQuery } from "@apollo/client";

import Layout, { ContentWidth } from "../../ui/Layout";
import Conversation from './components/Conversation';
import { useConversations } from "./ConversationsProvider";
import { MESSAGES_SUBSCRIPTION } from "./components/Messages";

export const CONVERSATION_QUERY = gql`
    query Conversation($conversationId: ID!) {
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

interface ConversationsProps {

}

function Conversations(_props: ConversationsProps) {
  const { conversations, loading, error: { query: queryError } } = useConversations();

  const [fetchConversation, {
    subscribeToMore,
    data,
    loading: loadingConversation,
    error
  }] = useLazyQuery(CONVERSATION_QUERY);

  const containerRef = useRef<null | HTMLDivElement>(null);

  const [activeConversationId, setActiveConversationId] = useState<number | undefined>(undefined);

  const [{ messagesWidth, conversationWidth }, setContainerWidths] = useState<{ [containerName: string]: string }>({});

  const [lastSentMessages, setLastSentMessages] = useState(new Map(conversations?.map(({
                                                                                         id,
                                                                                         messages
                                                                                       }) => [id, messages[0]])));

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

      const conversationWidth = conversationContainerWidth / containerWidth * 100;
      const messagesWidth = (containerWidth - conversationContainerWidth) / containerWidth * 100;

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
        <div ref={containerRef} className="flex flex-col bg-white h-screen relative">
          {loading ?
              <SkeletonTheme color="#f3f3f3" highlightColor="lightgrey">
                <Skeleton height={100} count={6}/>
              </SkeletonTheme>
              : queryError ? <p className='text-red-400 text-center'>Error loading conversations.</p>
                  : !conversations?.length ?
                      <p className='text-center text-xl font-light mt-8'>No conversations found</p> :
                      <div className={`bg-grey-100 h-full ${!activeConversationId && `w-full`}`}>
                        <div className='relative m-4'>
                          {conversations?.map(({
                                                 id,
                                                 receivingUser,
                                                 status,
                                                 messages
                                               }) => {
                            return (
                                <Conversation
                                    active={activeConversationId === id}
                                    id={id}
                                    key={id}
                                    conversationData={{
                                      loading: loadingConversation,
                                      error,
                                      data
                                    }}
                                    fetchConversation={fetchConversation}
                                    subscribeToNewMessages={() =>
                                        subscribeToMore?.({
                                          document: MESSAGES_SUBSCRIPTION,
                                          variables: { conversationId: id },
                                          updateQuery(prev, { subscriptionData }) {
                                            if (!subscriptionData.data) return prev;

                                            const newMessage = subscriptionData.data.messageSent;

                                            setLastSentMessages(prev => {
                                              prev.set(id, newMessage);

                                              return prev;
                                            });

                                            return {
                                              ...prev,
                                              conversation: {
                                                messages: [...prev.conversation.messages, newMessage]
                                              }
                                            }
                                          },
                                          onError(err) {
                                            console.log(JSON.stringify(err, null, 4));
                                          }
                                        })
                                    }
                                    lastMessage={lastSentMessages.get(id) || messages[0]}
                                    user={receivingUser}
                                    status={status}
                                    containerWidths={{
                                      messages: messagesWidth,
                                      conversation: conversationWidth
                                    }}
                                    setActiveConversationId={setActiveConversationId}
                                />
                            )
                          })
                          }
                        </div>
                      </div>
          }
        </div>
      </Layout>
  );
}

export default Conversations;
