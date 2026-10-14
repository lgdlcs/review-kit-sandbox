<!-- agentic-review-kit -->
## Shipping rules

- Never push to `main`. Every change goes through a PR opened with `/ship-pr`.
- Run `/pre-pr` before opening a PR. One PR = one concern, ideally < 400 changed lines.
- Every PR carries exactly one risk label:
  - `risk:low` — copy, styles, isolated UI, tests, docs.
  - `risk:medium` — behavior change in app logic, new dependency, refactor across files.
  - `risk:high` — auth, payments, data/migrations, secrets, infra/CI/deploy, or any one-way door.
- `risk:high` ships behind a flag (`FLAG_<NAME>` env var, off by default) and with a rollback plan. Only the human adds the `ship-it` label.
- Migrations are additive (expand → migrate → contract in separate PRs).

## No workaround comments

Agents copy what already exists. A comment explaining a hack teaches the next agent to write another hack.
- Do not write comments that explain a workaround, a temporary fix, or "do not touch". Fix the root cause, or encode the constraint in a type, test, or lint rule.
- Keep a comment only when it explains something we cannot change (browser quirk, third-party bug with a link, spec requirement).

## Friction

When you work around a broken script, wrong doc, flaky test or missing tool, say so. Before ending a session that changed code, run `/file-friction`.
<!-- /agentic-review-kit -->
