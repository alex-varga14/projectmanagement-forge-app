import jira.client
from jira.client import JIRA

EMAIL='domvandekerkhove@gmail.com'
SITE='http://dom-test-site.atlassian.net'
SERVER="https://dom-test-site.atlassian.net"
API_KEY='ATATT3xFfGF0evHHFRoEPe8fYZ6aG6fPF10MXBAiYbLhSTk8tOsmcR8ys1wIWXUEmGneYf_lv_sx6mgujHRiMElkYMu-sO2a7mGLwPQD08LFgaBAd-vqe1gQpk7iijBSU065RUKvMlyUusWi32BwIWc7zVCmaT4zVz8awj9RcOxEOF8REHvNyvk=8610F6FF'

class JiraControls():
    def authenticate(self, site, email, server):
        self.options = {'server' : site}
        self.jira = JIRA(
            basic_auth=(email, API_KEY),
            server=server
        )

    def generate_issue(self, name, description, start, end, assignee, key):
        # Create a new epic with the given name and description
        ticket_options = {
            'project': {'key': key},
            'summary': name,
            'description': description,
            'issuetype': {'name': 'Epic'},
            # 'startdate': start,
            'duedate': end,
            'assignee': 'assignee'
        }

        epic = self.jira.create_issue(fields=ticket_options)
        return epic

def main():
    jc = JiraControls()
    jc.authenticate(SITE, EMAIL, SERVER)
    jc.generate_issue('Parent Issue', 'Develop a user interface for the app', 'UI', '2023-10-22', '2023-10-25', 'Dom', 'TEST')

if __name__ == "__main__":
    main()