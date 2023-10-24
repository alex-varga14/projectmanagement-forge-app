import ForgeUI, { Form, Text, Strong, TextField, Button, Badge, DatePicker, render, Fragment, Text, IssuePanel, useProductContext, useState } from '@forge/ui';
import api, { route, fetch } from '@forge/api';

const callOpenAI = async (prompt) => {

  const choiceCount = 1;
  // OpenAI API endpoint
  const url = `https://api.openai.com/v1/chat/completions`;

  // Body for API call
  const payload = {
    model: getOpenAPIModel(),
    n: choiceCount,
    messages: [{
      role: 'user',
      content: prompt
    }]
  };

  // API call options
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getOpenAPIKey()}`,
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    body: JSON.stringify(payload)
  };

  // API call to OpenAI
  const response = await fetch(url, options);
  let result = ''

  if (response.status === 200) {
    const chatCompletion = await response.json();
    const firstChoice = chatCompletion.choices[0]

    if (firstChoice) {
      result = firstChoice.message.content;
    } else {
      console.warn(`Chat completion response did not include any assistance choices.`);
      result = `AI response did not include any choices.`;
    }
  } else {
    const text = await response.text();
    result = text;
  }
  return result;
}

// Get OpenAI API key
export const getOpenAPIKey = () => {
  return process.env.OPEN_API_KEY;
}

// Get OpenAI model
export const getOpenAPIModel = () => {
  return 'gpt-3.5-turbo';
  // return 'gpt-4';
}


const App = () => {

  const getComments = async (issueKey) => {

    // API call to get all comments of Jira issue with key 'issueKey'
    const commentsData = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}/comment`, {
        headers: {
            'Accept': 'application/json'
        }
    });
  
    const responseData = await commentsData.json();
    const jsonData = await responseData.comments
  
    let extractedTexts = [];
  
    // Extracting all texts in the comments into extractedTexts array
    await jsonData.map(comment => {
      if (comment.body && comment.body.content) {
        comment.body.content.map(contentItem => {
          if (contentItem.type === "paragraph" && contentItem.content) {
            contentItem.content.map(textItem => {
              if (textItem.type === "text" && textItem.text) {
                extractedTexts.push(textItem.text);
              }
            });
          }
        });
      }
    });
  
    return extractedTexts.join(' ');
  }

  // Getting the issue key in the context.
  const context = useProductContext();
  const issueKey = context.platformContext.issueKey;

  // Getting all the comments of the issue key.
  const [comments] = useState(async () => {
    return await getComments(issueKey);
  });

  console.log("Comments - " + comments)

  // ChatGPT prompt to get the summary
  const prompt = `Here is a sample data where all the comments of a jira issue is joined together: 
  "${comments}". I want to summarize this in a way that anybody can get an idea what's going on in this issue without going through all the comments. Create a summary or TLDR for this.`

  // OpenAI API call to get the summary.
  const [summary] = useState(async () => {
    return await callOpenAI(prompt);
  });

  console.log("Summary - " + summary)

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

export const run = render(
  <IssuePanel>
    <App />
  </IssuePanel>
);
