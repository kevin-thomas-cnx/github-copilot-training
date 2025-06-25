# Hands-On Guide

## Step 7. Refactor Code

### **Goal**

To refactor the code and apply DRY principles.
 

### **Steps**

1. Create a new chat session, selecting “**Keep & Continue**” when asked.

2. In the left-hand side _**EXPLORER**_ pane, right-click on the `/src` folder and select _**Copilot > Add Folder to Chat**_.

3. Start entering the following command into the Chat window, select the command from the menu, and hit **Enter:**  

   > `/refactor-dry`  

4. Copilot will refactor the code across several iterations. Each time it will run the unit tests and attempt to correct any issues.

5. Once complete, enter the following into the Chat window to run the unit tests:

   > _Execute the unit tests using the command `pnpm run test:unit`_

6. If the unit tests do not complete successfully, Copilot will attempt to correct the issues, asking you to rerun the unit test after each attempt.

   - This may require several iterations of changes and testing
   - Tests may also need to be updated to account for new test matching conditions.

7. Once Copilot is satisfied that the code has passed, run the unit tests once again to confirm that the refactored code is working as expected.


### **Outcome**

You'll see the code has been refactored to apply DRY principles and successfully tested.
 

### **Next**

* [Step 8: Documentation](step-8_documentation.md)

