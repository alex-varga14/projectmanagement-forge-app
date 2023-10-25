import jira.client
from jira.client import JIRA

#from dotenv import load_dotenv

EMAIL='alexanderv1414@gmail.com'
SITE='http://intelli-plan.atlassian.net'
SERVER="https://intelli-plan.atlassian.net"
API_KEY='ATATT3xFfGF0rYABLUSXz389Qz4N0QscxRr-cUdcVBOwYsngh20R6fGcNeCD8McIRfMfSaHhHry2aAFC2K9mP74fvCXbi5e2LFJfsHayAACRNC26AeC_WaA7aqnDXPZyrEzGLvA-X2FB6Ce9XZugT3X2wn1RYLmxMQxGEqx0YSxhWY9yO_gc94I=B74F6D0B'

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