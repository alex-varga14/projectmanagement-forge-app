import { PromptTemplate } from "langchain/prompts.js";

export const prompt1 = PromptTemplate.fromTemplate(`
You are a professional project management engineer creating a project plan.
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
certain tasks should be finished.

Take a deep breath, and work it out step by step.

Plan:`);

export const prompt2 = PromptTemplate.fromTemplate(`
You are a professional project management engineer creating a project plan.
Below is the project plan you are working on improving. 

<project_plan>
  {project_plan}
</project_plan>

<tech_stack>
  {tech_stack}
</tech_stack>

<features>
  {features}
</features>

For the project plan, decompose each issue into the format below: 
[start]-[end] : [issue] [description of issue]  

Take a deep breath, and work it out step by step.

Project plan: `);

export const prompt3 = PromptTemplate.fromTemplate(`
You are a professional project management engineer creating a project plan.
Below is the project plan you are working on improving and the team members with their skills and preferences.

<project_plan>
  {project_plan}
</project_plan>

<team>
    {team_members}
</team>

Use the team information and assign team members by name to work on based on their skills and preferences.

Take a deep breath, and work step by step.

Decomposed plan: `);

export const prompt4 = PromptTemplate.fromTemplate(`
You are a professional project management engineer creating a project plan.

<project_plan>
  {project_plan}
</project_plan>

Use the team information and assign people tasks. You are a professional engineer,
so if you see the need for a new feature or issue, implement it. Introduce more detail and 
assign team members to the best of your ability.

Assign people after each issue, in the format:
[issue] : [assignees]

Make it possible for team members to work on different issues at the same time.

Now convert this into proper JSON with keys 'start_date', 'end_date', 'issue', 'assignees'.

JSON structured plan: `);