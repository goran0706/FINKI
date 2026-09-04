# JavaScript Blob API

## Overview of the Blob Interface

A `Blob` (Binary Large Object) represents immutable, raw binary data as a file-like object, independent of any actual
filesystem. Blobs are the foundation underneath `File` objects (a `File` is a `Blob` with added `name` and
`lastModified` metadata), and they serve as the standard data container for generating downloads, constructing request
bodies, building object URLs, and processing binary content entirely in memory.

| Trait                      | Description                                                                                 |
|:---------------------------|:--------------------------------------------------------------------------------------------|
| **Immutability**           | Blob content cannot be modified after creation; operations like `slice()` return a new Blob |
| **Data Types Held**        | Text, binary buffers, typed arrays, or other Blobs, combined into one object                |
| **Size Access**            | `blob.size` reports total byte length                                                       |
| **MIME Type**              | `blob.type` optionally tags the data's content type (e.g., `'image/png'`)                   |
| **Relationship to `File`** | `File extends Blob`, adding `name` and `lastModified`                                       |

## Creating a Blob

The `Blob` constructor accepts an array of data parts (strings, `ArrayBuffer`, `TypedArray`, or other `Blob` objects)
and an optional options object specifying the MIME type.

```javascript
// Blob from a plain string
const textBlob = new Blob(['Hello, world!'], {type: 'text/plain'});

// Blob from JSON data
const jsonBlob = new Blob([JSON.stringify({id: 1, name: 'Alice'})], {type: 'application/json'});

// Blob combining multiple parts into one
const multiPartBlob = new Blob(['Header\n', 'Body content\n', 'Footer'], {type: 'text/plain'});

// Blob from binary data (TypedArray)
const bytes = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
const binaryBlob = new Blob([bytes], {type: 'application/octet-stream'});

console.log(textBlob.size); // 13 (bytes)
console.log(textBlob.type); // "text/plain"
```

| Constructor Parameter | Type                                                     | Description                                                     |
|:----------------------|:---------------------------------------------------------|:----------------------------------------------------------------|
| **`parts`**           | `Array<BlobPart>` (strings, `ArrayBuffer`, `Blob`, etc.) | The data segments concatenated into the resulting Blob          |
| **`options.type`**    | `string` (MIME type)                                     | Sets `blob.type`; used by browsers/servers to interpret content |
| **`options.endings`** | `'transparent'` \| `'native'`                            | Controls newline character normalization for text parts         |

## Reading Blob Contents

Modern browsers expose Promise-based reading methods directly on `Blob`, avoiding the need for `FileReader` in most
cases.

```javascript
async function inspectBlob(blob) {
    const text = await blob.text();               // string
    const buffer = await blob.arrayBuffer();       // ArrayBuffer
    const stream = blob.stream();                  // ReadableStream (chunked reading)

    console.log('Text:', text);
    console.log('Byte length:', buffer.byteLength);

    // Reading via stream for large blobs without loading it all at once
    const reader = stream.getReader();
    const {value, done} = await reader.read();
    console.log('First chunk size:', value?.length);
}
```

| Method                   | Return Type            | Notes                                                       |
|:-------------------------|:-----------------------|:------------------------------------------------------------|
| **`blob.text()`**        | `Promise<string>`      | Decodes content as UTF-8 text                               |
| **`blob.arrayBuffer()`** | `Promise<ArrayBuffer>` | Raw binary access, ideal for typed array processing         |
| **`blob.stream()`**      | `ReadableStream`       | Chunked reading without loading the entire blob into memory |

## Slicing Blobs

`slice()` extracts a byte range from a Blob without copying the underlying data eagerly, returning a new, smaller
`Blob`. This is the mechanism behind chunked file uploads.

```javascript
function chunkBlob(blob, chunkSize) {
    const chunks = [];
    let offset = 0;

    while (offset < blob.size) {
        const chunk = blob.slice(offset, offset + chunkSize, blob.type);
        chunks.push(chunk);
        offset += chunkSize;
    }

    return chunks;
}

const chunks = chunkBlob(largeFile, 1024 * 1024); // 1MB chunks
console.log(`Split into ${chunks.length} chunks.`);
```

| `slice()` Parameter | Description                                | Default      |
|:--------------------|:-------------------------------------------|:-------------|
| **`start`**         | Byte offset to begin the slice (inclusive) | `0`          |
| **`end`**           | Byte offset to end the slice (exclusive)   | `blob.size`  |
| **`contentType`**   | MIME type to assign the resulting Blob     | `''` (empty) |

## Creating Object URLs

`URL.createObjectURL()` generates a temporary, in-memory URL string that references a Blob, allowing it to be used
anywhere a URL is expected — image sources, download links, video players — without a network round-trip.

```javascript
const imageBlob = new Blob([imageBuffer], {type: 'image/png'});
const objectURL = URL.createObjectURL(imageBlob);

const img = document.querySelector('#preview');
img.src = objectURL;

// CRITICAL: Revoke the URL once no longer needed to free memory
img.onload = () => URL.revokeObjectURL(objectURL);
```

| Function                        | Purpose                                                                  |
|:--------------------------------|:-------------------------------------------------------------------------|
| **`URL.createObjectURL(blob)`** | Returns a `'blob:https://...'` URL string referencing the Blob in memory |
| **`URL.revokeObjectURL(url)`**  | Releases the reference, allowing garbage collection of the Blob data     |

> Object URLs are **not** automatically released. Each unreleased URL keeps its Blob pinned in memory for the lifetime
> of the document, so failing to call `revokeObjectURL()` in long-running apps (SPAs generating many previews) causes a
> memory leak.

## Triggering Downloads from a Blob

The most common practical use of Blob is generating client-side downloads for dynamically created content (exports,
reports, generated files) without any server involvement.

```javascript
function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Example: exporting data as a downloadable CSV
function exportCSV(rows) {
    const csvContent = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
    downloadBlob(blob, 'export.csv');
}

exportCSV([
    ['Name', 'Score'],
    ['Alice', '92'],
    ['Bob', '87']
]);
```

## Using Blobs as Request Bodies

Blobs can be sent directly as the body of a `fetch()` request, useful for raw binary uploads or when constructing a file
server-side isn't necessary.

```javascript
async function uploadBlob(blob, endpoint) {
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': blob.type || 'application/octet-stream'},
        body: blob
    });

    if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
    }

    return response.json();
}
```

## Converting Between Blob, Base64, and ArrayBuffer

```javascript
// Blob -> Base64 Data URL (via FileReader, still the standard approach)
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

// Base64 Data URL -> Blob
async function base64ToBlob(dataUrl) {
    const response = await fetch(dataUrl);
    return response.blob();
}

// ArrayBuffer -> Blob
function arrayBufferToBlob(buffer, mimeType) {
    return new Blob([buffer], {type: mimeType});
}
```

## Blob vs. File vs. ArrayBuffer

| Feature            | `Blob`                                          | `File`                                      | `ArrayBuffer`                                |
|:-------------------|:------------------------------------------------|:--------------------------------------------|:---------------------------------------------|
| **Origin**         | Constructed manually or derived from other data | Selected by the user (input, drag-and-drop) | Raw memory buffer, often derived from a Blob |
| **Metadata**       | `size`, `type`                                  | `size`, `type`, `name`, `lastModified`      | None (just byte length)                      |
| **Mutability**     | Immutable                                       | Immutable                                   | Mutable via typed array views                |
| **Typical Source** | Generated in-app (CSV export, canvas output)    | User file selection                         | Decoded from a Blob or Fetch response        |

## Use Cases

* **Client-Side File Generation:** Building CSV, JSON, or plain-text exports entirely in the browser and offering them
  as downloads without a server round-trip.
* **Canvas/Image Export:** Converting `<canvas>` drawings into downloadable image files via `canvas.toBlob()`.
* **Chunked Uploads:** Slicing large `File` objects into fixed-size `Blob` chunks for resumable or progress-tracked
  uploads.
* **In-Memory Media Previews:** Creating object URLs for images, audio, or video generated or fetched client-side,
  without writing to disk.
* **Binary Protocol Handling:** Converting WebSocket or Fetch binary responses into Blobs for further processing or
  display.

## Best Practices

* **Always Revoke Object URLs:** Invoke `URL.revokeObjectURL()` immediately after an image asset loads, a media element
  starts playing, or a file download triggers to eliminate memory leaks.
* **Set Explicit MIME Types:** Pass accurate `type` options when constructing Blobs (e.g., `text/csv;charset=utf-8;`) to
  ensure browsers and servers interpret the raw binary payload correctly.
* **Prefer `blob.stream()` for Massive Payloads:** Use asynchronous `ReadableStream` reads via `blob.stream()` rather
  than `blob.arrayBuffer()` for multi-gigabyte files to protect memory limits.
* **Use `slice()` for Efficient Chunking:** Slice large Blobs into discrete chunks without duplicating underlying memory
  references when implementing chunked transmission pipelines.
* **Avoid Base64 for Large Files:** Prefer `blob:...` object URLs over bulky base64 data URLs for large images or files
  to prevent unnecessary 33% memory footprint inflation.
* **Clean Up Temporary DOM Nodes:** Remove dynamic download anchor tags (`<a>`) from the document body instantly after
  firing `link.click()` to keep the DOM tree clean.
* **Release File Readers Promptly:** Dispose of `FileReader` instances or abort active processing handlers when
  components unmount to prevent dangling background memory allocations.
* **Handle Stream Backpressure:** Respect consumer read availability when consuming `blob.stream()` chunks to maintain
  stable memory performance during intensive client-side data parsing.
* **Validate Blob Size Before Processing:** Check `blob.size` prior to triggering synchronous read operations (
  `blob.text()`) to guard against out-of-memory crashes on oversized assets.
* **Revoke URLs on Component Unmount:** Track created object URLs in state arrays within single-page applications,
  running a teardown loop to revoke all active handles when components unmount.
* **Use Correct Encoding Parameterization:** Explicitly define text encoding directives (like `charset=utf-8`) in text
  or CSV blob declarations to avoid character corruption across locales.
* **Combine Parts Efficiently:** Pass arrays of heterogeneous chunks (`string`, `TypedArray`, `Blob`) directly into the
  `Blob` constructor rather than manually concatenating buffers in memory.
* **Inspect TypedArray Views Safely:** Ensure `ArrayBuffer` views created from blob conversions maintain proper byte
  alignment to prevent native type coercion exceptions.
* **Monitor Memory Pressure:** Implement garbage collection checks or use performance monitoring tools when handling
  high-frequency blob generation loops in data-heavy client apps.
* **Cache Object URLs Sparingly:** Avoid caching object URLs globally unless persistent app lifecycle reference
  management is strictly guaranteed.
* **Sanitize Generated Content:** Ensure text components fed into string-based Blobs are sanitized if derived from user
  input to protect against injection when rendered via object URLs.
* **Handle Blob Fetch Rejections:** Wrap network conversions from data URLs to Blobs in robust try-catch blocks to
  handle malformed strings gracefully.
* **Leverage Canvas toBlob Asynchronously:** Use `canvas.toBlob()` instead of synchronous data URL methods to export
  high-resolution drawings off the main execution thread.
* **Test Blob Handling in Low-Memory Browsers:** Validate mobile and constrained client environments when processing
  large localized file blobs to ensure stability.
* **Dispose of Reference Pointers:** Nullify variables holding large blob instances once operations complete to expedite
  garbage collector sweep cycles.
