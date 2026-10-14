# Release and rollback

Goal: when something breaks in production, it breaks small and comes back fast.

## Path to production

1. Branch → PR with a `risk:*` label (`/ship-pr`).
2. CI (`ci`, `pr-guard`) + reviews (Claude, CodeRabbit) per risk:

   | risk   | merge when |
   |--------|------------|
   | low    | CI green |
   | medium | CI green + both reviews posted, no unresolved `[blocking]` |
   | high   | the above + human adds `ship-it` |

3. Check the preview deployment of the PR (Vercel/Netlify) before merging anything user-facing.
4. Squash-merge to `main` → production deploy.

## Feature flags (risk:high)

Ship dark, turn on later. A flag is an env var, off by default:

```ts
export const isOn = (name: string) => process.env[`FLAG_${name}`] === "1";
```

Merge with the flag off, deploy, set `FLAG_<NAME>=1` in the host's env, redeploy. Turning it off again is the fastest rollback. Delete the flag and the old path in a follow-up PR once it has been stable for a week.

## Rollback

1. Flagged change → set `FLAG_<NAME>=0`, redeploy.
2. Vercel → Deployments → previous production deploy → **Instant Rollback**.
3. Otherwise → `git revert <squash-sha>` in a PR labeled `risk:low`, merge.

## Database changes

Expand → migrate → contract, in separate PRs:
1. Add the new column/table (nullable, unused).
2. Write to both, backfill, read from new.
3. Remove the old one, only after (2) has been in production without rollback.

Never drop or rename in the same PR as the code that stops using it.
