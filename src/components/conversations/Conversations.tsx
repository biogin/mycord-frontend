import React, { useRef, useState, useEffect } from 'react';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import Layout, { ContentWidth } from "../../ui/Layout";
import Conversation from './components/Conversation';
import { useConversations, useUpdateConversations } from "./ConversationsProvider";
import { useParams } from "react-router-dom";
import { Message } from "../../types/message";

interface ConversationsProps {
}

function Conversations(_props: ConversationsProps) {
  const { conversations, loading, error: { query: queryError } } = useConversations();

  const { updateConversations } = useUpdateConversations();

  const containerRef = useRef<null | HTMLDivElement>(null);

  const params = useParams<{ id?: string }>();

  const [activeConversationId, setActiveConversationId] = useState<number | undefined>(Number(params.id));

  const [{ messagesWidth, conversationWidth }, setContainerWidths] = useState<{ [containerName: string]: string }>({});

  const [lastSentMessages, setLastSentMessages] = useState(() => new Map(conversations?.map(({
                                                                    id,
                                                                    messages
                                                                  }) => [id, messages[messages.length - 1]])));

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
                          {conversations.map(({
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
                                    lastMessage={lastSentMessages.get(id) || messages[messages.length - 1]}
                                    user={receivingUser}
                                    setLastSentMessages={(newMessage: Message, uid: number) => {
                                      setLastSentMessages((prev: Map<number, Message>) => {
                                        prev.set(+uid, newMessage);

                                        updateConversations();

                                        return prev;
                                      });
                                    }}
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
