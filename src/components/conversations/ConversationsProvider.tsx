import React, { createContext, ReactNode, useContext } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

import { Conversation } from "../../types/conversation";
import { ConversationStatus } from "../../types/conversation-status";

type SendMessageArgs = { receiverId: number, text: string, currentConversationId?: number };

interface IConversationsContext {
  conversations: Array<Conversation>

  updateConversations(): void;

  setConversationStatus(id: number, status: ConversationStatus): Promise<void>,

  sendMessage({ receiverId, currentConversationId, text }: SendMessageArgs): Promise<void>;

  loading: boolean;
  error: {
    query?: any;
    mutation?: any;
  };
}

const ConversationsContext = createContext<IConversationsContext>({
  async sendMessage({ receiverId, text, currentConversationId }) {
  },
  async setConversationStatus(id: number, status: ConversationStatus) {
  },
  updateConversations() {
  },
  conversations: [],
  loading: true,
  error: {}
});

const SEND_MESSAGE_MUTATION = gql`
    mutation SendMessage($receiverId: ID!, $text: String!, $currentConversationId: ID){
        sendMessage(receiverId: $receiverId, text: $text, currentConversationId: $currentConversationId){
            text
        }
    }
`;

const SET_CONVERSATION_STATUS_MUTATION = gql`
  mutation SetConversationStatus($conversationID: ID!, $status: ConversationStatus){
      setConversationStatus(id: $conversationID, status: $status){
          id
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
  const { data, error, loading, refetch } = useQuery(CONVERSATIONS_QUERY);

  const [sendMessageMutation, { error: mutationError }] = useMutation(SEND_MESSAGE_MUTATION);

  const [setConversationStatusMutation, { error: setConversationStatusMutationError }] = useMutation(SET_CONVERSATION_STATUS_MUTATION);

  const sendMessage = async ({ receiverId, currentConversationId, text }: SendMessageArgs) => {
    await sendMessageMutation({ variables: { text, receiverId, currentConversationId } });
  };

  const setConversationStatus = async (id: number, status: ConversationStatus) => {
    await setConversationStatusMutation({ variables: { status, id }})
  }

  const value = {
    sendMessage,
    updateConversations() {
      refetch()
    },
    setConversationStatus,
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

export function useUpdateConversations(): Pick<IConversationsContext, 'updateConversations'> {
  const ctx = useContext(ConversationsContext);

  return {
    updateConversations: ctx.updateConversations
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
