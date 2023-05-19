
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



export function stringifyActionCode(actions: ChatGPTActionItems[]): string {
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

export function parseActionCode(actionCode: string): ChatGPTActionItems[] {
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
