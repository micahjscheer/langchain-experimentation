import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { BaseCallbackHandler } from "@langchain/core/callbacks/base";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Simple callback handler
class SimpleLogger extends BaseCallbackHandler {
  name = "SimpleLogger";

  async handleLLMStart(llm, prompts, runId, parentRunId, extraParams) {
    console.log('\n=== LLM Start ===');
    console.log('LLM:', llm);
    console.log('Prompts:', JSON.stringify(prompts, null, 2));
    console.log('Extra Params:', JSON.stringify(extraParams, null, 2));
  }

  async handleLLMNewToken(token) {
    console.log('\n=== New Token ===');
    console.log('Token:', token);
  }

  async handleLLMEnd(output) {
    console.log('\n=== LLM End ===');
    console.log('Output:', JSON.stringify(output, null, 2));
  }

  async handleLLMError(error) {
    console.log('\n=== LLM Error ===');
    console.log('Error:', error);
  }

  async handleText(text) {
    console.log('\n=== Text ===');
    console.log('Text:', text);
  }

  async handleToolStart(tool) {
    console.log('\n=== Tool Start ===');
    console.log('Tool:', tool);
  }

  async handleToolEnd(output) {
    console.log('\n=== Tool End ===');
    console.log('Output:', JSON.stringify(output, null, 2));
  }

  async handleToolError(error) {
    console.log('\n=== Tool Error ===');
    console.log('Error:', error);
  }
}

const jokeSchema = z.object({
  setup: z.string().describe("The setup of the joke"),
  punchline: z.string().describe("The punchline of the joke"),
  rating: z.number().min(1).max(10).describe("How funny the joke is"), // <- Interesting that it uses the full validation schema min and max
});

async function generateJoke() {
  const model = new ChatOpenAI({ 
    model: "gpt-4",
    callbacks: [new SimpleLogger()],
  });
  
  const structuredModel = model.withStructuredOutput(jokeSchema);
  
  try {
    console.log('\nGenerating joke...\n');
    const response = await structuredModel.invoke("Tell me a joke about cats");
    console.log('\nFinal Response:', response);
  } catch (error) {
    console.error("Error generating joke:", error);
  }
}

generateJoke();