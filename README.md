# LangChain Experimentation

A Node.js project exploring LangChain's structured output capabilities with OpenAI. Features include generating structured jokes using GPT-4o with both simple and chained approaches.

## Prerequisites

- Node.js v20.17.0
- npm (latest stable)
- OpenAI API key

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
```
Edit `.env` and add your OpenAI API key.

## Running Examples

### Simple Structured Output
```bash
node simple.js
```
Demonstrates basic structured output using a Zod schema to generate a joke with setup and punchline.

### Advanced Chain Example
```bash
node chain.js
```
Shows a more complex example that generates a joke and then rates it using a chain of operations.

## Project Structure

- `simple.js` - Simple structured output example
- `chain.js` - Advanced chaining example with joke generation and rating
- `.env` - Environment configuration (not in git)
- `.env.example` - Environment template

## Dependencies

- @langchain/core
- @langchain/openai
- langchain
- zod
- dotenv

## Notes

The project uses GPT-4o for optimal results. Ensure your OpenAI API key has GPT-4o access.

