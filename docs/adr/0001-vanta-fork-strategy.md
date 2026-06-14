# ADR 0001 — Vanta Fork Strategy: Branch Model, Upstream Sync & CI Cleanup

> **Status:** Accepted · **Date:** 2026-06-14 · **Owner:** Sp3ct3R / Vanta Labs
> **Repo:** `github.com/Th3Sp3ct3R/lobehub` (fork of `lobehub/lobehub`)
> **Applies to:** how we customize LobeHub without breaking upstream merges or CI.

---

## Context

We run a fork of LobeHub (`Th3Sp3ct3R/lobehub`) so we can self-host and own our
own data (the upstream project is open source; our data currently lives in
LobeHub Cloud). LobeHub ships **fast** — it's an 85-package pnpm monorepo that
moves dozens of commits between releases. If we edit core files in place, every
upstream sync becomes a merge-conflict fight and CI breaks. This ADR fixes the
branch model, the sync ritual, and the CI posture **before** we write custom code,
while the fork is still a clean mirror (0 custom commits).

## Decision

### 1. Two-branch model

| Branch   | Role                                           | Rule                                                               |
| -------- | ---------------------------------------------- | ------------------------------------------------------------------ |
| `canary` | **Pristine mirror of `upstream/canary`**       | Only ever fast-forwarded. **Never commit here.**                   |
| `AzA`    | **Our work branch** (all Vanta customizations) | Default branch on GitHub. Merge `canary` into it to take upstream. |

- `origin` = `Th3Sp3ct3R/lobehub` (our fork). `upstream` = `lobehub/lobehub` (push disabled).
- **`AzA` is the GitHub default branch** — PRs and new clones target it.

### 2. Layering rule — never edit upstream files in place

Customizations go into **new** surfaces so the merge surface stays \~zero:

1. **New packages** — `packages/lobe-vanta-*` (added to `pnpm-workspace.yaml`).
2. **New feature dirs** — `src/features/<Vanta…>/` rather than modifying existing features.
3. **Thin wrappers / config overrides** — wrap upstream modules; don't patch them.

The Claude Code hooks enforce the instinct (see §4).

### 3. Upstream sync ritual

```bash
# 1. Refresh the mirror (fast-forward only — never a merge commit on canary)
git fetch upstream
git checkout canary && git merge --ff-only upstream/canary
git push origin canary

# 2. Take upstream into our work branch
git checkout AzA && git merge canary
#    → conflicts can ONLY occur in files WE touched (see layering rule)
git push origin AzA
```

Prefer doing step 2 as a **PR** (`canary → AzA`) so the sync is reviewable.
A scheduled `upstream-sync` workflow can open that PR automatically (see §4).

### 4. Claude Code drift hooks (already in place)

Configured in `.claude/settings.local.json`, scripts in `~/.claude/hooks/`:

- **`lobehub-drift-check.sh`** (SessionStart) — fetches upstream, reports how many
  commits behind `upstream/canary` we are, caches the changed-file list. _Awareness only — it does not merge._
- **`lobehub-edit-guard.sh`** (PreToolUse Edit|Write) — warns (never blocks) when a
  file we're editing also changed upstream, i.e. raises conflict risk; nudges toward a new file.

> These are **passive guardrails**, not a sync mechanism. The actual sync is the
> manual/PR ritual in §3.

### 5. CI/CD cleanup (the real breakage risk)

The fork inherited **\~30 upstream workflows** (`.github/workflows/`). Several are
`schedule:`-cron or release/build jobs that need **upstream-only secrets**
(`ANTHROPIC_API_KEY`, code-signing, registries) and will **fail nightly** on the fork.

**On `AzA`, remove or neuter what we don't own:**

- [ ] **Disable Actions on the fork** (Settings → Actions → "Disable actions") _or_ delete the workflows below on `AzA`.
- [ ] Delete cron/maintenance workflows we don't run:
      `auto-i18n.yml`, `claude-auto-testing.yml`, `claude-auto-e2e-testing.yml`,
      `claude-translate-comments.yml`, `claude-translator.yml`, `claude-dedupe-issues.yml`,
      `claude-issue-triage.yml`, `claude-migration-support.yml`, `claude-pr-assign.yml`,
      `lock-closed-issues.yml`, `issue-auto-*.yml`, `revalidate-docs.yml`,
      `sync-main-to-canary.yaml`, `release-*.yml`, `auto-tag-release.yml`.
- [ ] Add **one** minimal CI scoped to our code:
      `pnpm install && pnpm --filter './packages/lobe-vanta-*' run build test`.
- [ ] (Optional) Add a scheduled **`upstream-sync.yml`** that fast-forwards `canary`
      and opens a `canary → AzA` PR.

**Never commit secrets** to the fork. Keep them in GitHub Actions secrets / a vault.

### 6. Data ownership (separate track)

Our data is in LobeHub Cloud. To own/collect it: self-host this fork (Postgres +
S3 per upstream docs) and point clients at our instance, or export from the cloud
account. **Do not couple this to the source refactor** — it's an independent workstream.

## Consequences

- **Upstream stays trivial to take** — `canary` is always a clean fast-forward; our
  code only ever lives in new files on `AzA`, so merges rarely conflict.
- **CI is ours** — no nightly red X's from inherited workflows we can't run.
- **Reversible** — `canary` can always re-derive the exact upstream tree; `AzA` is
  the only branch with our history.

---

_ADR owned by Vanta Labs. Companion: the drift hooks in `~/.claude/hooks/` and
`.claude/settings.local.json`._
