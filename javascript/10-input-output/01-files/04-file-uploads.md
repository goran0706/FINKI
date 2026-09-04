# JavaScript File Uploads

## Overview of the Upload Pipeline

A file upload moves a `File` object from the browser into an HTTP request body, where a server receives, parses,
validates, and persists it. The client side is responsible for collecting files (input or drag-and-drop), optionally
validating and previewing them, and transmitting them via `FormData` or raw binary streaming. The server side is
responsible for parsing the incoming multipart body, enforcing size/type limits, and writing the result to disk, cloud
storage, or a database.

| Stage                  | Responsibility                                                | Common Tools                                 |
|:-----------------------|:--------------------------------------------------------------|:---------------------------------------------|
| **Client Collection**  | Gathering files from `<input>` or drag-and-drop               | `<input type="file">`, `DataTransfer`        |
| **Client Validation**  | Checking size, type, and count before sending                 | `file.size`, `file.type`, custom checks      |
| **Transmission**       | Encoding and sending the file(s) to the server                | `FormData` + `fetch()`, `XMLHttpRequest`     |
| **Server Parsing**     | Decoding the multipart body into usable file streams/buffers  | `multer` (Express), `busboy`, `formidable`   |
| **Server Persistence** | Writing validated files to disk, cloud storage, or a database | `fs` streams, S3 SDKs, database blob columns |

## Client-Side: Collecting Files

```html

<form id="upload-form">
    <input type="file" id="file-input" name="document" accept=".pdf,.docx,image/*" multiple/>
    <button type="submit">Upload</button>
</form>
```

```javascript
const form = document.querySelector('#upload-form');
const fileInput = document.querySelector('#file-input');
```

## Client-Side Validation Before Sending

Validating file size and type client-side gives immediate feedback, but it is **never** a substitute for server-side
validation, since a malicious client can bypass any browser-side check entirely.

```javascript
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'application/pdf'];

function validateFiles(fileList) {
    const errors = [];

    for (const file of fileList) {
        if (file.size > MAX_SIZE_BYTES) {
            errors.push(`"${file.name}" exceeds the 5MB size limit.`);
        }
        if (!ALLOWED_TYPES.includes(file.type)) {
            errors.push(`"${file.name}" has an unsupported file type.`);
        }
    }

    return errors;
}

fileInput.addEventListener('change', () => {
    const errors = validateFiles(fileInput.files);
    if (errors.length) {
        console.warn('Validation errors:', errors);
    }
});
```

## Sending Files with `FormData` and `fetch()`

`FormData` automatically encodes the request as `multipart/form-data`, the standard encoding for file uploads, allowing
files to be mixed with regular text fields in a single request.

```javascript
async function uploadFiles(fileList, extraFields = {}) {
    const formData = new FormData();

    // Append each file under the same field name (server reads it as an array)
    for (const file of fileList) {
        formData.append('documents', file, file.name);
    }

    // Append additional text fields alongside the files
    for (const [key, value] of Object.entries(extraFields)) {
        formData.append(key, value);
    }

    const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
        // NOTE: Do NOT set 'Content-Type' manually — the browser sets the
        // correct multipart boundary header automatically.
    });

    if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
    }

    return response.json();
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        const result = await uploadFiles(fileInput.files, {userId: '4471'});
        console.log('Upload succeeded:', result);
    } catch (error) {
        console.error('Upload error:', error.message);
    }
});
```

| `FormData.append()` Argument | Description                                                      |
|:-----------------------------|:-----------------------------------------------------------------|
| **Field Name**               | The key the server reads the file(s) under (e.g., `'documents'`) |
| **`File` / `Blob`**          | The actual file object to upload                                 |
| **Filename** (optional)      | Overrides the filename sent to the server                        |

## Tracking Upload Progress (`XMLHttpRequest`)

The `fetch()` API does not expose upload progress events natively, so `XMLHttpRequest` remains the standard choice when
a progress bar is required.

```javascript
function uploadWithProgress(fileList, onProgress) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        for (const file of fileList) {
            formData.append('documents', file);
        }

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                onProgress(percent);
            }
        });

        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject(new Error(`Server responded with status ${xhr.status}`));
            }
        });

        xhr.addEventListener('error', () => reject(new Error('Network error during upload.')));

        xhr.open('POST', '/api/upload');
        xhr.send(formData);
    });
}

uploadWithProgress(fileInput.files, (percent) => {
    document.querySelector('#progress-bar').style.width = `${percent}%`;
}).then((result) => console.log('Done:', result));
```

## Drag-and-Drop Upload Zone

```javascript
const dropZone = document.querySelector('#drop-zone');

dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', async (event) => {
    event.preventDefault();
    dropZone.classList.remove('drag-over');

    const files = event.dataTransfer.files;
    const errors = validateFiles(files);

    if (errors.length) {
        console.warn(errors);
        return;
    }

    await uploadFiles(files);
});
```

## Server-Side: Express with `multer`

`multer` is the standard middleware for handling `multipart/form-data` in Express applications, parsing incoming files
into either disk storage or memory buffers.

```bash
npm install express multer
```

```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// Configure disk storage with a custom filename strategy
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: {fileSize: 5 * 1024 * 1024, files: 5}, // 5MB per file, max 5 files
    fileFilter: (req, file, cb) => {
        const allowed = ['image/png', 'image/jpeg', 'application/pdf'];
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error('Unsupported file type.'), false);
        }
        cb(null, true);
    }
});

// Field name here MUST match the FormData key used on the client ('documents')
app.post('/api/upload', upload.array('documents', 5), (req, res) => {
    const savedFiles = req.files.map((file) => ({
        originalName: file.originalname,
        storedAs: file.filename,
        size: file.size,
        mimeType: file.mimetype
    }));

    res.status(201).json({message: 'Upload successful', files: savedFiles});
});

// Multer-specific error handling (size limits, unexpected fields, etc.)
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({error: err.message});
    } else if (err) {
        return res.status(400).json({error: err.message});
    }
    next();
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

| `multer` Method                  | Handles                                     | `req` Property Populated                 |
|:---------------------------------|:--------------------------------------------|:-----------------------------------------|
| **`upload.single('field')`**     | Exactly one file under a given field name   | `req.file`                               |
| **`upload.array('field', max)`** | Multiple files under the same field name    | `req.files` (array)                      |
| **`upload.fields([...])`**       | Multiple files across different field names | `req.files` (object keyed by field name) |
| **`upload.none()`**              | Text-only fields with no file uploads       | `req.body` only                          |

## Server-Side: Plain Node.js (No Framework)

For environments without Express, `busboy` provides low-level streaming multipart parsing without buffering the entire
file in memory.

```bash
npm install busboy
```

```javascript
const http = require('http');
const busboy = require('busboy');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/api/upload') {
        const bb = busboy({headers: req.headers, limits: {fileSize: 5 * 1024 * 1024}});

        bb.on('file', (fieldname, file, info) => {
            const {filename, mimeType} = info;
            const savePath = path.join(__dirname, 'uploads', `${Date.now()}-${filename}`);
            const writeStream = fs.createWriteStream(savePath);

            file.pipe(writeStream);

            file.on('limit', () => {
                console.warn(`File "${filename}" exceeded the size limit.`);
            });
        });

        bb.on('close', () => {
            res.writeHead(201, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({message: 'Upload complete'}));
        });

        req.pipe(bb);
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(3000);
```

## Chunked / Resumable Uploads for Large Files

For very large files (video, datasets), uploading in chunks avoids memory pressure and allows resuming after network
interruptions.

```javascript
async function uploadInChunks(file, chunkSize = 2 * 1024 * 1024) {
    const totalChunks = Math.ceil(file.size / chunkSize);

    for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('chunkIndex', i);
        formData.append('totalChunks', totalChunks);
        formData.append('fileName', file.name);

        const response = await fetch('/api/upload-chunk', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Chunk ${i} failed to upload.`);
        }
    }

    console.log('All chunks uploaded. File assembly complete.');
}
```

The server receives each chunk, appends it to a partial file on disk (or a temporary blob store), and reassembles the
complete file once the final chunk arrives, tracked via `chunkIndex` and `totalChunks`.

## Use Cases

* **Profile Picture Uploads:** Validating image type/size client-side, previewing via `FileReader`, then uploading via
  `FormData` to an Express endpoint using `multer.single()`.
* **Bulk Document Ingestion:** Accepting multiple PDFs/DOCX files at once through `multer.array()`, storing metadata in
  a database alongside the file paths.
* **Large Video Upload Portals:** Splitting multi-gigabyte files into chunks client-side and reassembling them
  server-side to avoid request timeouts and memory spikes.
* **Drag-and-Drop Media Libraries:** Combining the Drag and Drop API with `FormData` uploads for a native-feeling file
  management interface.
* **Progress-Tracked Bulk Uploads:** Using `XMLHttpRequest`'s `upload.progress` event to render a real-time progress bar
  for large batch uploads.

## Best Practices

* **Always Re-Validate on the Server:** Never trust client-side file size or MIME checks; malicious actors can easily
  bypass browser UI validations using custom scripts or direct HTTP API requests.
* **Never Trust `file.mimetype` Blindly:** Client-supplied MIME types can be spoofed by renaming extensions. For
  security-sensitive uploads, inspect actual magic bytes server-side using robust inspection utilities.
* **Set Explicit Size and Count Limits:** Configure strict limits (e.g., `limits: { fileSize: 5242880, files: 5 }`) in
  your server parser to protect against denial-of-service (DoS) memory saturation and disk exhaustion attacks.
* **Generate Safe, Unique Filenames Server-Side:** Never use raw user-supplied filenames for disk storage. Prefix files
  with timestamps, crypto-secure UUIDs, or hashes to prevent directory traversal and file overwrite collisions.
* **Never Set `Content-Type` Manually with `FormData`:** Allow the browser to automatically compute and append the
  correct multipart boundary header. Setting it manually strips the boundary and breaks parsing.
* **Store Uploads Outside the Web Root:** Save incoming files to isolated volumes or secure directories that are not
  directly mapped to public static file routes, preventing unauthorized script execution or direct traversal.
* **Use Streaming Parsers for Large Payloads:** Opt for streaming parsers like `busboy` or `multer` disk storage rather
  than buffering massive multi-gigabyte uploads into server RAM.
* **Implement Chunked Uploads for Gigabyte Files:** Break exceptionally large media files or datasets into manageable
  chunks client-side, reassembling them securely on the backend to prevent request timeouts and gateway proxy drops.
* **Sanitize Filename Characters:** Strip out dangerous control characters, special symbols, spaces, and path injection
  sequences (`../`) before persisting any stored filename to a database or disk.
* **Scan Uploads for Malware:** Integrate automated virus scanning or quarantine hooks for user-generated files before
  marking them as safe for general consumption or internal processing.
* **Restrict Storage Permissions:** Ensure the execution user running your Node.js server has minimal write privileges,
  restricting directory permissions tightly to prevent unauthorized system modifications.
* **Handle Multer Errors Gracefully:** Implement dedicated error-handling middleware to catch `MulterError` exceptions
  and return clean, structured JSON responses for oversize payloads or unexpected field names.
* **Enforce Strict Authentication on Upload Endpoints:** Ensure all file upload routes are protected by robust
  authorization tokens, verifying that only permitted users can push files to the server.
* **Implement Automatic Cleanup Routines:** Schedule cron jobs or background workers to purge orphaned temporary upload
  parts or abandoned chunked sessions from scratch directories.
* **Validate Chunk Assembly Sequence:** Verify `chunkIndex` and `totalChunks` parameters rigorously during multi-part
  chunk reassembly to prevent missing data gaps or malicious offset overflows.
* **Disable Script Execution in Upload Directories:** Configure web servers (like Nginx or Apache) to prohibit executing
  scripts or running PHP/Node binaries inside the designated upload storage folders.
* **Use Cloud Object Storage for Scale:** Offload permanent file persistence from local server disks to scalable managed
  blob storage (such as AWS S3 or Google Cloud Storage) using pre-signed URLs when possible.
* **Log Upload Audit Trails:** Record metadata including user IDs, timestamps, original filenames, file hashes, and IP
  addresses to maintain forensic traceability for security audits.
* **Cancel In-Flight Uploads Cleanly:** Implement `AbortController` signals on client fetch requests or handle
  connection aborts on the server to release locked streams immediately when users cancel uploads.
* **Test Upload Failures Under Network Throttling:** Validate client and server behavior under simulated poor network
  conditions, dropped packets, and sudden connection timeouts.
