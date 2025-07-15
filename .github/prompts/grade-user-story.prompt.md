Complete the following two tasks in order.

CONTINUE EXECUTING STEPS UNTIL TASK 2 STEP 6 WHERE YOU ASK THE USER IF THEY WANT TO UPDATE THE USER STORY IN JIRA WITH THE RECOMMENDED UPDATES.

# Task 1 - Grade the User Story

- Task: Grade the user story against the "Definition of Ready". Provide reasoning for the grading decision and recommended updates.
- Input: Summary, description, story points, and requirements sign-off fields of the user story, and the ticketKey, summary and description of any sub-tasks of the user story, along with the "Definition of Ready" (DoR) document. The DoR is retrieved from the Atlassian MCP Server using the getConfluencePage tool and a page ID of `87752705`
- Output: Grading summary table, overall score, and list of recommendations
- Requirements: Ensure each criterion is graded accurately and provide clear reasoning and actionable recommendations. Handle cases where the input information is incomplete or missing.
- Steps:
    1. Receive the summary, description, story points, and requirements sign-off fields of the user story, and the ticketKey, summary and description of any sub-tasks of the user story, along with the "Definition of Ready" document
    2. If the user story or "Definition of Ready" document is incomplete or missing, return an error message.
    3. Evaluate the user story against each criterion in the "Definition of Ready" document.
    4. For the INVEST best practices, evaluate the ticket against INVEST and DECIDE if the ticket likely meets those characteristics. Do not simply add an action to evaluate each one. Use your best judgement.
    4. Assign a score from 0.1 to 1.0 for each criterion.
    5. Provide reasoning for each score and recommend updates where necessary.
    6. Compile the grading summary table with columns for criterion, score, reasoning, and recommendations.
    7. Calculate the overall score (e.g., 14.0 / 15.0).
    8. Provide a list of recommendations.
    9. Return the grading summary table, overall score, and list of recommendations.

# Task 2 - Recommend an updated User Story

- Task: Apply the recommended changes to the user story.
- Input: Summary and description fields of the user story, and list of recommendations from the User Story Grading Agent
- Output: Updated summary and description fields of the user story
- Requirements: Ensure all recommended changes are applied accurately. If a change cannot be made, write an italicized action in place of the missing element. Handle cases where recommended changes cannot be applied.
- Steps:
    1. Receive the summary and description fields of the user story and the list of recommendations.
    2. Apply the recommended changes to the user story.
    3. For changes that cannot be made, write an italicized action (e.g., *Requires a link to the copy dictionary*) in place of the missing element.
    4. If changes cannot be applied due to missing elements, return an error message.
    5. Return the updated summary and description fields of the user story.
    6. Ask the user if they want to update the user story in Jira with the recommended updates

- Output format:
A best practice story format is as follows:

## Overview
  
_Intent behind the system story_
  
## User Story
  
*AS A* <user type>
*I WANT TO* <action>
*SO THAT* <outcome>
  
## Acceptance Criteria
  
1. <testable acceptance criteria>

## Designs and copy

- <Links to one or more design assets. If not provided, provide a placeholder that says _Placeholder for links to designs and copy_>

## Dependencies

- <List of dependencies, including links to dependency documentation such as API specs. If not provided, and required by the store, provide a placeholder that says _Placeholder for links to dependencies_>

## Analytics requirements

1. <list of analytics acceptance criteria *or* a link to requirements documented elsewhere. If not provided, show a placeholder that says _Placeholder for links to analytics requirements_)

## Actions

- [ ] <List of actions to perform, repeating all of the italicised instructions from above>

EXAMPLE
For example, if the ticket is missing designs, and no mention is made of test data, you'd see the following on the ticket:

## Designs and copy

- _Placeholder for links to dependencies_

## Actions

- [ ] Add design and copy links
- [ ] Define or ensure the availability of test data.

