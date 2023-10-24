import Resolver from '@forge/resolver';
//import { generateProjectPlan } from './GenerateProjectPlan.js';
import { RunnableSequence } from "langchain/schema/runnable";
import { OpenAI } from "langchain/llms/openai";
import { StringOutputParser } from "langchain/schema/output_parser";
import { prompt1, prompt2, prompt3, prompt4 } from "./prompts.js";

const model = new OpenAI({ temperature: 0.0 });
const outputModel = new OpenAI({ maxTokens: 2000, temperature: 0.0 });

const baseLink = prompt1.pipe(model).pipe(new StringOutputParser());

// const firstLink = RunnableSequence.from([
//   {
//     project_plan: baseLink,
//     tech_stack: (input) => input.tech_stack,
//     features: (input) => input.features,
//   },
//   prompt2,
//   model,
//   new StringOutputParser(),
// ]);

// const secondLink = RunnableSequence.from([
//   {
//     project_plan: baseLink,
//     team_members: (input) => input.team_members,
//   },
//   prompt3,
//   model,
//   new StringOutputParser(),
// ]);

const lastLink = RunnableSequence.from([
  {
    project_plan: baseLink,
  },
  prompt4,
  outputModel,
  new StringOutputParser(),
]);


const resolver = new Resolver();

async function GenerateProjectPlan(start_date, end_date, project_description, tech_stack, features, team_members) {
  let llmResponse;
  //return {plan : "hello"}

  try {
    const result = await baseLink.invoke({
      start_date: start_date,
      end_date: end_date,
      project_description: project_description,
      tech_stack: tech_stack,
      features: "features",
    });
    //llmResponse = JSON.parse(result);
    return { message: result }
  } catch (err) {
    console.log(err);
    return { message: err}
  }

 // return llmResponse
}

resolver.define('generateProjectPlan', async (req) => {
  console.log('REQ::: ', req)
  const { start_date, end_date, project_description, tech_stack, features, team_members } = req.payload;

  const projectPlan = await GenerateProjectPlan({
    start_date,
    end_date,
    project_description,
    tech_stack,
    features,
    team_members,
  });

  return {plan: projectPlan}
});

// resolver.define('resolverProjectPlan', ({payload, context}) => {
//   console.log('REQ::: ', payload)
//   //const { start_date, end_date} = req;
//   return payload
//   // generateProjectPlan({
//   //   start_date,
//   //   end_date,
//   //   project_description,
//   //   tech_stack,
//   //   features,
//   //   team_members,
//   // }).then((returnedPlan) => {return returnedPlan});

// });

export const handler = resolver.getDefinitions();
