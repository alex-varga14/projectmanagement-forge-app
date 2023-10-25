import Resolver from '@forge/resolver';
import { RunnableSequence } from "langchain/schema/runnable";
import { OpenAI } from "langchain/llms/openai";
import { StringOutputParser } from "langchain/schema/output_parser";
import { prompt1, prompt2, prompt3, prompt4 } from "./prompts.js";
import {storage} from "@forge/api";

import api, { route } from '@forge/api';

import { Queue } from '@forge/events';
 
const queue = new Queue ({key: 'prompt-info'})

const model = new OpenAI({ temperature: 0.0 });
const outputModel = new OpenAI({ modelName: "gpt-4", maxTokens: 2000, temperature: 0.0 });

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


const asyncResolver = new Resolver();
const uiResolver = new Resolver()

const team_members = `
## Team member one
    Name: Alex
    Role: Software Engineer
    Skills: Audio, backend
    Preferences: audio work

## Team member two
    Name: Vaughan
    Role: Lead Software Engineer
    Skills: Langchain, LLMs, Typescript
    Preferences: anything backend

## Team member three
    name: Dom
    role: Lead designer
    skills: Web design, user experience
    preferences: Making things pretty and testing
`;

const features = `
- multilingual
- order items
- add more items to order
- ask questions about menu items
- checkout on request
`;

const GenerateTask = async (taskName, taskDescription, taskDueDate, projKey) => {
  var bodyData = `{
      "fields": {
        "project":
        {
            "key": "${projKey}"  
        },
        "summary": "${taskName}",
        "description": "${taskDescription}",
        "issuetype": {
            "name": "Task"
        }
        "duedate": "${taskDueDate}"
    }
  }`;

  const final = await api.asApp().requestJira(route`/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: bodyData
    });

    return final
}

const generateTasks = async (taskData) => {
  for (const key in taskData) {
    try{
      const { start_date, end_date, issue, assignees } = taskData[key];
      const final = await GenerateTask(start_date, issue, end_date, 'IP');
      return final
    } catch (err) {
      return {'message': err}
    }
  }    
    // You can also use the 'assignees' property to assign the task to specific team members.
}

// async function GenerateProjectPlan(start_date, end_date, project_description, tech_stack, features, team_members) {
const generateProjectPlan = async (planData) => {
  let llmResponse;
  try {
    const result = await lastLink.invoke({
      start_date: planData.start_date,
      end_date: planData.end_date,
      project_description: planData.project_description,
      tech_stack: planData.tech_stack,
      features: features,
      team_members: team_members,
    });
    //return await generateTasks(JSON.parse(result));
    llmResponse = JSON.parse(result);
    const final = await generateTasks(llmResponse);
    return final
    // return { message: result }
  } catch (err) {
    console.log(err);
    return { message: err}
  }
}

asyncResolver.define('promptEventListener', async (queueItem) => {
  const plan = queueItem.payload;
  const planContext = queueItem.context;
  const planId = plan.id;
  const generatedPlan = await generateProjectPlan(plan.projectData);
  await storage.set(planId, generatedPlan) 
});

uiResolver.define('buildingProjectPlanFromInfo', async (req) => {
  console.log('REQ::: ', req)

  const projectId = req.context.extension.project.id;
  const projectData = req.payload;
  
  const projectJob = {
    id: projectId,
    projectData: projectData
  }
  await queue.push(projectJob);
  return projectJob;
});

uiResolver.define("pollTaskResult", async (req) => {
  // check if done
  const planId = req.payload.planId.id;
  
  const result = await storage.get(planId);
  if (result) {
    await storage.delete(planId);
  }
  return result;
  const pollResult = {
    status: result ? result.status : 404,
    planData: result ? planId.projectData : undefined 
  }
  return pollResult;
});

export const asyncHandler = asyncResolver.getDefinitions();
export const uiHandler = uiResolver.getDefinitions();
