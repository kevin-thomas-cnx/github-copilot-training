Create INVEST-based user stories for both API and UI components following this structure:

### Ticket Format
- Prefix: "API: " or "UI: "
- Title: Short, descriptive summary
- Description sections:
  1. Overview
  2. User Story (AS A/I WANT TO/SO THAT)
  3. Acceptance Criteria
  4. Dependencies (UI tickets only)

### Requirements
1. API Stories:
   - Include URI parameters
   - Specify request/response bodies
   - Define HTTP status codes
   - Follow RESTful practices

2. UI Stories:
   - Separate story for each feature
   - Handle all API response scenarios
   - List API dependencies with METHOD/endpoint
   - Include error states

### Formatting
- Use Markdown
- Each section title on new line
- List items on separate lines
- Maintain specified carriage returns

Example Output:
```
# API: Create Task Endpoint

## Overview
Implement an API endpoint to allow users to create a new task within their project management application using a RESTful interface.

## User Story
**AS A** registered user  
**I WANT TO** create a task by providing all required details  
**SO THAT** I can track my pending work items in the system

## Acceptance Criteria
1. The endpoint is available at `POST /api/tasks`
2. The request body must contain:
   - `title` (string, required)
   - `description` (string, optional)
   - `due_date` (ISO8601 date, optional)
3. If request is valid, returns HTTP `201 Created` and created task object
4. If required fields missing/invalid, returns HTTP `400 Bad Request` with error messages
5. If user not authenticated, returns HTTP `401 Unauthorized`

## Dependencies
*None*
```

Note: Focus on completeness, error handling, and clear acceptance criteria.

---

#### Ticket Creation Instructions

- If the source of the requirements was an Epic issue from Jira, when finished, ask the user if they want to create tickets for the user stories generated from the Epic. If they confirm, create a ticket for each user story in the same project as the Epic, using the same prefix and format as above, and then update the Jira tickets, adding the Epic ticket as the parent.

- If the Epic was loaded from the file system, then the user story tickets should be created in the same folder as Markdown (`.md`) files.  
  - The filename should use the prefix `User-Story_`, followed by a set of lower case initials for the description of the epic (derived from the filename), then an underscore, then the kebab-case version of the user story title.
  - Example:  
    - Epic filename: `Epic_provide-hourly-weather-forecast.md`  
    - User story title: "Display Hourly Forecast"  
    - Resulting file: `User-Story_phwf_display-hourly-forecast.md`  
    - Another user story title: "Handle API Errors"  
    - Resulting file: `User-Story_phwf_handle-api-errors.md`

---