# Next.js Weather App

A modern weather application built with Next.js, React, and TypeScript. This project provides real-time weather forecasts and location search with a focus on code quality, testing, and developer experience.

## Features
- Search for weather by location
- View weekly forecasts
- Modern UI with error handling
- Comprehensive unit and e2e test coverage

---

## Getting Started

### Windows

1. **Install Node.js**
   - Download the LTS version from [nodejs.org](https://nodejs.org/en/download/).
   - Follow the installer instructions.
   - Verify installation:
     ```powershell
     node --version
     npm --version
     ```

2. **Check if `pnpm` is installed**
   ```powershell
   Get-Command pnpm
   ```
   If you see a command path, `pnpm` is installed. If not, continue below.

3. **Install `pnpm` using Chocolatey**
   - If you don't have Chocolatey, see [Chocolatey Installation Guide](https://chocolatey.org/install).
   - To install pnpm:
     ```powershell
     choco install pnpm
     ```
   - pnpm docs: [https://pnpm.io/installation](https://pnpm.io/installation)

4. **Install dependencies**
   ```powershell
   pnpm install
   ```

5. **Install Playwright browsers**
   ```powershell
   pnpm exec playwright install
   ```
   - Playwright docs: [https://playwright.dev/docs/intro](https://playwright.dev/docs/intro)

---

### macOS

1. **Install Node.js**
   - Install Node.js using Homebrew:
     ```zsh
     brew install node
     ```
   - If you don't have Homebrew, see [Homebrew Installation Guide](https://brew.sh/).
   - Verify installation:
     ```zsh
     node --version
     npm --version
     ```

2. **Check if `pnpm` is installed**
   ```zsh
   command -v pnpm
   ```
   If you see a path, `pnpm` is installed. If not, continue below.

3. **Install `pnpm` using Homebrew**

   - To install pnpm:
     ```zsh
     brew install pnpm
     ```
   - pnpm docs: [https://pnpm.io/installation](https://pnpm.io/installation)

4. **Install dependencies**
   ```zsh
   pnpm install
   ```

5. **Install Playwright browsers**
   ```zsh
   pnpm exec playwright install
   ```
   - Playwright docs: [https://playwright.dev/docs/intro](https://playwright.dev/docs/intro)

---

## Running the App

To start the development server:
```sh
pnpm dev
```

To run unit tests:
```sh
pnpm test:unit
```

To run e2e tests:
```sh
pnpm test:e2e
```

---

## VS Code Extensions

This project recommends the following VS Code extensions (see `.vscode/extensions.json`):

- **SonarLint** (`SonarSource.sonarlint-vscode`): Linting and code quality analysis
- **Mermaid Preview** (`vstirbu.vscode-mermaid-preview`): Preview Mermaid diagrams
- **Jest** (`Orta.vscode-jest`): Jest test integration for VS Code

---

## Copilot Customizations

See `.github/copilot-instructions.md` for custom Copilot instructions, including:
- Testing philosophy (Jest, unit test focus, 80%+ coverage)
- Commit message guidelines (Conventional Commits)
- Problem-solving approach (suggest fix, then explain root cause)

These help ensure consistent code quality and collaboration.

---

## Provided Copilot Prompts

This project includes custom prompts in `.github/prompts/` that you can use via the Copilot Chat forward slash (/) command in VS Code. Each prompt provides a specialized workflow:

| Slash Command | What it Does |
|--------------|-------------|
| `/sequence-diagram` | Generates a Mermaid.js sequence diagram using a structured template. Useful for visualizing system interactions. |
| `/user-stories` | Produces INVEST-based user stories for API and UI components, with clear formatting and acceptance criteria. |
| `/logical-architecture-diagram` | Creates a Mermaid.js logical architecture diagram, styled and grouped by component type, based on the actual codebase. |

To use a prompt, type `/` in Copilot Chat and select the desired command.

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

To activate a chatmode, select it from the Copilot Chat interface or use the appropriate command if supported.

---

For more details, see the documentation in each folder or file.
