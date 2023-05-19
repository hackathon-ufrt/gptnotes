import { type Character, type Message, type User } from "@prisma/client";

export type MessageResponse = Message & {
  author?: User | null;
  character?: Character | null;
};
