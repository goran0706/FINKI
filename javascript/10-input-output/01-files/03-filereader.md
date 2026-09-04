# JavaScript FileReader API

## Overview of FileReader

`FileReader` is an asynchronous, event-driven browser API that reads the contents of `File` and `Blob` objects into
memory. Because file I/O could otherwise block the main thread, every read operation is non-blocking and reports
progress and completion through events rather than return values. `FileReader` cannot read arbitrary paths from disk —
it only operates on `File`/`Blob` objects already handed to the script by a user gesture (file input, drag-and-drop) or
generated in-memory.

| Trait                    | Behavior                                                                          |
|:-------------------------|:----------------------------------------------------------------------------------|
| **Execution Model**      | Fully asynchronous; results delivered via events, not return values               |
| **Input Types Accepted** | `File` objects and `Blob` objects (a `File` is a subclass of `Blob`)              |
| **Reusability**          | A single instance can be reused for sequential reads, but not for concurrent ones |
| **Cancellation**         | Supported via `reader.abort()`                                                    |

## Creating a FileReader Instance

```javascript
const reader = new FileReader();
```

Each `FileReader` instance is a standalone `EventTarget`. It is common practice to instantiate a new reader per read
operation, or to reuse one instance sequentially as long as you wait for the prior read to finish.

## Reading Methods

`FileReader` exposes four distinct methods, each converting the binary source into a different output format. Only one
read method should be called per instance at a time.

| Method                                        | Output Type              | Typical Use Case                                                                 |
|:----------------------------------------------|:-------------------------|:---------------------------------------------------------------------------------|
| **`readAsText(file, encoding?)`**             | `string`                 | Plain text, JSON, CSV, XML, source code files                                    |
| **`readAsDataURL(file)`**                     | Base64 data URL `string` | Image/video/audio previews via `<img src>`, `<video src>`                        |
| **`readAsArrayBuffer(file)`**                 | `ArrayBuffer`            | Binary parsing, feeding into `Uint8Array`, WebAssembly, or `Blob` reconstruction |
| **`readAsBinaryString(file)`** *(deprecated)* | Raw binary `string`      | Legacy support only; superseded by `ArrayBuffer`                                 |

```javascript
reader.readAsText(file, 'utf-8');
reader.readAsDataURL(file);
reader.readAsArrayBuffer(file);
```

> Calling a second read method before the first finishes throws an `InvalidStateError` DOMException. Wait for `onload`
> or `onloadend` before starting a new read on the same instance.

## Core Events

`FileReader` exposes a full lifecycle of events, allowing fine-grained control over progress reporting, success, and
failure handling.

| Event           | Fires When...                                                                      | `event.target.result` Populated?  |
|:----------------|:-----------------------------------------------------------------------------------|:----------------------------------|
| **`loadstart`** | The read operation begins                                                          | No                                |
| **`progress`**  | Periodically, as data is read (useful for large files)                             | No                                |
| **`load`**      | The read completes successfully                                                    | **Yes**                           |
| **`error`**     | The read fails (permission denied, file removed mid-read, etc.)                    | No (check `reader.error` instead) |
| **`abort`**     | The read is cancelled via `reader.abort()`                                         | No                                |
| **`loadend`**   | Fires after `load`, `error`, or `abort` — the terminal event regardless of outcome | Depends on outcome                |

```javascript
function readFileWithFullLifecycle(file) {
    const reader = new FileReader();

    reader.onloadstart = () => console.log('Read started...');

    reader.onprogress = (event) => {
        if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            console.log(`Progress: ${percent}%`);
        }
    };

    reader.onload = (event) => {
        console.log('Read successful. Result:', event.target.result);
    };

    reader.onerror = () => {
        console.error('Read failed:', reader.error.message);
    };

    reader.onloadend = () => {
        console.log('Read operation finished (success or failure).');
    };

    reader.readAsText(file);
}
```

## Reading Text Files

```javascript
const filePicker = document.querySelector('#file-picker');

filePicker.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
        const content = e.target.result;
        console.log('File content:', content);

        // Example: parse as JSON if applicable
        if (file.type === 'application/json') {
            try {
                const data = JSON.parse(content);
                console.log('Parsed JSON:', data);
            } catch (err) {
                console.error('Invalid JSON:', err.message);
            }
        }
    };

    reader.onerror = () => console.error('Error reading file:', reader.error);

    reader.readAsText(file, 'utf-8');
});
```

## Reading Images for Preview (`readAsDataURL`)

A common pattern is generating instant image previews before any upload occurs, using a base64-encoded data URL as the
`src` of an `<img>` element.

```javascript
function previewImage(file, imgElement) {
    if (!file.type.startsWith('image/')) {
        console.warn('Selected file is not an image.');
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        imgElement.src = e.target.result; // "data:image/png;base64,..."
    };

    reader.readAsDataURL(file);
}

const fileInput = document.querySelector('#avatar-input');
const preview = document.querySelector('#avatar-preview');

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) previewImage(file, preview);
});
```

## Reading Binary Data (`readAsArrayBuffer`)

For non-text formats (images processed byte-by-byte, custom binary protocols, audio/video buffers),
`readAsArrayBuffer()` returns a raw `ArrayBuffer` that can be wrapped in a typed array for byte-level inspection.

```javascript
function inspectFileHeader(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
        const buffer = e.target.result;
        const bytes = new Uint8Array(buffer);

        // Reading the first 4 bytes (common for file signature/magic number checks)
        const header = Array.from(bytes.slice(0, 4))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join(' ');

        console.log('File signature (hex):', header);
        // e.g. "89 50 4e 47" identifies a PNG file
    };

    reader.readAsArrayBuffer(file);
}
```

## Handling Multiple Files

Because `FileReader` processes one file per instance per read, handling multiple files requires either a new
`FileReader` per file or sequential reuse of one instance.

```javascript
function readMultipleFiles(fileList) {
    const files = Array.from(fileList);
    const results = [];

    return Promise.all(
        files.map((file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve({name: file.name, content: e.target.result});
                reader.onerror = () => reject(reader.error);
                reader.readAsText(file);
            });
        })
    );
}

filePicker.addEventListener('change', async (event) => {
    try {
        const results = await readMultipleFiles(event.target.files);
        results.forEach((r) => console.log(r.name, '→', r.content.length, 'chars'));
    } catch (err) {
        console.error('One or more files failed to read:', err);
    }
});
```

## Cancelling a Read (`abort()`)

Long-running reads (very large files) can be cancelled programmatically, which triggers the `abort` event instead of
`load`.

```javascript
const reader = new FileReader();
reader.readAsArrayBuffer(largeFile);

reader.onabort = () => console.log('Read was cancelled by the user.');

// Cancel button handler
document.querySelector('#cancel-btn').addEventListener('click', () => {
    reader.abort();
});
```

## Modern Alternative: Promise-Based `Blob` Methods

Modern browsers implement Promise-returning methods directly on `File`/`Blob`, which internally do the same work as
`FileReader` but integrate naturally with `async/await`, removing the need for manual event wiring in straightforward
cases.

```javascript
async function readFileModern(file) {
    const text = await file.text();            // equivalent to readAsText()
    const buffer = await file.arrayBuffer();    // equivalent to readAsArrayBuffer()
    const stream = file.stream();               // ReadableStream for chunked processing
    return text;
}
```

| Comparison             | `FileReader`                               | Modern `Blob` Methods                                 |
|:-----------------------|:-------------------------------------------|:------------------------------------------------------|
| **Syntax**             | Event-listener based (`onload`, `onerror`) | Promise-based, works with `async/await`               |
| **Progress Reporting** | **Yes**, via the `progress` event          | **No** built-in progress events (must use `stream()`) |
| **Data URL Support**   | **Yes**, via `readAsDataURL()`             | **No** direct equivalent; must manually base64-encode |
| **Browser Support**    | Universal, including very old browsers     | All modern evergreen browsers                         |

Use `FileReader` specifically when you need `readAsDataURL()` output or progress events on large files; otherwise,
prefer the Promise-based `Blob` methods for cleaner code.

## Use Cases

* **Instant Image/Video Previews:** Displaying a thumbnail immediately after file selection using `readAsDataURL()`,
  before any network upload begins.
* **Client-Side CSV/JSON Import:** Reading and parsing user-uploaded data files entirely in the browser using
  `readAsText()` for validation before submission.
* **File Signature Validation:** Inspecting the first few bytes of a file via `readAsArrayBuffer()` to verify actual
  file type against spoofed extensions.
* **Drag-and-Drop Upload Widgets:** Reading files dropped via the `DataTransfer` API using the same `FileReader`
  patterns as `<input type="file">`.
* **Large File Progress Bars:** Using the `progress` event to show real-time read percentage for multi-megabyte file
  uploads.

## Best Practices

* **Always Attach an `onerror` Handler:** Never assume a read will succeed; file access can fail due to permission
  changes, file deletion, or hardware I/O errors mid-read.
* **Use `loadend` for Cleanup Logic:** Attach cleanup code (hiding spinners, re-enabling UI elements) to `loadend`
  rather than `load`, since it fires reliably regardless of success, error, or abort outcomes.
* **Prefer Modern `Blob` Methods for Simple Text/Buffer Reads:** Reach for `await file.text()` or
  `await file.arrayBuffer()` over `FileReader` when progress tracking and data URLs aren't needed to avoid nested event
  callbacks.
* **Don't Reuse an Instance for Concurrent Reads:** Always instantiate a fresh `FileReader` per file when reading
  multiple files in parallel, as a single reader instance can only track one active operation at a time.
* **Check `file.size` Before Reading Large Files:** Warn users or switch to chunked streaming for very large files
  rather than attempting to load massive payloads into memory via `readAsDataURL()` or `readAsText()`.
* **Revoke Memory References After Use:** Discard heavy data URL references and nullify variables once image previews or
  file contents are no longer needed to assist the garbage collector.
* **Wrap Read Operations in Promise Abstractions:** Encapsulate native event-based `FileReader` calls inside custom
  Promise wrappers to streamline asynchronous control flow and error handling.
* **Handle Abort Cleanly:** Always listen for the `abort` event when implementing cancellation buttons to reset loading
  states and clean up partial UI renders.
* **Validate MIME Types Early:** Check `file.type` before invoking specialized read methods to prevent parsing errors or
  unhandled exceptions on unexpected file structures.
* **Monitor Memory Consumption with Progress Events:** Utilize the `progress` event on multi-megabyte files to render
  responsive progress bars without locking up main thread perception.
* **Avoid Sync Read Assumptions:** Remember that even though `FileReader` is asynchronous, reading massive data strings
  into memory on the main thread can cause momentary UI stuttering.
* **Clean Up Event Listeners:** Ensure transient `FileReader` event handlers do not retain closures pointing to
  unmounted DOM components to prevent memory leaks in single-page applications.
* **Guard Against Reader State Errors:** Verify that any active reader instance has fully completed prior operations
  before attempting subsequent reads to avoid throwing `InvalidStateError` exceptions.
* **Sanitize Output Results:** Treat strings and buffers returned by `FileReader` as untrusted inputs before injecting
  them into the DOM or passing them to core application logic.
* **Fallback for Unsupported Formats:** Implement robust checks for legacy encoding types when using `readAsText()` to
  prevent decoding corruption on older browser implementations.