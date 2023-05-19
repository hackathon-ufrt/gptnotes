import { Configuration, OpenAIApi } from "openai";
import { env } from "../../env.mjs";
import { ChatCompletionRequestMessageRoleEnum } from "openai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const configuration = new Configuration({
    organization: env.OPENAI_ORGANIZATION,
    apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function listModels() {
    const response = await openai.listModels();
    const models = response.data.data.map((model) => model.id);
    return models;
}

export type ChatGPTTodo = {
    id: string
    title: string
    done: boolean
    due: Date | null
    content: string | null
}

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

export type ChatGPTMessage = {
    id: string,
    content: ChatGPTMessageContent
}

export type ChatGPTAction = {
    type: "add",
    due: Date,
    content: string
};

export type ChatGPTActionComplete = {
    type: "complete",
    id: string
};

export type ChatGPTActionPrint = {
    type: "print",
    content: string
};

export type ChatGPTActionItems = ChatGPTAction | ChatGPTActionComplete | ChatGPTActionPrint;

function stringifyActionCode(actions: ChatGPTActionItems[]): string {
    return actions.map((action) => {
        switch (action.type) {
            case "add":
                return `ADD(${action.due.toDateString()}, "${action.content}")`;
            case "complete":
                return `COMPLETE(${action.id})`;
            case "print":
                return `PRINT("${action.content}")`;
        }
    }).join("\n");
}

function parseActionCode(actionCode: string): ChatGPTActionItems[] {
    const actions: ChatGPTActionItems[] = [];
    const lines = actionCode.split("\n");
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith("ADD")) {
            const match = trimmedLine.match(/^ADD\((.*), "(.*)"\)$/);
            if (match === null) {
                console.log(`Invalid ADD command: ${trimmedLine} in ${actionCode}`);
                continue;
            }
            const due = new Date(match[1]!.toString());
            const content = match[2]!;
            actions.push({
                type: "add",
                due: due,
                content: content ?? "",
            });
        } else if (trimmedLine.startsWith("COMPLETE")) {
            const match = trimmedLine.match(/^COMPLETE\((.*)\)$/);
            if (match === null) {
                console.log(`Invalid COMPLETE command: ${trimmedLine} in ${actionCode}`);
                continue;
            }
            const id = match[1]!;
            actions.push({
                type: "complete",
                id: id,
            });
        } else if (trimmedLine.startsWith("PRINT")) {
            const match = trimmedLine.match(/^PRINT\("(.*)"\)$/);
            if (match === null) {
                console.log(`Invalid PRINT command: ${trimmedLine} in ${actionCode}`);
                continue;
            }
            const content = match[1]!;
            actions.push({
                type: "print",
                content: content ?? "",
            });
        } else {
            console.log(`Invalid command: ${trimmedLine} in ${actionCode}`);
            continue;
        }
    }
    return actions;
}

export async function createOpenAICompletion(currentCharacter: ChatGPTCharacter, todoList: ChatGPTTodo[], chatHistory: ChatGPTMessage[]): Promise<ChatGPTCharacter> {
    const system = `Tod-GPT is a chat application that helps manage your todo list. Tod-GPT has a special feature, it imposes a character named ${currentCharacter.characterName}, which is better explained as ${currentCharacter.characterDescription}.
Tod-GPT MUST respond with only these commands:
ADD(MM/DD/YYYY, "Text"): Creates a new todo list item
COMPLETE(ID): Checks off an item as done
PRINT("Text"): Prints a message to the user
Tod-GPT can only use the commands above. The todo list currently contains ${todoList.length} items.:
${todoList.map((todo) => `Id ${todo.id} is due ${todo.due?.toDateString()} and marked as ${todo.done ? "done" : "open"}: ${todo.title}`).join("\n")}
The user will send a text, and Tod-GPT will respond with a command. The last command will aways be PRINT("Text").
User:
Hi, i'm your user. Remind me to buy milk tomorrow.
Tod-GPT:
ADD(${(new Date()).toDateString()}, "Buy milk")
PRINT("Hi, i'm tod")
`;

    let messages = chatHistory.map((message) => {
        return {
            content: message.content.type === "assistant" ? stringifyActionCode(message.content.actions) : message.content.content,
            role: message.content.type === "assistant" ? ChatCompletionRequestMessageRoleEnum.Assistant : ChatCompletionRequestMessageRoleEnum.User as ChatCompletionRequestMessageRoleEnum,
        };
    });
    messages = [{
        content: system,
        role: ChatCompletionRequestMessageRoleEnum.System,
    }, ...messages];

    // Run some checks to prevent abuse
    if (messages.length >= 7) {
        throw new Error("Too many messages");
    }
    const totalLength = messages.reduce((acc, message) => acc + message.content.length, 0);
    if (totalLength >= 2048) {
        throw new Error("Total message length too long");
    }
    for (const message of messages) {
        if (message.content.length >= 1024) {
            throw new Error("Message too long");
        }
    }

    // Do rate limiting with upstash
    const rateLimit = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(5, "180s"),
        analytics: false,
        timeout: 1000, // 1 second
    });
    const rateLimitResult = await rateLimit.limit("TotalOpenAIRequests in " + env.NODE_ENV + " environment");
    if (rateLimitResult.success !== true) {
        throw new Error("Rate limited");
    }

    console.log(messages)
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
    })

    for (const choices of response?.data?.choices) {
        console.log(choices);
    }

    const completion = response?.data?.choices[0]?.message?.content;
    if (completion === undefined) {
        throw new Error("No completion");
    }
    // completion should look something like this:
    // ADD(2021-10-10, "Test")
    // COMPLETE(uiksklalxielwq)
    // PRINT("I added a todo item for you")

    // Parse the completion line by line
    const actions = parseActionCode(completion);
    for (const action of actions) {
        if (action.type === "complete") {
            if (todoList.find((todo) => todo.id === action.id) === undefined) {
                throw new Error(`Invalid todo id ${action.id}`);
            }
        }
    }

    return {
        type: "assistant",
        characterName: currentCharacter.characterName,
        characterDescription: currentCharacter.characterDescription,
        actions: actions,
    };
}
