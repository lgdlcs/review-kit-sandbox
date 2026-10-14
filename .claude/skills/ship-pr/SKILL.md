---
name: ship-pr
description: Shepherd the current change to done — open the PR with a risk label, wait for CI and the Claude + CodeRabbit reviews, fix or answer every finding, then merge or park by risk. Use for /ship-pr, "ship this", "open a PR and get it merged".
---

# Ship PR

## 1. Open

1. If `/pre-pr` has not run on this diff, run it first.
2. On `main`? Create a branch `<type>/<short-name>` first. Never push to `main`.
3. Push, then `gh pr create --fill-first --body-file <drafted body> --label risk:<level>`.

## 2. Wait

Checks: `gh pr checks <n>`. Reviews: `gh pr view <n> --comments` and `gh api repos/{owner}/{repo}/pulls/<n>/comments`.
Do not tight-loop. Use `ScheduleWakeup` (~240s) or a `Monitor` on `gh pr checks <n> --watch`, then re-check.

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
- high → never merge. Comment a summary (what, flag name, rollback plan) and stop: "Parked, waiting for `ship-it`."
- If the human added `ship-it`, merge with `--squash`.

Then run `/file-friction`. Report: PR URL, findings fixed / declined, merged or parked.
