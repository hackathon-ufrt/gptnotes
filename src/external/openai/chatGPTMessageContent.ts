import { ChatGPTActionItems } from "./chatGPTActionItems";

export type ChatGPTCharacter = {
    type: "assistant",
    characterDescription: string,
    characterName: string,
    actions: ChatGPTActionItems[],
}

export type ChatGPTUser = {
    type: "user",
    content: string
}

export type ChatGPTMessageContent = ChatGPTCharacter | ChatGPTUser;
