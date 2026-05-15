import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 4174);
const host = process.env.HOST || "127.0.0.1";

const types = {
  ".html": "text/html;charset=utf-8",
  ".css": "text/css;charset=utf-8",
  ".js": "text/javascript;charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
};

const sendNotFound = (res) => {
  res.writeHead(404, { "Content-Type": "text/plain;charset=utf-8" });
  res.end("Not found");
};

const sendFile = (req, res, file, stat) => {
  const contentType = types[path.extname(file).toLowerCase()] || "application/octet-stream";
  const range = req.headers.range;

  if (!range) {
      res.writeHead(200, {
        "Accept-Ranges": "bytes",
        "Cache-Control": "no-store",
        "Content-Type": contentType,
        "Content-Length": stat.size,
      });
    fs.createReadStream(file).pipe(res);
    return;
  }

  const match = range.match(/^bytes=(\d*)-(\d*)$/);

  if (!match) {
    res.writeHead(416, {
      "Content-Range": `bytes */${stat.size}`,
    });
    res.end();
    return;
  }

  const requestedStart = match[1] ? Number(match[1]) : 0;
  const requestedEnd = match[2] ? Number(match[2]) : stat.size - 1;
  const start = Math.max(0, requestedStart);
  const end = Math.min(stat.size - 1, requestedEnd);

  if (start > end || start >= stat.size) {
    res.writeHead(416, {
      "Content-Range": `bytes */${stat.size}`,
    });
    res.end();
    return;
  }

  res.writeHead(206, {
    "Accept-Ranges": "bytes",
    "Cache-Control": "no-store",
    "Content-Type": contentType,
    "Content-Length": end - start + 1,
    "Content-Range": `bytes ${start}-${end}/${stat.size}`,
  });
  fs.createReadStream(file, { start, end }).pipe(res);
};

http
  .createServer((req, res) => {
    const requestUrl = new URL(req.url || "/", `http://${host}:${port}`);
    const pathname = decodeURIComponent(requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname);
    const file = path.resolve(root, `.${pathname}`);

    if (!file.startsWith(root)) {
      res.writeHead(403, { "Content-Type": "text/plain;charset=utf-8" });
      res.end("Forbidden");
      return;
    }

    fs.stat(file, (error, stat) => {
      if (error || !stat.isFile()) {
        sendNotFound(res);
        return;
      }

      sendFile(req, res, file, stat);
    });
  })
  .listen(port, host, () => {
    console.log(`kVision landing: http://${host}:${port}/`);
  });
