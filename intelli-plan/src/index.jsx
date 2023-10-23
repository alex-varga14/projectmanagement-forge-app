import api, { render, Fragment, Text, IssuePanel } from '@forge/ui';

async function GenerateTask(taskName, taskDescription, taskDueDate, projKey){
  var bodyData = `{
      "fields": {
         "project":
         {
            "key": "${projKey}"  
         },
         "summary": "${taskName}",
         "description": "${taskDescription}",
         "issuetype": {
            "name": "Task"
         }
         "duedate": "${taskDueDate}"
     }
  }`;

  const response = await api.asApp().requestJira(route`/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: bodyData
    });

    console.log(`Response: ${response.status} ${response.statusText}`);
    console.log(await response.json());
}

await GenerateTask("Develop UI", "Create Kivy GUI to display robot controls", "2023-10-24", "TEST");


const App = () => {
  return (
    <Fragment>
      <Text>Hello world!</Text>
    </Fragment>
  );
};

export const run = render(
  <IssuePanel>
    <App />
  </IssuePanel>
);


