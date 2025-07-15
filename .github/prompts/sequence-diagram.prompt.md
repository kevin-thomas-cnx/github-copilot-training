Use the following mermaid.js format when creating the sequence diagram definition:

%%{init: {'theme': 'default'}}%%
sequenceDiagram
%% Defining the actors
actor User
participant SystemA as System A
participant SystemB as System B
%% Description of the action
User->>SystemA: Request to perform action
note right of SystemA: User initiates a <br/> request to perform <br/> said action
SystemA->>SystemB: HTTP METHOD /URI-of-endpoint
note right of SystemB: System Beta performs <br/> business logic <br/> to perform said action
SystemB->>SystemA: Returns data for said action
SystemA->>User: Display list of pets
note left of User: User views output <br/> from description <br/> of output from <br/> system A

In the notes to the left and right of actors in the sequence diagram, use a "\<br\>" linebreak character to ensure the notes are within 20-30 characters long per line.

Create a new file under the `./diagrams/` directory (create the folder if it doesn't already exist). Name the file using kebab case and ensure it has a `.mmd` extension.

Return all of the actions in one single block of code.

---

## Mermaid.js Syntax Requirements

* When listing participants, do not use quotes around the participant names. For example:

-- This is incorrect: `participant SystemA as "System A"`
-- This is incorrect: `participant SystemA as System A`

DO NOT PUT QUOTES AROUND PARTICIPANT NAMES!!

* All node text and labels containing spaces, hyphens, special characters (e.g., `&`, `/`, `!`, `?`), or non-alphanumeric characters **must be enclosed in double quotation marks** (e.g., `node_id["Node Label with Spaces"]`, `decision_point{"Is it True?"}`).
    * If a label *itself* needs to contain a double quotation mark, it **must be escaped** using a backslash (`\"`) within the main double-quoted string (e.g., `node_id["A label with an escaped \"quote\" inside"]`).
    * For certain characters that might interfere with Mermaid.js parsing or are difficult to type, consider using their HTML entity equivalents within labels (e.g., `&amp;` for `&`, `&lt;` for `<`, `&gt;` for `>`). This is especially useful for characters that could be interpreted as part of Mermaid's syntax.
* Every node referenced in connections **must be explicitly defined** with a unique ID and its content/shape. Ensure all opening parentheses, brackets, and braces are correctly matched and closed. Use **single brackets** for node definitions (e.g., `nodeId["Node Label"]`).
* If a word that could be a Mermaid.js keyword (e.g., `end`, `state`, `direction`) is intended as plain text within a label, **it must be enclosed in double quotation marks** (e.g., `process["End of Flow"]`).
* Pay meticulous attention to spelling, spacing, and character usage.
* Every Mermaid.js code block **must begin** with its explicit diagram type declaration (e.g., `graph TD`, `sequenceDiagram`, `classDiagram`).
* Use `<br/>` HTML tag for line breaks within labels.
* Maintain consistent spacing between sections.
* **All styling definitions (e.g., `style`, `classDef`, `linkStyle`) must be placed at the very end of the diagram code block, after all node and relationship declarations.**