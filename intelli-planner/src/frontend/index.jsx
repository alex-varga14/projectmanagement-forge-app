import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Form, Text, TextField, DatePicker, } from '@forge/react';
import { invoke } from '@forge/bridge';

const App = () => {
  const [data, setData] = useState(null);

  // const [projectDescription, setProjectDescription] = useState("");
  // const [stack, setStack] = useState("");
  // const [projectDescription, setProjectDescription] = useState("");

  const [formState, setFormState] = useState(undefined);

  // Handles form submission
  const onSubmit = (formData) => {
    /**
     * formData:
     * {
     *    username: 'Username',
     *    products: ['jira']
     * }
     */
    setFormState(formData);
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
          name="features" 
          label="Features" 
        />
        <TextField 
          name="team" 
          label="Team Members" 
        />
        <Text>{data ? data : 'Loading...'}</Text>
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
