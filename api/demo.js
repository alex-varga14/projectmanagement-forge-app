import { GenerateProjectPlan } from "./api.js";

const start_date = "September 1, 2023";
const end_date = "October 14, 2023";

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

const project_description = `
An application that automates ordering at a resturaunt. Using new LLM models and speech recognition AI, this project
aims to remove the need for servers coming to tables to take orders. Everything will be run through an individual raspberry pi
located on each table.
`;

const tech_stack = `
There is not going to be any frontend. For the backend we want to write the bot in Python using frameworks like Langchain. When it comes to audio 
processing we are going to use sounddevice and google APIs for speech. The order backend is going to be through Square's APIs. For the database used to search
for items we are going to use ChromaDB.
`;

const features = `
- multilingual
- order items
- add more items to order
- ask questions about menu items
- checkout on request
`;

const result = await GenerateProjectPlan(start_date, end_date, project_description, tech_stack, features, team_members);
console.log(result)