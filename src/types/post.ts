import { Profile } from "./profile";

export interface IPost {
  description: string;
  createdAt: Date;
  title: string;
  audioUrl: string;
  profile: Profile;
}
