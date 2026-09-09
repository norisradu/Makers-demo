---
name: write-tests
description: Generate unit tests for a target function, class, or module. Focus on meaningful behaviour coverage rather than implementation details.
---

# Write Tests
Generate tests for the specified function, class, or module.

Guidelines:
 
- Prioritize behaviours over implementation details.
- Cover happy paths.
- Cover error paths.
- Cover boundary conditions.
- Cover interactions with dependencies.
- Do not create redundant tests.
- Prefer simple, maintainable tests.
- If behaviour is unclear, note the assumption before writing the test.
 
For each test:
 
- Provide a short descriptive test name.
- Explain what behaviour is being verified.
- Write the test code.
 
If important behaviours appear untested after the test suite is generated, list them under **Additional Test Candidates**.
``