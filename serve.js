/* 로컬 미리보기 서버:  node serve.js  →  http://localhost:5173 */
const http = require("http");
const fs   = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = 5173;
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".js":   "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg":  "image/svg+xml",
  ".png":  "image/png",
  ".jpg":  "image/jpeg"
};

http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split("?")[0]);
  let file = path.join(ROOT, path.normalize(rel).replace(/^[\\/]+/, ""));
  if (!file.startsWith(ROOT)) { res.writeHead(403).end("forbidden"); return; }

  // 디렉터리(/ 또는 /samcheok/)면 그 안의 index.html — Vercel 과 같은 동작
  try { if (fs.statSync(file).isDirectory()) file = path.join(file, "index.html"); }
  catch { /* 없는 경로는 아래 readFile 이 404 처리 */ }

  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("404"); return; }
    res.writeHead(200, {
      "content-type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
      "cache-control": "no-store"
    });
    res.end(buf);
  });
}).listen(PORT, () => console.log("→ http://localhost:" + PORT));
