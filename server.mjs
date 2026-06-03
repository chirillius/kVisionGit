import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const demoAppRoot = path.resolve(root, '..', 'dist');
const demoDefectRoot = path.resolve(root, 'images', 'defectPage');
const demoArchiveRoot = path.resolve(root, 'videos', 'download-archive');
const port = Number(process.env.PORT || 4184);
const host = process.env.HOST || "127.0.0.1";

const types = {
  ".html": "text/html;charset=utf-8",
  ".css": "text/css;charset=utf-8",
  ".js": "text/javascript;charset=utf-8",
  ".json": "application/json;charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
};

const storeAddressByFolder = {
  novoselImages: 'ул. Новосёлов, 16',
  sve2images: 'ул. Крупской, 13',
  svobodaImages: 'ул. Свободы, 19',
};

const storeNameByArchiveFolder = {
  novoselov: 'Новосёлов',
  krupskaya: 'Крупская',
  svoboda: 'Свобода',
};

const defectTypeByFolder = {
  bottles: 'Bottles',
  cashRegister: 'CashRegister',
  clearStall: 'ClearStall',
  conversion: 'Conversion',
  crowds: 'Crowd',
  delays: 'Delays',
  light: 'Light',
  noOneAtStallforTooLong: 'NoOneAtStallForTooLong',
  phones: 'Phone',
  pose: 'Pose',
  serviceNearCabinet: 'ServiceNearCabinet',
  smoke: 'Smoke',
  tooManyPeopleAtStall: 'TooManyPeopleAtStall',
};

const sendNotFound = (res) => {
  res.writeHead(404, { "Content-Type": "text/plain;charset=utf-8" });
  res.end("Not found");
};

const toIsoDate = (value) => {
  const match = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) {
    return null;
  }

  return `${match[3]}-${match[2]}-${match[1]}`;
};

const buildDemoDefectManifest = () => {
  if (!fs.existsSync(demoDefectRoot)) {
    return [];
  }

  const entries = [];

  for (const storeDir of fs.readdirSync(demoDefectRoot, { withFileTypes: true })) {
    if (!storeDir.isDirectory()) {
      continue;
    }

    const storeFolder = storeDir.name;
    const storeAddress = storeAddressByFolder[storeFolder];
    if (!storeAddress) {
      continue;
    }

    const storePath = path.join(demoDefectRoot, storeFolder);
    for (const dateDir of fs.readdirSync(storePath, { withFileTypes: true })) {
      if (!dateDir.isDirectory()) {
        continue;
      }

      const isoDate = toIsoDate(dateDir.name);
      if (!isoDate) {
        continue;
      }

      const datePath = path.join(storePath, dateDir.name);
      for (const typeDir of fs.readdirSync(datePath, { withFileTypes: true })) {
        if (!typeDir.isDirectory()) {
          continue;
        }

        const typeKey = defectTypeByFolder[typeDir.name];
        if (!typeKey) {
          continue;
        }

        const typePath = path.join(datePath, typeDir.name);
        const fileNames = fs
          .readdirSync(typePath, { withFileTypes: true })
          .filter((file) => file.isFile())
          .map((file) => file.name)
          .sort((left, right) => left.localeCompare(right));

        if (!fileNames.length) {
          continue;
        }

        entries.push({
          storeAddress,
          storeFolder,
          date: isoDate,
          typeKey,
          typeFolder: typeDir.name,
          fileNames,
        });
      }
    }
  }

  return entries.sort((left, right) => {
    if (left.storeFolder !== right.storeFolder) {
      return left.storeFolder.localeCompare(right.storeFolder);
    }
    if (left.date !== right.date) {
      return left.date.localeCompare(right.date);
    }
    return left.typeKey.localeCompare(right.typeKey);
  });
};

const toIsoFromArchiveFolderDate = (value) => {
  const match = value.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) {
    return null;
  }

  return `${match[3]}-${match[2]}-${match[1]}`;
};

const buildDemoArchiveManifest = () => {
  if (!fs.existsSync(demoArchiveRoot)) {
    return [];
  }

  const entries = [];

  for (const storeDir of fs.readdirSync(demoArchiveRoot, { withFileTypes: true })) {
    if (!storeDir.isDirectory()) {
      continue;
    }

    const storeSlug = storeDir.name;
    const storeName = storeNameByArchiveFolder[storeSlug];
    if (!storeName) {
      continue;
    }

    const storePath = path.join(demoArchiveRoot, storeSlug);
    for (const archiveRootDir of fs.readdirSync(storePath, { withFileTypes: true })) {
      if (!archiveRootDir.isDirectory()) {
        continue;
      }

      const archiveType =
        archiveRootDir.name === 'TimeArchive'
          ? 'time'
          : archiveRootDir.name === 'DateArchive'
            ? 'date'
            : null;

      if (!archiveType) {
        continue;
      }

      const archiveRootPath = path.join(storePath, archiveRootDir.name);
      for (const dateDir of fs.readdirSync(archiveRootPath, { withFileTypes: true })) {
        if (!dateDir.isDirectory()) {
          continue;
        }

        const isoDate = toIsoFromArchiveFolderDate(dateDir.name);
        if (!isoDate) {
          continue;
        }

        const datePath = path.join(archiveRootPath, dateDir.name);

        if (archiveType === 'date') {
          const originPath = path.join(datePath, 'origin');
          if (!fs.existsSync(originPath)) {
            continue;
          }

          for (const cameraDir of fs.readdirSync(originPath, { withFileTypes: true })) {
            if (!cameraDir.isDirectory()) {
              continue;
            }

            const cameraPath = path.join(originPath, cameraDir.name);
            for (const file of fs.readdirSync(cameraPath, { withFileTypes: true })) {
              if (!file.isFile()) {
                continue;
              }

              entries.push({
                storeName,
                storeSlug,
                archiveType,
                date: isoDate,
                dateFolder: dateDir.name,
                cameraName: cameraDir.name,
                fileName: file.name,
              });
            }
          }

          continue;
        }

        for (const intervalDir of fs.readdirSync(datePath, { withFileTypes: true })) {
          if (!intervalDir.isDirectory()) {
            continue;
          }

          const intervalPath = path.join(datePath, intervalDir.name);
          for (const cameraDir of fs.readdirSync(intervalPath, { withFileTypes: true })) {
            if (!cameraDir.isDirectory()) {
              continue;
            }

            const cameraPath = path.join(intervalPath, cameraDir.name);
            for (const file of fs.readdirSync(cameraPath, { withFileTypes: true })) {
              if (!file.isFile()) {
                continue;
              }

              entries.push({
                storeName,
                storeSlug,
                archiveType,
                date: isoDate,
                dateFolder: dateDir.name,
                intervalName: intervalDir.name,
                cameraName: cameraDir.name,
                fileName: file.name,
              });
            }
          }
        }
      }
    }
  }

  return entries.sort((left, right) => {
    if (left.storeSlug !== right.storeSlug) {
      return left.storeSlug.localeCompare(right.storeSlug);
    }
    if (left.archiveType !== right.archiveType) {
      return left.archiveType.localeCompare(right.archiveType);
    }
    if (left.date !== right.date) {
      return left.date.localeCompare(right.date);
    }
    if ((left.intervalName ?? '') !== (right.intervalName ?? '')) {
      return (left.intervalName ?? '').localeCompare(right.intervalName ?? '');
    }
    if (left.cameraName !== right.cameraName) {
      return left.cameraName.localeCompare(right.cameraName);
    }
    return left.fileName.localeCompare(right.fileName);
  });
};

const resolveRequestTarget = (pathname) => {
  if (pathname.startsWith('/videos/download-archive/')) {
    return {
      file: path.resolve(root, `.${pathname}`),
      root,
      spaFallback: null,
    };
  }

  if (pathname.startsWith('/assets/')) {
    return {
      file: path.resolve(demoAppRoot, `.${pathname}`),
      root: demoAppRoot,
      spaFallback: null,
    };
  }

  if (pathname.startsWith('/demo-app')) {
    const demoRelativePath = pathname.replace(/^\/demo-app/, '') || '/';
    const requestedPath = demoRelativePath === '/' ? '/index.html' : demoRelativePath;
    const file = path.resolve(demoAppRoot, `.${requestedPath}`);
    return {
      file,
      root: demoAppRoot,
      spaFallback: path.resolve(demoAppRoot, 'index.html'),
    };
  }

  const requestedPath = pathname === '/' ? '/index.html' : pathname;
  return {
    file: path.resolve(root, `.${requestedPath}`),
    root,
    spaFallback: null,
  };
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
    const pathname = decodeURIComponent(requestUrl.pathname);

    if (pathname === '/demo-defect-manifest.json') {
      const payload = JSON.stringify(buildDemoDefectManifest());
      res.writeHead(200, {
        "Cache-Control": "no-store",
        "Content-Type": "application/json;charset=utf-8",
        "Content-Length": Buffer.byteLength(payload),
      });
      res.end(payload);
      return;
    }

    if (pathname === '/demo-archive-manifest.json') {
      const payload = JSON.stringify(buildDemoArchiveManifest());
      res.writeHead(200, {
        "Cache-Control": "no-store",
        "Content-Type": "application/json;charset=utf-8",
        "Content-Length": Buffer.byteLength(payload),
      });
      res.end(payload);
      return;
    }

    const target = resolveRequestTarget(pathname);
    const { file, root: targetRoot, spaFallback } = target;

    if (!file.startsWith(targetRoot)) {
      res.writeHead(403, { "Content-Type": "text/plain;charset=utf-8" });
      res.end("Forbidden");
      return;
    }

    fs.stat(file, (error, stat) => {
      if (error || !stat.isFile()) {
        if (spaFallback && !path.extname(pathname)) {
          fs.stat(spaFallback, (fallbackError, fallbackStat) => {
            if (fallbackError || !fallbackStat.isFile()) {
              sendNotFound(res);
              return;
            }

            sendFile(req, res, spaFallback, fallbackStat);
          });
          return;
        }

        sendNotFound(res);
        return;
      }

      sendFile(req, res, file, stat);
    });
  })
  .listen(port, host, () => {
    console.log(`kVision landing: http://${host}:${port}/`);
  });
