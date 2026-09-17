// Local preview server for the static export.
//
// `python -m http.server` cannot be used to validate this site: the export is
// built with trailingSlash: false, so every internal link points at an
// extensionless route (/de, /products/gdpr-checklist) while the files on disk
// are de.html and products/gdpr-checklist.html. A plain file server 404s on
// all of them and gives a false sense of breakage.
//
// This server mirrors the routing rules in public/.htaccess so the export can
// be checked the way production will serve it:
//   1. strip trailing slashes with a 301
//   2. resolve an extensionless request to <path>.html when that file exists
//   3. otherwise serve 404.html with a real 404 status
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve("out");
const PORT = Number(process.env.PORT || 4173);
const HOST = "127.0.0.1";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

async function isFile(p) {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
}

/** Map a URL pathname to a file on disk, or null. */
async function resolveFile(pathname) {
  const decoded = decodeURIComponent(pathname);
  const rel = decoded.replace(/^\/+/, "");

  if (rel === "") return path.join(ROOT, "index.html");

  const direct = path.join(ROOT, rel);
  // Guard against traversal outside the export directory.
  if (!direct.startsWith(ROOT)) return null;

  if (await isFile(direct)) return direct;

  // Extensionless route -> <path>.html
  if (!path.extname(rel)) {
    const asHtml = `${direct}.html`;
    if (await isFile(asHtml)) return asHtml;
  }

  return null;
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${HOST}:${PORT}`);
  const { pathname } = url;

  // Rule 1: canonicalise trailing slashes.
  if (pathname !== "/" && pathname.endsWith("/")) {
    res.writeHead(301, { Location: pathname.replace(/\/+$/, "") + url.search });
    res.end();
    return;
  }

  // Rules 2 and 3.
  const file = await resolveFile(pathname);
  if (!file) {
    try {
      const body = await readFile(path.join(ROOT, "404.html"));
      res.writeHead(404, { "Content-Type": TYPES[".html"] });
      res.end(body);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404");
    }
    return;
  }

  const body = await readFile(file);
  res.writeHead(200, {
    "Content-Type": TYPES[path.extname(file)] || "application/octet-stream",
  });
  res.end(body);
});

server.listen(PORT, HOST, () => {
  console.log(`[serve] http://${HOST}:${PORT}  (root: ${ROOT})`);
});
