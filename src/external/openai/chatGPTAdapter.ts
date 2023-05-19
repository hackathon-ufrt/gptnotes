import { Configuration, OpenAIApi } from "openai";
import { env } from "../../env.mjs";


export async function listEngines() {
    const configuration = new Configuration({
        organization: env.OPENAI_ORGANIZATION,
        apiKey: env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.listModels();
    const models = response.data.data.map((model) => model.id);
    expect(models).toContain("gpt-3.5-turbo");
}
