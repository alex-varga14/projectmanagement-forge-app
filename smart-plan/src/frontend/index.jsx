import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Form, Text, Strong, TextField, Button, Badge, DatePicker, } from '@forge/react';
import { invoke } from '@forge/bridge';
import api, { route } from '@forge/api';

const App = () => {

  const [formState, setFormState] = useState(undefined);

  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState('')
  const [teamMembers, setTeamMembers] = useState([]);
  const [newTeamMember, setNewTeamMember] = useState('');

  const [planGeneration, setPlanGeneration] = useState(null);
  const [planId, setPlanId] = useState(null);
  const [result, setResult] = useState(null);

  let planPollHandle = null;


  const pollForTasks = async (planId) => {
    console.log('PULLING TASKS', planId);
    if (planId) {
      const result = await invoke ('pollTaskResult', {planId: planId});
      console.log("RESULT - ", result)
      console.log(`STRING RESULT = ${JSON.stringify(result)}`)
      if (result && result.status !== 404) {
        setPlanGeneration(false);
        setResult(result);
        setPlanId(null);
        if(planPollHandle) {
          console.log(`Clearing Interval...`);
          clearInterval(planPollHandle);
          planPollHandle = null;
        } else {
          console.log(`No interval handle to clear.`);
        }
      }
    }
  }

  const createProjectPlan = async (formData) => {
    setNewFeature('');
    setNewTeamMember('');
    formData.features = features;
    formData.team = teamMembers;
    setFormState(formData)

    setPlanGeneration(true);
    const planId = await invoke('buildingProjectPlanFromInfo', {
      start_date: formData.startDate,
      end_date: formData.endDate,
      project_description: formData.projectDescription,
      tech_stack: formData.stack,
      features: formData.features,
      team_members: formData.team,
    });
    //console.log('PLAN GENERTTAED =', planId)
    setPlanId(planId);
    console.log("BEFORE LOOP PLAN ID: ", planId.id);
    console.log("BEFORE LOOP PROJECT DATA: ", planId.projectData);
    planPollHandle = setInterval(async () => {
      await pollForTasks(planId);
      console.log("PLAN ID: ", planId.id);
      console.log("PROJECT DATA: ", planId.projectData);
    }, 40000);

    // await generateTasks(generatedTasks)
  };

  const addTeamMember = () => {
    if (newTeamMember) {
      setTeamMembers([...teamMembers, newTeamMember]);
      setNewTeamMember('');
    }
  };

  const addFeature = () => {
    if (newFeature) {
      setFeatures([...features, newFeature]);
      setNewFeature('');
    }
  }; 


  return (
    <>
      <Form onSubmit={createProjectPlan}>
        <DatePicker
            name="startDate"
            label="Start Date"
            //description="Sprint Start Date"
            onChange={(value) => console.log(value)}
          />
        <DatePicker
            name="endDate"
            label="End Date"
            //description="Sprint End Date"
            onChange={(value) => console.log(value)}
        />
        <TextField
          label="Project Description"
          name="projectDescription"
          // value={inputValue}
          // onChange={(value) => setInputValue(value)}
        />
        <TextField
          label="Technology Stack"
          name="stack"
          // value={inputValue}
          // onChange={(value) => setInputValue(value)}
        />
        <TextField
          label="Features"
          name="features"
          //value={newFeature}
          onChange={(value) => setNewFeature(value)}
        />
        <Button 
          appearance="default"
          icon="add-circle"
          iconPosition="before"
          onClick={addFeature} 
        > 
          Add Feature 
        </Button>

        {features.map((feature, index) => (
          <Badge 
            appearance="primary" 
            key={index} 
            text={feature}
          />
        ))}
        
        <TextField 
          name="team" 
          label="Team Members" 
          onChange={(value) => setNewTeamMember(value)}
        />
        <Button
          appearance="default"
          icon="add-circle"
          iconPosition="before"
          onClick={addTeamMember}
        >
          Add Team Member
        </Button>
        {teamMembers.map((member, index) => (
          <Badge 
            appearance="added" 
            key={index} 
            text={member}
          />
        ))}
      </Form>
      {formState && <Text>{JSON.stringify(formState)}</Text>}
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);