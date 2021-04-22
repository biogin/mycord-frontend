import { Profile } from "./profile";
import { ConversationStatus } from "./conversation-status";
import { Message } from "./message";

export interface Conversation {
  receivingUser: {
    id: number;
    profile: Profile;
  };
  status: ConversationStatus;
  messages: Array<Message>;
  id: number;
}
