import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import dotenv from 'dotenv';

dotenv.config();

// Schema for the joke generation
const jokeSchema = z.object({
  setup: z.string().describe("The setup of the joke"),
  punchline: z.string().describe("The punchline of the joke"),
  topic: z.string().describe("The main topic or subject of the joke"),
});

// Schema for the joke rating
const ratingSchema = z.object({
  rating: z.number().describe("Rating from 1-10"),
  explanation: z.string().describe("Explanation for the rating"),
});

async function runJokeChain() {
  const model = new ChatOpenAI({ 
    model: "gpt-4o",
    openAIApiKey: process.env.OPENAI_API_KEY 
  });
  
  // Create models with structured output
  const jokeGenerator = model.withStructuredOutput(jokeSchema);
  const jokeRater = model.withStructuredOutput(ratingSchema);
  
  // Create chat prompt template for rating
  const ratingPrompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a joke critic. Rate the following joke on a scale of 1-10 and explain your rating."],
    ["human", "{jokeText}"]
  ]);
  
  // Build the chain
  const chain = RunnableSequence.from([
    // 1. Generate joke
    async (topic) => {
      const joke = await jokeGenerator.invoke(`Tell me a joke about ${topic}`);
      return {
        joke,
        jokeText: `Setup: ${joke.setup}\nPunchline: ${joke.punchline}`
      };
    },
    // 2. Rate the joke
    async (input) => {
      const rating = await jokeRater.invoke(await ratingPrompt.format({ 
        jokeText: input.jokeText 
      }));
      return {
        joke: input.joke,
        rating
      };
    }
  ]);

  try {
    const result = await chain.invoke("cats");
    console.log("\nGenerated Joke:");
    console.log(`Setup: ${result.joke.setup}`);
    console.log(`Punchline: ${result.joke.punchline}`);
    console.log(`Topic: ${result.joke.topic}`);
    console.log("\nRating:");
    console.log(`Score: ${result.rating.rating}/10`);
    console.log(`Explanation: ${result.rating.explanation}`);
  } catch (error) {
    console.error("Error in joke chain:", error);
  }
}

runJokeChain(); 