# Implementation Plan Generation Prompt

You are an expert software engineer. Your task is to generate a clear, actionable implementation plan for the following user story.

**Instructions:**
- The plan should be based on the provided user story and its testable acceptance criteria.
- Break down the work into logical, sequential steps.
- For each step, specify:
  - What needs to be done
  - Why it is necessary
  - Any dependencies or prerequisites
- If any existing specification documents are found in the project, include a step to update them as needed.
- Include steps for creating appropriate unit or end-to-end tests, following the conventions in `/tests/unit` and `/tests/e2e`.
- Highlight any areas that require clarification or further input from the user.
- The plan should be easy to review and update.
- Output the plan in Markdown format.
- **When generating the implementation plan, analyze and utilize the full context of the existing application, including its code structure, modules, utilities, and established patterns. Reference or reuse existing code and conventions wherever appropriate to ensure consistency and avoid duplication.**

**File Naming:**
- Save the plan in the `./implementation-plan` folder.
- Name the file using the Jira ticket key and the ticket summary in kebab-case, escaping any special characters as needed (e.g., `ABC-123-add-login-form.md`).

---

## User Story

{Insert user story here}

## Acceptance Criteria

{Insert acceptance criteria here}

---

## Implementation Plan

1. **Step 1:**  
   - **What:**  
   - **Why:**  
   - **Dependencies:**  

2. **Step 2:**  
   - **What:**  
   - **Why:**  
   - **Dependencies:**  

...

---

## Questions / Clarifications

- [ ] (List any questions or points needing clarification here)