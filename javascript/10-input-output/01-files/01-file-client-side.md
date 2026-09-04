# JavaScript File Operations: Browser (Client-Side)

## Overview of Browser File Access

Unlike Node.js, browser JavaScript cannot freely read or write arbitrary files on a user's disk due to strict sandboxing
for security. Instead, the browser exposes a permission-gated set of APIs that require explicit user interaction (such
as selecting a file via an `<input>` element or a drag-and-drop action) before any file content becomes accessible to a
script.

| API                                   | Primary Purpose                                    | Requires User Gesture?                       | Persistence Scope                               |
|:--------------------------------------|:---------------------------------------------------|:---------------------------------------------|:------------------------------------------------|
| **File and Blob API**                 | Reading content from user-selected files           | **Yes** (file input or drag-and-drop)        | In-memory only, for the current session         |
| **FileReader API**                    | Asynchronously reading `File`/`Blob` contents      | **Yes** (operates on already-selected files) | In-memory only                                  |
| **File System Access API**            | Direct read/write access to specific files on disk | **Yes** (explicit picker dialog)             | Persistent handle (with granted permission)     |
| **Origin Private File System (OPFS)** | Sandboxed, high-performance virtual filesystem     | **No** (fully sandboxed to origin)           | Persistent, invisible to the user's actual disk |

## Selecting Files via Input Elements

The most common entry point for browser file access is an `<input type="file">` element, which exposes selected files
through the `files` property as a `FileList`.

```html
<input type="file" id="file-picker" accept=".pdf,.docx,image/*" multiple/>
```

```javascript
const filePicker = document.querySelector('#file-picker');

filePicker.addEventListener('change', (event) => {
    const files = event.target.files; // FileList (array-like, not a real Array)

    for (const file of files) {
        console.log('Name:', file.name);
        console.log('Size:', file.size, 'bytes');
        console.log('Type:', file.type);
        console.log('Last Modified:', new Date(file.lastModified));
    }
});
```

| `File` Property    | Description                                            | Example Value       |
|:-------------------|:-------------------------------------------------------|:--------------------|
| **`name`**         | The original filename as selected by the user          | `'report.pdf'`      |
| **`size`**         | File size in bytes                                     | `204800`            |
| **`type`**         | MIME type inferred from the file extension             | `'application/pdf'` |
| **`lastModified`** | Timestamp (milliseconds) of the last file modification | `1769683200000`     |

## Reading File Contents with `FileReader`

Once a `File` object is accessible, its actual content must be read asynchronously using the `FileReader` API, which
supports multiple output formats depending on the intended use.

```javascript
function readTextFile(file) {
    const reader = new FileReader();

    reader.onload = (event) => {
        console.log('File contents:', event.target.result);
    };

    reader.onerror = () => {
        console.error('Failed to read file:', reader.error);
    };

    reader.readAsText(file, 'utf-8');
}

function readImageAsDataURL(file) {
    const reader = new FileReader();

    reader.onload = (event) => {
        const imgElement = document.querySelector('#preview');
        imgElement.src = event.target.result; // base64 data URL
    };

    reader.readAsDataURL(file);
}
```

| `FileReader` Method                     | Output Format                  | Typical Use Case                                                    |
|:----------------------------------------|:-------------------------------|:--------------------------------------------------------------------|
| **`readAsText()`**                      | Plain string                   | Reading `.txt`, `.json`, `.csv` files                               |
| **`readAsDataURL()`**                   | Base64-encoded data URL string | Displaying image previews inline via `<img src>`                    |
| **`readAsArrayBuffer()`**               | Raw binary `ArrayBuffer`       | Processing binary formats, feeding into `Uint8Array` or WebAssembly |
| **`readAsBinaryString()`** (Deprecated) | Raw binary string              | Legacy binary handling; superseded by `ArrayBuffer`                 |

## Modern Async/Await Reading (`Blob` Methods)

Modern browsers support Promise-based methods directly on the `Blob`/`File` interface, eliminating the need for
`FileReader` event listeners in simple cases.

```javascript
async function readFileModern(file) {
    const text = await file.text();              // Returns a string
    const buffer = await file.arrayBuffer();      // Returns an ArrayBuffer
    const stream = file.stream();                 // Returns a ReadableStream for chunked processing

    console.log('Text preview:', text.slice(0, 100));
    console.log('Buffer byte length:', buffer.byteLength);
}
```

## Writing and Downloading Files

Browsers cannot silently write files to disk; any file-saving action must either trigger a download prompt or use the
permission-gated File System Access API.

### Triggering a Download (No Special Permissions Required)

```javascript
function downloadTextFile(filename, content) {
    const blob = new Blob([content], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    // Release the object URL to free memory
    URL.revokeObjectURL(url);
}

downloadTextFile('notes.txt', 'This is saved from the browser.');
```

### File System Access API (Direct Disk Write)

Supported in Chromium-based browsers, the File System Access API allows a script to write directly to a file the user
explicitly grants access to, without repeated download prompts.

```javascript
async function saveWithFileSystemAccess(content) {
    try {
        // Opens a native "Save As" dialog and returns a file handle
        const fileHandle = await window.showSaveFilePicker({
            suggestedName: 'document.txt',
            types: [{description: 'Text Files', accept: {'text/plain': ['.txt']}}]
        });

        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();

        console.log('File saved successfully.');
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('User cancelled the save dialog.');
        } else {
            console.error('Save failed:', error);
        }
    }
}
```

| Approach                     | Repeated Prompts?                            | Browser Support                           | Persistent File Handle? |
|:-----------------------------|:---------------------------------------------|:------------------------------------------|:------------------------|
| **`<a download>` Blob Link** | **Yes** (every save triggers a new download) | Universal (all modern browsers)           | **No**                  |
| **`showSaveFilePicker()`**   | **No** (one grant, then reuse the handle)    | Chromium-based only (Chrome, Edge, Opera) | **Yes**                 |

## Drag-and-Drop File Access

Files dropped from the desktop into the browser are accessible through the `DataTransfer` object during the `drop`
event, following the same `File`/`FileReader` pattern as input elements.

```javascript
const dropZone = document.querySelector('#drop-zone');

dropZone.addEventListener('dragover', (e) => e.preventDefault());

dropZone.addEventListener('drop', async (event) => {
    event.preventDefault();

    const files = event.dataTransfer.files;

    for (const file of files) {
        const text = await file.text();
        console.log(`Dropped file "${file.name}":`, text.slice(0, 200));
    }
});
```

## Origin Private File System (OPFS)

OPFS provides a sandboxed, high-performance virtual filesystem private to the current origin, ideal for applications
needing fast, persistent local storage (such as browser-based databases, code editors, or media editing tools) without
exposing the actual host disk.

```javascript
async function writeToOPFS(filename, content) {
    const root = await navigator.storage.getDirectory();
    const fileHandle = await root.getFileHandle(filename, {create: true});

    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
}

async function readFromOPFS(filename) {
    const root = await navigator.storage.getDirectory();
    const fileHandle = await root.getFileHandle(filename);
    const file = await fileHandle.getFile();

    return await file.text();
}
```

| OPFS Trait           | Behavior                                                            |
|:---------------------|:--------------------------------------------------------------------|
| **Visibility**       | Invisible to the user's actual operating system file explorer       |
| **Performance**      | Optimized for high-throughput synchronous access (via Web Workers)  |
| **Persistence**      | Survives page reloads and browser restarts, scoped to the origin    |
| **Permission Model** | No user gesture required; fully sandboxed and automatically granted |

## Use Cases

* **Client-Side File Preview:** Displaying image thumbnails or PDF previews instantly after a user selects a file,
  before any upload occurs.
* **Offline Code Editors:** Using the File System Access API to open, edit, and save local project files directly from a
  browser-based IDE.
* **CSV/JSON Import Tools:** Reading user-uploaded spreadsheet or data files client-side using `FileReader` or
  `file.text()` for immediate parsing and validation.
* **Exporting Generated Reports:** Triggering a Blob-based download for dynamically generated PDFs, CSVs, or text
  reports without a server round-trip.
* **In-Browser Media Editors:** Leveraging OPFS to cache large working files (video edits, audio projects) locally for
  fast read/write access.

## Best Practices

* **Always Revoke Object URLs:** Prevent severe memory leaks by explicitly calling `URL.revokeObjectURL(url)` the moment
  an auto-generated `<a download>` Blob link is clicked or an image preview is destroyed.
* **Feature-Detect the File System Access API:** Always check `if ('showSaveFilePicker' in window)` before invoking it,
  and implement a fallback to standard Blob-based `<a download>` links for browsers like Firefox and Safari that may
  restrict native OS file pickers.
* **Stream Large Files to Prevent Memory Crashes:** For files exceeding 50MB, avoid `file.arrayBuffer()` or
  `file.text()` which load the entire payload into RAM. Instead, use `file.stream()` to process `Uint8Array` chunks
  sequentially via a `ReadableStream`.
* **Offload OPFS to Web Workers:** Achieve maximum read/write performance in the Origin Private File System by using
  `createSyncAccessHandle()` strictly inside Web Workers to prevent blocking the main UI thread during heavy disk I/O.
* **Trap Picker Abort Errors Explicitly:** Users frequently click "Cancel" on native file picker dialogs. Always wrap
  `showOpenFilePicker()` and `showSaveFilePicker()` in `try...catch` blocks and silently swallow `AbortError` exceptions
  to prevent unhandled promise rejections.
* **Validate Types and Sizes Early:** Check `file.size` against strict application limits (e.g.,
  `if (file.size > 10485760)` for 10MB) and verify `file.type` before allocating memory for processing or initiating
  network uploads.
* **Never Trust Client-Side Validation for Security:** Remember that `file.name` and `file.type` can be easily spoofed
  by malicious users. Always perform deep magic-byte inspection and virus scanning on the backend.
* **Sanitize Filenames Before Use:** Strip path traversal characters (like `../`) and dangerous extensions (`.exe`,
  `.sh`) from `file.name` if the filename is stored, rendered in the DOM, or sent to a database.
* **Use Strict `accept` Attributes:** Guide users by setting precise MIME types and extensions on inputs (e.g.,
  `<input accept="image/jpeg, application/pdf">`), but assume technical users can bypass this UI restriction.
* **Neutralize Drag-and-Drop Defaults:** Always attach `event.preventDefault()` to `dragover`, `dragenter`, and `drop`
  window events; failing to do so will cause the browser to navigate away from your app and open the dropped file
  directly.
* **Prefer Modern Blob Promises Over FileReader:** Replace legacy `FileReader` callback hell with modern, asynchronous
  `await file.text()` and `await file.arrayBuffer()` methods for cleaner, more readable asynchronous execution.
* **Implement OPFS Eviction Logic:** Browsers do not automatically garbage-collect OPFS files. Explicitly call
  `directoryHandle.removeEntry(filename)` when cached media files or offline workspace data are no longer needed to
  prevent permanent origin quota bloat.
* **Handle Directory Iteration Safely:** When recursively reading directories via `showDirectoryPicker()`, implement
  depth limits to prevent stack overflows or browser crashes when a user selects massively nested system folders like
  `node_modules`.
* **Guard Against Sandboxed Iframes:** Anticipate that `showOpenFilePicker` and `showSaveFilePicker` will throw security
  exceptions if invoked inside a cross-origin `<iframe>` without the explicit `allow="cross-origin-isolated"` or
  appropriate permission policies.
* **Request Persistent Storage for OPFS:** If your application relies heavily on OPFS for offline architecture, invoke
  `navigator.storage.persist()` to prevent the browser from automatically evicting your filesystem under severe disk
  pressure.