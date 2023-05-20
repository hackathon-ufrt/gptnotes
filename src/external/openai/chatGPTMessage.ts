import { ChatGPTActionItems } from "./chatGPTActionItems";

export type ChatGPTCharacter = {
    type: "assistant",
    characterDescription: string,
    characterName: string,
    exampleConverstationStart: string,
    actions: ChatGPTActionItems[],
}

export type ChatGPTUser = {
    type: "user",
    content: string
}

export type ChatGPTMessage = ChatGPTCharacter | ChatGPTUser;
