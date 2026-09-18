# Deploying agyflow.com

Production is **manual FTP**. There is no CI/CD.

## Host facts

| | |
|---|---|
| Registrar / host | Rumahweb (cPanel) |
| Server IP | `203.175.9.146` |
| Document root | `public_html/` |
| Web server | Apache / LiteSpeed |
| TLS | Let's Encrypt via cPanel AutoSSL |
| FTP host | `agyflow.com` (also `ftp.agyflow.com`) |

There is **no** `vercel.json`, `.github/workflows/`, or `netlify.toml` in this
repo, and DNS points at Rumahweb rather than Vercel's `76.76.21.21`. Pushing to
GitHub or GitLab therefore does **not** publish anything — it only stores the
source. If the site looks stale after a push, that is expected.

FTP credentials live in `agyflow-main.md`, which is git-ignored. Do not commit
them.

## Why `.htaccess` matters here

The export is generated with `trailingSlash: false`, so pages land on disk as
`<route>.html` while every internal link and the sitemap use the extensionless
route. Apache does not bridge that on its own, and `out/` contains **both**
`products.html` and a `products/` directory, so a DirectoryIndex lookup finds
the directory and misses the page. `public/.htaccess` carries the rewrite rules
that fix this, and it ships as part of `out/`.

Because the host reads this file, a deploy that forgets `.htaccess` regresses
clean URLs to serving the homepage for every route.

## Procedure

### 1. Build

```bash
cd M:/saas/saas/agyflow-web
npm run build
```

Expect ~2 min cold, ~35 s incremental. The build wrapper clears `out/` and
`dist/`, runs `next build`, then runs `scripts/fix-html-lang.mjs`. It fails
loudly if `out/index.html` is missing.

### 2. Back up what is live

Never deploy without a rollback point. `M:\saas\agyflow-backup-2026-09-18\`
holds `backup.sh` (recursive FTP download) and `upload.sh` (deploy).

```bash
cd M:/saas/agyflow-backup-2026-09-18
bash backup.sh          # -> ./production/
```

`backup.sh` fetches dotfiles explicitly, because FTP `LIST` hides them and a
plain recursive `mget` will silently skip `.htaccess`.

### 3. Upload

```bash
cd M:/saas/agyflow-backup-2026-09-18
bash upload.sh "M:/saas/saas/agyflow-web/out"
```

The script uploads in three ordered phases:

1. **assets** — `_next/`, images, `*.txt`, `sitemap.xml`, `robots.txt`, `manifest.json`
2. **HTML** — all `*.html`
3. **`.htaccess`** — last

The ordering guarantees a new page never appears before the assets it
references, and `.htaccess` (which is what makes the new URLs resolve at all)
only goes live once everything it points at is already there. The script
aborts if `out/.htaccess` is missing.

**Nothing is deleted.** Old `_next/` chunks stay on the server. They are
harmless — the new HTML references new hashed filenames — and leaving them
means a rollback is just restoring HTML + `.htaccess`.

### 4. Verify

```bash
# 1. /products must show the CATALOG title, not the homepage title
curl -s "https://agyflow.com/products?cb=$(date +%s)" | grep -o '<title>[^<]*</title>'

# 2. missing paths must be a real 404
curl -s -o /dev/null -w '%{http_code}\n' https://agyflow.com/halaman-tidak-ada

# 3. locales must carry the right lang attribute
curl -s https://agyflow.com/de | grep -o '<html lang="[a-z]*"'

# 4. every route should be 200
for p in / /products /de /fr /products/gdpr-checklist; do
  printf '%s %s\n' "$(curl -s -o /dev/null -w '%{http_code}' https://agyflow.com$p)" "$p"
done
```

Append a cache-buster (`?cb=...`) when checking HTML. `.htaccess` sets
`ExpiresByType text/html "access plus 0 seconds"`, but an intermediary cache can
still hand back a stale page and make a good deploy look broken.

## Gotchas

**curl and `[slug]`.** Next.js emits a literal `[slug]` directory under
`_next/static/chunks/app/products/`. Without `-g` (globoff), curl parses
`[slug]` as a character class, the URL no longer matches the local file, and the
upload fails silently. `upload.sh` passes `-g`; keep it.

**curl and `/tmp`.** curl here is a Windows binary and grep is MSYS. Writing to
`/tmp/x.html` and reading it back with `grep` fails — curl resolves the path its
own way. Use a Windows-style path such as
`C:/Users/<you>/AppData/Local/Temp/x.html`.

**FTP opens one connection per file.** A single recursive session gets killed on
long runs, so both scripts drive `curl` per file rather than looping `mget`.
Expect a full deploy to take a couple of minutes.

**Push is not deploy.** See the host facts above.

## Rollback

Restore the previous HTML and `.htaccess` from `production/`:

```bash
cd M:/saas/agyflow-backup-2026-09-18
# point SRC at the backup instead of out/ — same three-phase ordering applies
```

Then re-run the verification block. Because old `_next/` chunks were never
deleted, the restored HTML will still find its original assets.
