import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Form, Text, Strong, TextField, Button, Badge, DatePicker, } from '@forge/react';
import { invoke } from '@forge/bridge';

// async function GenerateTask(taskName, taskDescription, taskDueDate, projKey){
//   var bodyData = `{
//       "fields": {
//          "project":
//          {
//             "key": "${projKey}"  
//          },
//          "summary": "${taskName}",
//          "description": "${taskDescription}",
//          "issuetype": {
//             "name": "Task"
//          }
//          "duedate": "${taskDueDate}"
//      }
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

// await GenerateTask("Develop UI", "Create Kivy GUI to display robot controls", "2023-10-24", "TEST");

const App = () => {
  const [data, setData] = useState(null);

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

  const removeTeamMember = (index) => {
    const updatedTeamMembers = [...teamMembers];
    updatedTeamMembers.splice(index, 1);
    setTeamMembers(updatedTeamMembers);
  };

  const addFeature = () => {
    if (newFeature) {
      setFeatures([...features, newFeature]);
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    const updatedFeatures = [...features];
    updatedFeatures.splice(index, 1);
    setFeatures(updatedFeatures);
  };

  // Handles form submission
  const onSubmit = (formData) => {
    /**
     * formData:
     * {
     *    username: 'Username',
     *    products: ['jira']
     * }
     */
    setNewFeature('');
    setNewTeamMember('');
    formData.features = features;
    formData.team = teamMembers;
    setFormState(formData);
    console.log(formData)
  };

  const generateProjectPlan = async () => {
    const result = await invoke('generateProjectPlan', {
      start_date,
      end_date,
      project_description,
      tech_stack,
      features,
      team_members: teamMembers,
    });

    console.log('Generated Project Plan:', result);
  };

  useEffect(() => {
    invoke('getText', { example: 'my-invoke-variable' }).then(setData);
  }, []);
  return (
    <>
      <Form onSubmit={onSubmit}>
        <DatePicker
            name="startDate"
            label="Start Date"
            //description="Appointment must be made 1 day in advance"
            onChange={(value) => console.log(value)}
          />
        <DatePicker
            name="endDate"
            label="End Date"
            //description="Appointment must be made 1 day in advance"
            onChange={(value) => console.log(value)}
        />
        <TextField
          label="Project Description"
          name="projectDescription"
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
          <Badge key={index} text={feature}>
            <Button text="x" onClick={() => removeFeature(index)} />
          </Badge>
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
          <Badge key={index} text={member}>
            <Button text="x" onClick={() => removeTeamMember(index)} />
          </Badge>
        ))}
        <Button appearance="primary" onClick={generateProjectPlan}>
          Generate Project Plan
        </Button>
      </Form>
      {formState && <Text>{JSON.stringify(formState)}</Text>}
      <Text><Strong>{data ? data : 'Loading...'}</Strong></Text>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
