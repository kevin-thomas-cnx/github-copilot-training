# GitHub Copilot Training

## Example Projects


This repository provides the same example weather app implemented in two different technology stacks. Each app has its own documentation:


- **React + Next.js** ([app folder](apps/react-nextjs), [documentation](apps/react-nextjs/README.md))
- **Angular + Spring Boot** ([app folder](apps/angular-springboot), [documentation](apps/angular-springboot/README.md))

You can use either project with the hands-on exercises below. The exercises are designed to be technology-agnostic and work with both implementations.

## Hands-On Exercises

To help you get familiar with GitHub Copilot, this project includes a set of hands-on exercises. These exercises will guide you through setup, user story generation, implementation planning, API coding, and more—all using Copilot's features.

Start with the first exercise: [Exercise 0: Setup](hands-on-exercises/exercise-0_setup.md)

---



## API Endpoints

### Hourly Forecast

- **GET** `/api/v1/forecast/hourly?lat={latitude}&lon={longitude}`
  - Returns a 24-hour hourly weather forecast for the specified location.
  - Query parameters:
    - `lat` (number, required): Latitude
    - `lon` (number, required): Longitude
  - Response: `{ hourly: [ { time, temperature, precipitation, condition } ] }`

---

## VS Code Extensions

This project recommends the following VS Code extensions (see `.vscode/extensions.json`):

- **SonarLint** (`SonarSource.sonarlint-vscode`): Linting and code quality analysis
- **Mermaid Preview** (`vstirbu.vscode-mermaid-preview`): Preview Mermaid diagrams
- **Jest** (`Orta.vscode-jest`): Jest test integration for VS Code

---

## Copilot Customizations

All Copilot custom instructions are now managed in modular files under `.github/instructions/` and referenced in `.vscode/settings.json`.

See the `.github/instructions/` directory for details on each instruction type.

---

## Provided Copilot Prompts

Custom Copilot prompts are managed in the `.github/prompts/` directory. Each prompt is modular and can be updated or extended as needed. Use the Copilot Chat forward slash (/) command in VS Code to access available prompts. The set of prompts is regularly expanded—check the `.github/prompts/` directory for the most up-to-date list.

Below is a detailed, alphabetized list of available prompts:

| Slash Command                   | What it Does                                                                                 |
|---------------------------------|---------------------------------------------------------------------------------------------|
| `/commit-message`               | Generates a conventional commit message from staged changes and runs the commit command.     |
| `/document-react-components`    | Adds comprehensive TSDoc comments and usage examples to React component code.                |
| `/document-typescript-code`     | Adds detailed TSDoc comments and usage examples to TypeScript or JavaScript code.            |
| `/implementation-plan`          | Produces a step-by-step, actionable implementation plan for a user story, including tests and dependencies. |
| `/logical-architecture-diagram` | Creates a Mermaid.js diagram visualizing the application's architecture, styled by component type. |
| `/refactor-dry`                 | Reviews code for duplication and suggests DRY (Don't Repeat Yourself) improvements with examples. |
| `/refactor-solid`               | Reviews code for SOLID principle violations and suggests actionable refactoring with explanations. |
| `/sequence-diagram`             | Generates a Mermaid.js sequence diagram using a structured template and best practices.      |
| `/user-stories`                 | Produces INVEST-based user stories for API and UI components, with clear formatting and acceptance criteria. |

For the latest list and details, see the `.github/prompts/` directory.

---

## Custom Chatmodes

The `.github/chatmodes/` folder defines specialized Copilot Chatmodes for different tasks. Here’s a summary:

| Chatmode         | Description                                                                                                    |
|------------------|----------------------------------------------------------------------------------------------------------------|
| Prompt Designer  | Expert in prompt engineering. Refines prompts for clarity, specificity, and effectiveness. Never executes code. |
| Clean Code Bot   | Senior engineer focused on Clean Code and SOLID principles. Identifies code smells, refactors, and explains changes. |
| Plan             | Generates implementation plans for features or refactoring, including requirements, steps, and tests. Does not edit code. |
| Test Writer      | Specialist in writing high-quality unit and integration tests, covering edge cases and using best practices.     |
| Explainer        | Breaks down code and concepts in plain English, using analogies and examples, tailored to the user’s experience. |
| Security Scout   | Security-focused reviewer who scans for vulnerabilities, suggests safer alternatives, and explains risks.        |
| 4.1 Beast Mode v3       | An opinionated, research-driven workflow with todo lists, planning, and advanced tool usage for thorough problem solving. |

To activate a chatmode, select it from the Copilot Chat interface or use the appropriate command if supported.

---

For more details, see the documentation in each folder or file.
