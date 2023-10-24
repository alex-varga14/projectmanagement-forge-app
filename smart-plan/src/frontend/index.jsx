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

  // async function GenerateTask(taskName, taskDescription, taskDueDate, projKey){
  //   var bodyData = `{
  //       "fields": {
  //         "project":
  //         {
  //             "key": "${projKey}"  
  //         },
  //         "summary": "${taskName}",
  //         "description": "${taskDescription}",
  //         "issuetype": {
  //             "name": "Task"
  //         }
  //         "duedate": "${taskDueDate}"
  //     }
  //   }`;

  //   const response = await api.asApp().requestJira(route`/rest/api/3/issue`, {
  //       method: 'POST',
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json'
  //       },
  //       body: bodyData
  //     });

  //     console.log(`Response: ${response.status} ${response.statusText}`);
  //     console.log(await response.json());
  // }

  // async function generateTasks(generatedTasks) {
  //   for (const task of generatedTasks) {
  //     const { start_date, end_date, issue, assignees } = task;
  
  //     // Call the GenerateTask function for each task
  //     await GenerateTask(issue, `Description for ${issue}`, end_date, 'TEST');
  
  //     // You can also use the 'assignees' property to assign the task to specific team members.
  //   }
  // }

  const generateProjectPlan = async (formData) => {
    setNewFeature('');
    setNewTeamMember('');
    formData.features = features;
    formData.team = teamMembers;

    setFormState(formData)
    console.log('DATA --', formData)
    // // const { startDate, endDate, projectDescription } = formData;

    const generatedTasks = await invoke('generateProjectPlan', {
      start_date: formData.startDate, // Use the formData properties as arguments
      end_date: formData.endDate, // Use the formData properties as arguments
      project_description: formData.projectDescription, // Use the formData properties as arguments
      tech_stack: formData.stack,
      features: formData.features,
      team_members: formData.team,
    });
    console.log('Generated Project Result Plan:', generatedTasks)

    setFormState(formData);

    //generateTasks(generatedTasks)
  };

  return (
    <>
      <Form onSubmit={generateProjectPlan}>
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
          <Badge key={index} text={feature}/>
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
          <Badge key={index} text={member}/>
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