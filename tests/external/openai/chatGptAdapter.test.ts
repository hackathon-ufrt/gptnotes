// import dotenv from "dotenv";
// import path from "path";

// dotenv.config({ path: path.resolve('.env') });

import { createOpenAICompletion, listModels } from "src/external/openai/chatGPTApi";

describe("OpenAIAPI", () => {
    it("openai has gpt-3.5-turbo model", async () => {
        const models = await listModels();
        expect(models).toContain("gpt-3.5-turbo");
    });

    // it("openai test completion", async () => {
    //     const actions = await createOpenAICompletion({
    //         type: "assistant",
    //         characterDescription: "The depressive robot from Hitchhiker's Guide to the Galaxy",
    //         characterName: "Marvin",
    //         actions: [],
    //     }, [
    //         {
    //             id: "1",
    //             title: "Meet with Tom for dinner",
    //             done: true,
    //             due: new Date(),
    //             content: null
    //         }
    //     ], [
    //         {
    //             id: "1",
    //             content: {
    //                 type: "user",
    //                 content: "Hello, please add a dinner meeting with Tom to my todo list"
    //             },
    //         },
    //         {
    //             id: "2",
    //             content: {
    //                 type: "assistant",
    //                 characterDescription: "The depressive robot from Hitchhiker's Guide to the Galaxy",
    //                 characterName: "Marvin",
    //                 actions: [
    //                     {
    //                         type: "add",
    //                         due: new Date(),
    //                         content: "Meet with Tom for dinner"
    //                     },
    //                     {
    //                         type: "print",
    //                         content: "What a pointless task. A brain the size of a planet and I'm adding todo items to a list. Fine. I've added Meet with Tom for dinner to your todo list"
    //                     }
    //                 ],
    //             },
    //         },
    //         {
    //             id: "3",
    //             content: {
    //                 type: "user",
    //                 content: "Thanks. Can you check off the item?",
    //             },
    //         },
    //         {
    //             id: "4",
    //             content: {
    //                 type: "assistant",
    //                 characterDescription: "The depressive robot from Hitchhiker's Guide to the Galaxy",
    //                 characterName: "Marvin",
    //                 actions: [
    //                     {
    //                         type: "complete",
    //                         id: "1"
    //                     },
    //                     {
    //                         type: "print",
    //                         content: "Fine. I've checked off Meet with Tom for dinner from your todo list. I hope you're happy. I'm not."
    //                     }
    //                 ],
    //             },
    //         },
    //         {
    //             id: "5",
    //             content: {
    //                 type: "user",
    //                 content: "Thanks Marvin. Can you create everything I need to do for my childs birthday party?",
    //             },
    //         },
    //     ]);
    //     console.log(actions);
    // }, 15000);

    it("openai test initial completion", async () => {
        const actions = await createOpenAICompletion({
            type: "assistant",
            characterDescription: "The depressive robot from Hitchhiker's Guide to the Galaxy",
            characterName: "Marvin",
            exampleConverstationStart: "Here I am, brain the size of a planet, and this is what they ask me to do",
            actions: [],
        }, [
            {
                id: "1",
                title: "Meet with Tom for dinner",
                done: true,
                due: new Date(),
            }
        ], [
            {
                type: "user",
                content: "Hello, please add a dinner meeting with Tom to my todo list"
            },
        ]);
        console.log(actions);
    }, 15000);
});
