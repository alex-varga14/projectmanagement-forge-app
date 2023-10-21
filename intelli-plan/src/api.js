import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { StringOutputParser } from "langchain/schema/output_parser";
import { RunnableSequence } from "langchain/schema/runnable";
import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";


import dotenv from "dotenv";

dotenv.config();

const model = new OpenAI({
    temperature: 0.0,
});

const outputModel = new OpenAI({ maxTokens: 2000 });


const prompt1 = PromptTemplate.fromTemplate(`
You are acting as a professional project management engineer.
Below the user defines the project's starting and ending dates and the project description. 

<start_date>
  {start_date}
</start_date>

<end_date>
  {end_date}
</end_date>

<project_description>
    {project_description}
</project_description>

Given the information you've received, output the skeleton of a project plan, with general goals of when
certain tasks should be finished. Keep it general.

Take a deep breath, and work it out step by step.

Rough plan:`);

const prompt2 = PromptTemplate.fromTemplate(`
You are a professional project management engineer.
Below is a project plan to iterate on and improve. 
You need to incorporate the new information like the technology stack and features given below into the project plan.

<project_plan>
  {project_plan}
</project_plan>

<tech_stack>
  {tech_stack}
</tech_stack>

<features>
  {features}
</features>

Given the tech_stack details and features you've received, update the given project_plan.
Feel free to add more intermediate timepoints, but preserve the current formatting of the plan.

Take a deep breath, and work it out step by step.

Project plan: `);

const prompt3 = PromptTemplate.fromTemplate(`
You are a professional project management engineer.
Below is a project plan to iterate on and improve. 

<project_plan>
  {project_plan}
</project_plan>

For the project plan, decompose each issue into the format below: 
[start]-[end] : [issue] [description of issue]  
If two multiple issues have the same start and end date, decompose them into multiple lines.

Add more intermediate and specific timepoints as deemed necessary.
Decomposed plan: `);

const prompt4 = PromptTemplate.fromTemplate(`
You are a professional project management engineer.
You are now being given the team members and their skills. You need to take their information and assign them to different issues. 
Below is a project plan you are working to improve.

<project_plan>
  {project_plan}
</project_plan>

<team>
    {team_members}
</team>

Use the team information and assign people tasks. You are a professional engineer,
so if you see the need for a new feature or issue, implement it. Introduce more detail and 
assign team members to the best of your ability.

Assign people after each issue, in the format:
[issue] : [assignees]

Now convert this into proper JSON with keys 'start_date', 'end_date', 'issue', 'assignees'.

JSON structured plan: `);

const frameworkChain = prompt1.pipe(model).pipe(new StringOutputParser());

const combinedChain = RunnableSequence.from([
    {
      project_plan: frameworkChain,
      tech_stack: (input) => input.tech_stack,
      features: (input) => input.features
    },
    prompt2,
    model,
    new StringOutputParser(),
]);

const ultiChain = RunnableSequence.from([
    {
        project_plan: combinedChain,
    },
    prompt3,
    model,
    new StringOutputParser()
]);

const secondLastChain = RunnableSequence.from([
    {
        project_plan: ultiChain,
        team_members: (input) => input.team_members
    },
    prompt4,
    outputModel,
    new StringOutputParser()
]);



const team_members = `
## Team member one
    Name: Alex
    Role: Software Engineer
    Skills: React, Remix, frontend
    Preferences: frontend

## Team member two
    Name: Vaughan
    Role: Lead Software Engineer
    Skills: Langchain, LLMs, Typescript
    Preferences: anything backend

## Team member three
    Name: Don
    Role: Lead designer
    Skills: Web design, user experience
    Preferences: Making things pretty
`


try{
    const result = await secondLastChain.invoke({
        start_date: "October 20, 2023",
        end_date: "January 1, 2023",
        project_description: "A application that automates the application process by using LLMs to consume job posting data and write custom cover letters",
        tech_stack: "Want to use Langchain and TypeScript for the language. Remix for frontend. Chromadb for the backend.",
        features: "Automatic cover letter generation. Pass robot check.",
        team_members: team_members
    });
    console.log(result)
} catch(err) {
    console.log("error")
}


