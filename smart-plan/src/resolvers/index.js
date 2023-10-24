import Resolver from '@forge/resolver';
import { generateProjectPlan } from './GenerateProjectPlan';

const resolver = new Resolver();

resolver.define('generateProjectPlan', (req) => {
  const { start_date, end_date, project_description, tech_stack, features, team_members } = req;

  const projectPlan = generateProjectPlan({
    start_date,
    end_date,
    project_description,
    tech_stack,
    features,
    team_members,
  });

  return projectPlan;
});

resolver.define('getText', (req) => {
  console.log(req);
  
  return 'New world inbounds';
});

export const handler = resolver.getDefinitions();
