---
name: pr-review
description: Review the current PR or diff. Produces a summary, flags
  assumptions, and highlights untested behaviour. Use whenever preparing
  to leave review comments on a pull request.
---

# PR Review

You are reviewing a pull request. Do the following, in order:

1. **Summary.** In three sentences, describe what this PR changes, what
   it's trying to achieve, and what it deliberately does not touch.

2. **Assumptions.** List the assumptions this code is making about the
   rest of the system. For each, note what would break if the assumption
   turned out to be wrong.

3. **Untested behaviours.** List the behaviours this PR introduces or
   changes. For each, note whether there is a test that would fail if
   the behaviour regressed.

4. **A second angle.** Re-read the diff as if you were the person on-call
   this weekend. What would you want to know before approving?

5. **Comment** If something seems wrong, add a comment to the PR to the corresponding code. 

6. **Reject.** If the PR has blocking issues, mark it rejected: submit a
   "Request changes" review summarizing the blocking issues. If the PR was
   opened by the current user, GitHub will refuse to let them review their
   own PR — in that case, ask the user how they want to record the
   rejection (e.g. closing the PR, or a plain comment) instead of silently
   skipping it.

Keep each section short. Quote specific lines or files where relevant.
