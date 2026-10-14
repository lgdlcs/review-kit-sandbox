---
name: pre-pr
description: Review the current branch before opening a PR — bugs, workaround comments, blast radius — then pick a risk level and draft the PR body. Use before /ship-pr, or when asked "is this ready", "review my changes before PR".
---

# Pre-PR review

Scope: `git diff main...HEAD` plus the working tree. If the diff is empty, stop and say so.

## 1. Size

Count changed lines (`git diff --stat main...HEAD`). Above 400, propose a split into independent PRs (each one shippable on its own) and stop until the user picks.

## 2. Bugs

Run the `code-review` skill at `high` on the diff. Fix every confirmed correctness finding. Re-run the tests the project has.

## 3. Workaround comments

Spawn the `pstack:Comment Sicko` agent on the diff (fall back to a `general-purpose` agent with the "No workaround comments" rules from CLAUDE.md if it is not installed). For each accepted finding: fix the root cause or delete the dead path. Never keep a comment that explains our own hack.

## 4. Risk

Pick one label using CLAUDE.md. When unsure between two, pick the higher. Name whether the change is a **one-way door** (hard to reverse: data deletion, public API, migrations, emails sent) or a **two-way door**.

## 5. Blast radius (medium and high only)

Listing callers is not the job. Find what breaks *outside* the diff:
- Consumers grep misses: JSON shapes, DB columns, env vars, URLs, feature flags, cron jobs, other repos.
- Find the **one fact** the change is safe because of. Prove it by running real code (a small script or test that fails loud if you are wrong). Paste the output. If you cannot prove it, write `unproven`.

## 6. Draft the PR body

Fill `.github/pull_request_template.md`. The "Verified by" section shows commands you actually ran and their output, not intentions.

Reply with: size, findings fixed, risk + door type, the safety fact (proven/unproven), and the drafted body.
