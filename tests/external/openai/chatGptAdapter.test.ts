// import dotenv from "dotenv";
// import path from "path";

// dotenv.config({ path: path.resolve('.env') });

import { listEngines } from "src/external/openai/chatGPTAdapter";

describe("OpenAIAPI", () => {
    it("list engines", async () => {
        await listEngines();
    });
  });