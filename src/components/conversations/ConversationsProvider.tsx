import React, { createContext, ReactNode, useContext } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

import { Conversation } from "../../types/conversation";

interface IConversationsContext {
  conversations: Array<Conversation>

  sendMessage(receiverId: number, text: string): Promise<void>;

  loading: boolean;
  error: {
    query?: any;
    mutation?: any;
  };
}

const ConversationsContext = createContext<IConversationsContext>({
  async sendMessage(receiverId: number, text: string) {
  },
  conversations: [],
  loading: true,
  error: {}
});

const SEND_MESSAGE_MUTATION = gql`
    mutation SendMessage($receiverId: ID!, $text: String!){
        sendMessage(receiverId: $receiverId, text: $text){
            text
        }
    }
`;

const CONVERSATIONS_QUERY = gql`
    query UserConversations{
        conversations{
            id,
            receivingUser{
                id,
                profile{
                    username,
                    imageUrl
                }
            },
            messages{
                text,
                authorProfile{
                    username,
                    imageUrl
                }
            },
            status
        }
    }
`;

interface ConversationProviderProps {
  children: ReactNode;
}

function ConversationsProvider({ children }: ConversationProviderProps) {
  const { data, error, loading } = useQuery(CONVERSATIONS_QUERY);

  const [sendMessageMutation, { error: mutationError }] = useMutation(SEND_MESSAGE_MUTATION);

  const sendMessage = async (receiverId: number, message: string) => {
    await sendMessageMutation({ variables: { text: message, receiverId } });
  };

  const value = {
    sendMessage,
    conversations: data?.conversations,
    loading,
    error: {
      query: error,
      mutation: mutationError
    },
  };

  return (
      <ConversationsContext.Provider value={value}>
        {children}
      </ConversationsContext.Provider>
  );
}

export function useConversations(): Pick<IConversationsContext, 'conversations' | 'error' | 'loading'> {
  const { conversations, loading, error } = useContext(ConversationsContext);

  return {
    conversations,
    loading,
    error
  };
}

export function useSendMessage(): Pick<IConversationsContext, 'sendMessage'> & { error: any } {
  const ctx = useContext(ConversationsContext);

  return {
    sendMessage: ctx.sendMessage,
    error: ctx.error.mutation
  };
}

export default ConversationsProvider;
