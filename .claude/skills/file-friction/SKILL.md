---
name: file-friction
description: At the end of a session, report what you had to work around (broken scripts, wrong docs, flaky tests, missing tools) and file the durable ones as GitHub issues labeled `friction`. Use for /file-friction or before ending a session that changed code.
---

# File friction

Agents don't complain, they work around. This is where you complain.

1. List every workaround from this session: a command that failed and you tried another, a doc that was wrong, a test you had to rerun, a setup step you guessed, a type you had to cast.
2. Keep only **durable** friction: it will hit the next agent too, it reproduces, and someone can fix it in the repo. Drop one-off confusion and your own mistakes.
3. Check for duplicates: `gh issue list --label friction --state open --search "<keywords>"`. Comment `+1 <context>` on a match instead of filing a new one.
4. File each new one:
   `gh issue create --label friction --title "<what hurts, in 8 words>" --body "<what you tried, what happened, the exact command/error, suggested fix>"`
5. If nothing qualifies, say "No durable friction" and file nothing.

Reply with the list (filed / +1'd / dropped and why).
