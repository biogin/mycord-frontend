import { Profile } from "./profile";


export interface Message {
  text: string;
  authorProfile: Partial<Profile>;
}
