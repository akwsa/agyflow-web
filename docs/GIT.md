# Git workflow — pushing to GitHub and GitLab

## Two repositories, one directory tree

`agyflow-web` is a **submodule**. It is its own repository, nested inside a
parent repository that records only a *pointer* to it:

```
M:\saas\saas\                        <- parent repo
│   remote: origin = GitLab
│           cv-kusuma-kaya-sakti-group/cv-kusuma-kaya-sakti-project.git
│
├── agyflow-web/                     <- submodule (its own repo)
│   ├── origin = GitHub  akwsa/agyflow-web.git
│   └── gitlab = GitLab  cv-kusuma-kaya-sakti-group/agyflow-web.git
│
├── ai-customer-support-reply-assistant/      (submodule)
├── gdpr-privacy-policy-assistant/            (submodule)
└── montessori-toddler-busy-book/             (submodule)
```

The parent stores `agyflow-web` as a **gitlink** — a single commit SHA. It does
not store any of the files inside. So pushing `agyflow-web` does **not** update
the parent, and pushing the parent does not push `agyflow-web`.

Two consequences worth internalising:

- A commit inside `agyflow-web` is invisible to anyone who only clones the
  parent until the parent's pointer is bumped **and** the submodule commit is
  reachable on a remote they can fetch from.
- The parent will show `modified: agyflow-web` any time the submodule's HEAD
  moves, even though no file inside the parent changed. That is expected.

## Before you push: the one rule

> **Never run `git add -A` or `git add .` in `M:\saas\saas`.**

The parent working directory contains untracked, **not** gitignored files that
hold live secrets — `newapikey.txt` among them. A blanket `git add` will stage
them and the next push publishes them to GitLab. Add the submodule pointer
explicitly instead:

```bash
git add agyflow-web      # correct — stages the pointer only
```

Check before you commit:

```bash
git status --short
git diff --cached --stat
```

If a filename containing `key`, `secret`, `token`, `password`, or `.env`
appears, stop and add it to `.gitignore` first.

## Step 1 — push the submodule to both remotes

```bash
cd M:/saas/saas/agyflow-web

git status                            # expect a clean tree
git log --oneline origin/main..HEAD   # exactly what will be published
```

Then push to each remote. They are independent; one failing does not block the
other.

```bash
git push origin main      # GitHub  — akwsa/agyflow-web
git push gitlab main      # GitLab  — cv-kusuma-kaya-sakti-group/agyflow-web
```

`origin` is already the upstream for `main`, so a bare `git push` targets
GitHub. **Always name `gitlab` explicitly** — otherwise GitLab is silently
skipped, which is an easy way to end up with the two hosts out of sync.

### Verify both actually landed

```bash
git ls-remote origin refs/heads/main
git ls-remote gitlab refs/heads/main
git rev-parse HEAD
```

All three must print the **same** SHA. `git ls-remote` is a read, so it works
without a GUI prompt even when pushing does not.

## Step 2 — bump the parent pointer

Only needed if you want the parent to reference the new submodule commit.

```bash
cd M:/saas/saas

git status --short            # shows: " M agyflow-web"
git add agyflow-web           # the pointer ONLY — never -A
git commit -m "Bump agyflow-web to <short-sha>"
git push origin main          # parent remote = GitLab
```

`git ls-files --stage -- agyflow-web` shows the recorded pointer. The leading
mode `160000` is what marks it as a submodule rather than a directory.

## Credentials

The credential helper is `helper-selector`, which delegates to **Git
Credential Manager**. GCM needs a GUI session to show its login window.

From a non-interactive shell (an agent, a script, CI) a push will fail or hang:

```
fatal: could not read Username for 'https://github.com': terminal prompts disabled
```

Two workarounds:

1. **Push from a normal terminal** in your desktop session. Simplest.
2. **Use a token.** Create a Personal Access Token with `write_repository`
   (GitLab) / `repo` (GitHub) scope, then either embed it in the remote URL or
   let GCM store it once:

   ```bash
   git push "https://<user>:<token>@github.com/akwsa/agyflow-web.git" main
   ```

   A token in a remote URL is written to `.git/config` in plaintext. Prefer
   entering it once interactively and letting GCM cache it.

Reads (`git ls-remote`, `git fetch`) work on public repositories without
credentials. A private repository will hang or time out instead — that is the
usual sign a repo is private, not that the network is broken.

## Troubleshooting

| Symptom | Cause |
|---|---|
| Push hangs, then `SIGTERM` | GCM waiting for a GUI prompt. Push from a desktop terminal. |
| `could not read Username ... terminal prompts disabled` | Same cause. |
| `git ls-remote` returns nothing and exits 1 | Repo is private, or auth is required. |
| `git push` succeeded but GitLab is behind | `gitlab` was not named explicitly. |
| Parent shows `modified: agyflow-web` | Expected — the submodule HEAD moved. Commit the pointer. |
| `fatal: refusing to merge unrelated histories` | The remote already has commits. Fetch and reconcile before pushing. |

## What pushing does *not* do

It does not deploy. Production is a manual FTP upload to Rumahweb — see
`DEPLOY.md`.
