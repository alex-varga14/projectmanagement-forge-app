import { RunnableSequence } from "langchain/schema/runnable";
import { OpenAI } from "langchain/llms/openai";
import { StringOutputParser } from "langchain/schema/output_parser";
import { prompt1, prompt2, prompt3, prompt4 } from "./prompts.js";

const model = new OpenAI({ temperature: 0.0 });
const outputModel = new OpenAI({ maxTokens: 2000, temperature: 0.0 });

const baseLink = prompt1.pipe(model).pipe(new StringOutputParser());

const firstLink = RunnableSequence.from([
  {
    project_plan: baseLink,
    tech_stack: (input) => input.tech_stack,
    features: (input) => input.features,
  },
  prompt2,
  model,
  new StringOutputParser(),
]);

const secondLink = RunnableSequence.from([
  {
    project_plan: firstLink,
    team_members: (input) => input.team_members,
  },
  prompt3,
  model,
  new StringOutputParser(),
]);

const lastLink = RunnableSequence.from([
  {
    project_plan: secondLink,
  },
  prompt4,
  outputModel,
  new StringOutputParser(),
]);

export async function generateProjectPlan(input) {
  try {
    console.log('INPUT -', input)
    const result = lastLink.invoke(input);
    return JSON.parse(result);
  } catch (err) {
    console.error(err);
    return null;
  }
}
