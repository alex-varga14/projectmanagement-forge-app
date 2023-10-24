import Resolver from '@forge/resolver';
import { generateProjectPlan } from './GenerateProjectPlan';

const resolver = new Resolver();

resolver.define('generateProjectPlan', (req) => {
  console.log('REQ::: ', req)
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

export const handler = resolver.getDefinitions();
