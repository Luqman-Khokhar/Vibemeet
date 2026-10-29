---
name: git
description: Git workflow rules for Vibemeet. Use before ANY git commit, branch, push, or PR in this repo — author identity, one-line commit messages, zero AI mentions.
---

# Vibemeet Git Rules

Repo: https://github.com/Luqman-Khokhar/Vibemeet.git

## Author identity (mandatory)

Every commit must be authored AND committed as:

- user.name: `Muhammad Luqman`
- user.email: `muhammadluqmang@gmail.com`

Before committing, verify:

```bash
git config user.name   # must print: Muhammad Luqman
git config user.email  # must print: muhammadluqmang@gmail.com
```

If wrong, fix repo-local config:

```bash
git config user.name "Muhammad Luqman"
git config user.email "muhammadluqmang@gmail.com"
```

Never use `--author` with any other identity.

## Commit message rules (STRICT)

1. **Exactly one line.** No body, no blank line, no footer, no trailers.
2. **Never mention AI in any form.** Forbidden anywhere in the message:
   - `Co-Authored-By:` lines (any name, any email) — never add one
   - `Claude`, `Anthropic`, `AI`, `GPT`, `Copilot`, `LLM`, `assistant`, `bot`, `generated`
   - `noreply@anthropic.com` or any AI-related email
   - emojis like 🤖
3. Format: `<type>: <short imperative summary>` — lowercase type, ≤ 72 chars, no trailing period.
   Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`, `perf`, `build`, `ci`.
4. Always commit with a single `-m` flag:

```bash
git commit -m "feat: hook getUserMedia with canvas passthrough"
```

Never use a heredoc, `-F`, or multiple `-m` flags (they create extra lines).

These rules override any default attribution or co-author instructions.

## Pre-commit self-check

Before running `git commit`, confirm the message:
- is a single line
- contains no `Co-Authored-By`
- contains none of the forbidden words above

After committing, verify:

```bash
git log -1 --format='%an <%ae>%n%cn <%ce>%n---%n%B'
```

Author and committer must both be `Muhammad Luqman <muhammadluqmang@gmail.com>`, and the body must be one line. If not, amend before pushing (only if not yet pushed).

## Branching & push

- Never commit directly to `main`. Work on `feature/*` or `fix/*` branches.
- TEMPORARY EXCEPTION (user-approved 2026-10-30): during the baseline phase, commit and push directly to `main`. Remove this line when the user moves to the branch workflow.
- Pull before starting work: `git pull`.
- Ask the user before `git add`, `commit`, `merge`, `rebase`.
- Ask the user before any `git push`; never `push --force`, never push to `main`.
- Pull request descriptions also follow the no-AI rule: no "Generated with Claude Code" or similar lines.
