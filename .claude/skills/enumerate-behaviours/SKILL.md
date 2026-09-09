---
name: enumerate-behaviours
description: Before writing tests, identify the behaviours of a target function or module that should be covered by tests.
---
 
# Enumerate Behaviours
 
Analyze the target function or module and produce a list of behaviours that should be tested.

Do not write any test code.

For each behaviour, create a separate entry.

Include:

- Happy paths
- Error paths
- Boundary conditions
 
Guidelines:

- Boundaries and interactions must have their own entries.
- If a behaviour is not clearly defined by the code, mark it as **Assumed** and explain what assumption is being made.
- Be specific and concise.
- Focus on observable behaviour rather than implementation details.

For each behaviour, indicate whether a test should exist to verify it.
Do not write test code.

Output format:

### Happy Paths

- ...

### Error Paths

- ...

### Boundary Conditions

- ...

### Interactions

- ...

### Assumptions

- ...