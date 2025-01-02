import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const jokeSchema = z.object({
  setup: z.string().describe("The setup of the joke"),
  punchline: z.string().describe("The punchline of the joke"),
  rating: z.number().optional().describe("How funny the joke is, from 1 to 10"),
});

async function generateJoke() {
  const model = new ChatOpenAI({ model: "gpt-4o" });
  const structuredModel = model.withStructuredOutput(jokeSchema);
  
  try {
    const response = await structuredModel.invoke("Tell me a joke about cats");
    console.log('\nFinal Response:', response);
  } catch (error) {
    console.error("Error generating joke:", error);
  }
}

generateJoke();