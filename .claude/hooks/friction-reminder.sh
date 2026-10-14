#!/usr/bin/env bash
input=$(cat)
[ "$(jq -r '.stop_hook_active // false' <<<"$input")" = "true" ] && exit 0
session=$(jq -r '.session_id // "none"' <<<"$input")
git rev-parse --git-dir >/dev/null 2>&1 || exit 0
marker="$(git rev-parse --git-dir)/claude-friction-$session"
[ -e "$marker" ] && exit 0
base=$(git rev-parse --verify -q origin/main || git rev-parse --verify -q main) || exit 0
if git diff --quiet "$base" -- 2>/dev/null; then exit 0; fi
touch "$marker"
echo "This session changed code. Before stopping, run /file-friction: report anything you had to work around. If nothing qualifies, say so in one line." >&2
exit 2
