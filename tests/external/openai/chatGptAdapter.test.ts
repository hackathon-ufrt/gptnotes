// import dotenv from "dotenv";
// import path from "path";

// dotenv.config({ path: path.resolve('.env') });

import { listModels } from "src/external/openai/chatGPTAdapter";

describe("OpenAIAPI", () => {
    it("openai has gpt-3.5-turbo model", async () => {
        const models = await listModels();
        expect(models).toContain("gpt-3.5-turbo");
    });
});
