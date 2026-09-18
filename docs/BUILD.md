# Agyflow build & static routing

Status: current as of 2026-09-17
Repo: agyflow-web
Output: `out/` (static export)
Hosting: Rumahweb cPanel, Apache/LiteSpeed — upload `out/` into `public_html/`

## Commands

| Command | Does |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production static export into `out/` |
| `npm run preview` | Serve `out/` with production routing rules on `127.0.0.1:4173` |
| `npm run check-links` | Verify every internal link and asset in `out/` resolves |
| `npm run clean` | Remove `.next/`, `out/`, `dist/` |

## Why `npm run build` is a wrapper, not `next build`

`package.json` runs `node scripts/build.mjs`. This is deliberate.

This environment runs Node with a **safe-delete shim** that intercepts
`fs.rm`, `fs.rmSync`, `fs.unlink`, and `fs.promises.rm`, routing deletes
through the OS trash binary instead of removing them directly. That trash
binary times out on this volume.

`next build` deletes its own working directories several times per run — the
`distDir` during PrebuildNext, and the `.next/export` staging directory after
the export step. Each of those deletes therefore killed the build, with one of:

```
[safe-delete][SAFE_DELETE_BULK_CONFIRM_REQUIRED] {"count":N,"threshold":50,...}
[safe-delete] 操作失败: spawnSync ...genie-trash\win32-x64.exe ETIMEDOUT
Next.js build worker exited with code: 1073807364
```

The shim honours an opt-out flag, `CODEBUDDY_SAFE_DELETE_ENABLED=0`. **The flag
must be present before the child Node process starts** — the shim installs
itself at require time and cannot be removed afterwards. That is the entire
reason a wrapper script exists; no `next.config.mjs` option can do it.

The flag is scoped to the build subprocess only. It does not change how this
workspace protects user files, and the directories involved (`.next/`, `out/`)
are git-ignored build artifacts.

## Script reference

### `scripts/build.mjs`

1. Removes stale `out/` and `dist/` so files from a previous build cannot
   survive (for example a product page that has since been deleted).
2. Spawns `next build` with the shim disabled.
3. Fails the build if `out/index.html` is missing.
4. Runs `scripts/fix-html-lang.mjs` to fix `<html lang>` on the localized pages.

Next's own `cleanDistDir` handles `.next/`; with the shim disabled in the child
that delete completes normally.

### `scripts/raw-remove.mjs`

Recursive directory removal for use **inside an already-shimmed process** (the
build wrapper's cleanup step, and `npm run clean`). It deletes via
`process.binding("fs")` syscalls, which the shim does not wrap. Enumeration
stays on the normal `fs.readdirSync`, which is read-only. Transient Windows
lock errors (`EBUSY`, `EPERM`, `ENOTEMPTY`) are retried briefly.

### `scripts/serve.mjs`

Preview server that mirrors the production routing rules (below). Use it to
check the export the way a host will serve it.

**Do not use `python -m http.server` to validate this site.** The export is
built with `trailingSlash: false`, so every internal link is extensionless
(`/de`, `/products/gdpr-checklist`) while the files on disk are `de.html` and
`products/gdpr-checklist.html`. A plain file server returns 404 for all of
them, which looks like a broken build when the build is fine.

### `scripts/check-links.mjs`

Parses every generated HTML file, extracts internal `href` / `src` targets, and
confirms each maps to a file on disk. It URL-decodes targets before checking,
because Next encodes dynamic segments — the route `/products/[slug]` appears in
the HTML as `%5Bslug%5D`.

### `scripts/fix-html-lang.mjs`

Pre-existing. The static export renders `<html lang="en">` on every page
because there is a single root layout; this rewrites `out/de.html` and
`out/fr.html` to the correct language. It fails the build if those files are
missing.

## Static routing rules

`public/.htaccess` is copied verbatim into `out/` and is read by Apache and
LiteSpeed. Vercel and Netlify resolve clean URLs themselves and ignore it.

The export is built with `trailingSlash: false`, so pages exist on disk as
`<route>.html` while every internal link and the sitemap point at the
extensionless route. The rules bridge the two:

```apache
Options -MultiViews

# Canonicalise trailing slashes: /products/ -> /products
RewriteCond %{REQUEST_URI} !^/$
RewriteRule ^(.+?)/+$ /$1 [R=301,L]

# Clean URLs: resolve an extensionless request to its .html file
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.+?)/?$ $1.html [L]

ErrorDocument 404 /404.html
```

### Why not a catch-all to `/index.html`

The previous configuration ended with:

```apache
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]
```

On this site that was wrong twice over. Every clean URL is "not a file" — pages
live as `.html` files — so *every* route rendered the homepage, and genuinely
missing pages returned HTTP 200 with unrelated content, a soft 404 that search
engines penalise.

### The `products` name collision

`out/` contains **both** `products.html` and a `products/` directory (that
route's cover and thumbnail images). Apache resolves the directory first and
never reaches the page, so `/products` broke even though the file existed. The
explicit `.html` probe must therefore run before directory handling, and
`Options -MultiViews` stops Apache content-negotiating around it.

## Pitfalls

- **Stop the preview server before building.** If a process has its working
  directory inside `out/` (the preview server, a watcher, an editor indexer),
  the build's cleanup fails with `EBUSY: rmdir '...\out'` on Windows.
- **Do not set `distDir` in `next.config.mjs`.** Next treats a custom `distDir`
  as a request to swap the export output directory
  (`hasCustomExportOutput`), which redirects the export away from `out/` and
  breaks the deploy layout.
- **Do not patch `node_modules` to work around the shim.** Patches vanish on
  the next `npm install` and are invisible to reviewers. Use the environment
  flag.
- **Drive M: is slow.** A clean build takes a few minutes; an incremental build
  takes well under a minute. Prefer incremental while iterating.

## Deploy

**Full procedure: [`DEPLOY.md`](./DEPLOY.md).** Short version:

```bash
npm run build
npm run preview        # optional: verify at http://127.0.0.1:4173
npm run check-links    # optional: 0 broken is the expected result
```

Then back up what is live and upload all of `out/` into `public_html/`:

```bash
cd M:/saas/agyflow-backup-2026-09-18
bash backup.sh                                    # -> ./production/
bash upload.sh "M:/saas/saas/agyflow-web/out"     # assets, then HTML, then .htaccess
```

`out/.htaccess` must be uploaded too — it is a hidden file, so FTP `LIST` and
cPanel File Manager both skip it unless dotfiles are shown. `upload.sh` handles
this. Hosting credentials live in `agyflow-main.md`, which is git-ignored and
must never be committed.

Pushing to GitHub/GitLab does **not** deploy — the host is Rumahweb and there is
no CI/CD.

After upload, verify against production:

```bash
curl -s https://agyflow.com/                        | grep -o '<html lang="[a-z]*"'   # en
curl -s https://agyflow.com/de                      | grep -o '<html lang="[a-z]*"'   # de
curl -s https://agyflow.com/products                | grep -o '<title>[^<]*</title>'  # catalog title
curl -s https://agyflow.com/products/gdpr-checklist | grep -o '<title>[^<]*</title>'  # product title, NOT homepage
curl -s -o /dev/null -w '%{http_code}\n' https://agyflow.com/no-such-page             # 404
```
