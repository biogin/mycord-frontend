import { Profile } from "./profile";
import { ConversationStatus } from "./conversation-status";
import { Message } from "./message";

export interface Conversation {
  receivingUserProfile: Profile;
  status: ConversationStatus;
  messages: Array<Message>;
  id: number;
}
