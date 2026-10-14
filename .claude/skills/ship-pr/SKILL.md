---
name: ship-pr
description: Shepherd the current change to done — open the PR with a risk label, wait for CI and the Claude + CodeRabbit reviews, fix or answer every finding, then merge or park by risk. Use for /ship-pr, "ship this", "open a PR and get it merged".
---

# Ship PR

## 1. Open

1. If `/pre-pr` has not run on this diff, run it first.
2. On `main`? Create a branch `<type>/<short-name>` first. Never push to `main`.
3. Push, then `gh pr create --fill-first --body-file <drafted body> --label risk:<level>`.

### Stack (split work)

When `/pre-pr` split the work, ship it as a stack:
- Branch `stack/<name>/1-<step>`, `stack/<name>/2-<step>`, and so on. Each one is branched from the previous one.
- PR 1 targets `main`. PR n targets PR n-1's branch, so each diff shows only its own step.
- Title prefix `[n/N]`. The body links the previous and next PRs.
- Ship bottom-up. When PR n merges (squash), rebase PR n+1 onto `main` (`git rebase --onto main <old-base> <branch>`), run `gh pr edit <n+1> --base main`, force-push the branch (`--force-with-lease`), then wait again.
- Never merge PR n+1 before PR n. If PR n gets changes, rebase the branches above it.

## 2. Wait

Checks: `gh pr checks <n>`. Reviews: `gh pr view <n> --comments` and `gh api repos/{owner}/{repo}/pulls/<n>/comments`.
Do not tight-loop. Use `ScheduleWakeup` (~240s) or a `Monitor` on `gh pr checks <n> --watch`, then re-check.

If CodeRabbit's comment says the review was skipped (small public repo, plan limit), post `gh pr comment <n> --body "@coderabbitai review"` once per head SHA. If it is skipped again on that SHA, treat CodeRabbit as unavailable: park the PR and report it, do not merge a medium/high PR without it.

Reviewers by risk:

| risk   | needs before merge |
|--------|--------------------|
| low    | CI green |
| medium | CI green + Claude review and CodeRabbit posted, no unresolved blocking finding |
| high   | everything above + human adds `ship-it` label |

## 3. Handle findings

For every bot comment (Claude review, CodeRabbit, CI failure):
- Valid → fix, push, reply `Fixed in <sha>: <one line>`.
- Not valid → reply `wontfix: <reason>` or `accepted: <reason>`. Never ignore silently.
- CI red → read the log (`gh run view --log-failed`), fix the root cause. Never skip, disable, or retry-until-green a test.

Re-wait after each push.

## 4. Finish

- low / medium → `gh pr merge <n> --squash --delete-branch` once the table above is satisfied.
- high or `large-ok` → never merge. Comment a summary (what, flag name, rollback plan) and stop: "Parked, waiting for `ship-it`."
- If the human added `ship-it`, merge with `--squash`.

Then run `/file-friction`. Report: PR URL, findings fixed / declined, merged or parked.
