# JavaScript File Operations: Server-Side (Node.js)

## Overview of the Node.js `fs` Module

Node.js exposes filesystem access through the built-in `fs` module, which provides both synchronous, callback-based, and
Promise-based APIs for reading, writing, and managing files on disk. Unlike browser JavaScript, Node.js runs outside a
sandboxed environment, granting scripts direct read/write access to the host machine's filesystem, subject only to
OS-level permissions.

| API Style          | Import Pattern                            | Execution Model                        | Primary Use Case                                          |
|:-------------------|:------------------------------------------|:---------------------------------------|:----------------------------------------------------------|
| **Callback-Based** | `require('fs')`                           | Asynchronous, error-first callback     | Legacy codebases and libraries predating Promises         |
| **Promise-Based**  | `require('fs/promises')`                  | Asynchronous, `async/await` compatible | Modern application code (recommended default)             |
| **Synchronous**    | `require('fs')` (methods suffixed `Sync`) | Blocks the event loop until completion | CLI scripts, startup configuration loading, build tooling |

## Reading Files

Node.js provides multiple ways to read file contents, ranging from loading an entire file into memory to streaming large
files in chunks.

```javascript
const fs = require('fs/promises');

// Reading an entire file into memory (UTF-8 text)
async function readConfigFile() {
    try {
        const data = await fs.readFile('./config.json', 'utf-8');
        const config = JSON.parse(data);
        console.log('Loaded config:', config);
    } catch (error) {
        console.error('Failed to read config file:', error.message);
    }
}

// Reading raw binary data (no encoding specified returns a Buffer)
async function readImageBuffer() {
    const buffer = await fs.readFile('./logo.png');
    console.log('Buffer length in bytes:', buffer.length);
}
```

| Parameter          | Description                                                             | Example Value                                |
|:-------------------|:------------------------------------------------------------------------|:---------------------------------------------|
| **Path**           | Absolute or relative path to the target file                            | `'./data/users.json'`                        |
| **Encoding**       | Optional string; omitting it returns a raw `Buffer` instead of a string | `'utf-8'`, `'ascii'`, `'base64'`             |
| **Options Object** | Alternative to encoding string, can include `flag` and `signal`         | `{ encoding: 'utf-8', signal: abortSignal }` |

## Writing Files

Writing files can either overwrite existing content entirely or append to it, depending on the method and flags used.

```javascript
const fs = require('fs/promises');

// Overwrites the file completely, or creates it if it does not exist
async function saveUserData(user) {
    await fs.writeFile('./user.json', JSON.stringify(user, null, 2), 'utf-8');
    console.log('User data saved.');
}

// Appends content to the end of an existing file without erasing prior content
async function logActivity(message) {
    const entry = `[${new Date().toISOString()}] ${message}\n`;
    await fs.appendFile('./activity.log', entry, 'utf-8');
}
```

| Method                              | Behavior                                           | File Creation if Missing                |
|:------------------------------------|:---------------------------------------------------|:----------------------------------------|
| **`writeFile()`**                   | Overwrites the entire file content                 | **Yes** (creates the file)              |
| **`appendFile()`**                  | Adds content to the end of the existing file       | **Yes** (creates the file)              |
| **`writeFile()` with `flag: 'wx'`** | Fails if the file already exists (exclusive write) | **Yes**, but throws `EEXIST` if present |

## Streaming Large Files

For files too large to comfortably fit in memory (video, large logs, datasets), Node.js streams read and write data in
manageable chunks, keeping memory usage constant regardless of file size.

```javascript
const fs = require('fs');

// Streaming a large file for reading (chunked processing)
function processLargeLog(path) {
    const readStream = fs.createReadStream(path, {encoding: 'utf-8', highWaterMark: 64 * 1024});

    readStream.on('data', (chunk) => {
        console.log('Received chunk of size:', chunk.length);
    });

    readStream.on('end', () => {
        console.log('Finished reading file.');
    });

    readStream.on('error', (err) => {
        console.error('Stream error:', err.message);
    });
}

// Piping a read stream directly into a write stream (efficient file copy)
function copyLargeFile(source, destination) {
    const readStream = fs.createReadStream(source);
    const writeStream = fs.createWriteStream(destination);

    readStream.pipe(writeStream);

    writeStream.on('finish', () => console.log('Copy complete.'));
}
```

| Stream Type         | Class            | Key Events                      | Memory Behavior                                   |
|:--------------------|:-----------------|:--------------------------------|:--------------------------------------------------|
| **Readable Stream** | `fs.ReadStream`  | `data`, `end`, `error`, `close` | Reads fixed-size chunks (`highWaterMark`)         |
| **Writable Stream** | `fs.WriteStream` | `finish`, `error`, `close`      | Buffers writes internally before flushing to disk |

## File and Directory Management

Beyond reading and writing content, the `fs` module manages file existence checks, deletion, renaming, and directory
structures.

```javascript
const fs = require('fs/promises');
const path = require('path');

async function manageFiles() {
    // Checking existence and metadata
    try {
        const stats = await fs.stat('./report.pdf');
        console.log('File size:', stats.size, 'bytes');
        console.log('Is directory:', stats.isDirectory());
    } catch (error) {
        console.log('File does not exist.');
    }

    // Creating nested directories
    await fs.mkdir('./output/reports/2026', {recursive: true});

    // Renaming or moving a file
    await fs.rename('./draft.txt', './output/final.txt');

    // Deleting a file
    await fs.unlink('./temp.log');

    // Listing directory contents
    const entries = await fs.readdir('./output', {withFileTypes: true});
    entries.forEach((entry) => {
        console.log(entry.name, entry.isDirectory() ? '(dir)' : '(file)');
    });
}
```

| Method             | Purpose                                          | Notes                                                                 |
|:-------------------|:-------------------------------------------------|:----------------------------------------------------------------------|
| **`fs.stat()`**    | Retrieves file metadata (size, timestamps, type) | Throws `ENOENT` if the path does not exist                            |
| **`fs.mkdir()`**   | Creates a new directory                          | Use `{ recursive: true }` to create nested paths safely               |
| **`fs.rename()`**  | Moves or renames a file or directory             | Fails across different filesystems/drives on some platforms           |
| **`fs.unlink()`**  | Deletes a file                                   | Use `fs.rm()` with `{ recursive: true }` for directories              |
| **`fs.readdir()`** | Lists directory contents                         | Pass `{ withFileTypes: true }` to get `Dirent` objects with type info |

## File Watching

Node.js can monitor files and directories for changes, useful for build tools, hot-reloading, and configuration
watchers.

```javascript
const fs = require('fs');

const watcher = fs.watch('./config.json', (eventType, filename) => {
    console.log(`Event: ${eventType} on file: ${filename}`);
    if (eventType === 'change') {
        reloadConfiguration();
    }
});

// Stop watching when no longer needed
process.on('SIGINT', () => {
    watcher.close();
    process.exit();
});
```

## Use Cases

* **Configuration Loading:** Reading JSON or YAML configuration files at application startup using `fs.readFile()`.
* **Log File Management:** Appending structured log entries continuously to a rotating log file using `fs.appendFile()`.
* **Build Tooling and Bundlers:** Watching source directories for file changes to trigger incremental rebuilds.
* **Large Media Processing:** Streaming video or dataset files chunk-by-chunk to avoid loading gigabytes into memory at
  once.
* **Backend File Uploads:** Writing incoming multipart upload streams directly to disk using `fs.createWriteStream()`.

## Best Practices

* **Prefer the Promise-Based API:** Use `require('fs/promises')` with `async/await` instead of legacy callbacks for
  cleaner error handling and structured control flow.
* **Avoid Synchronous Methods in Servers:** Never use `fs.readFileSync()` or `fs.writeFileSync()` inside HTTP request
  handlers or asynchronous middleware, as blocking the main event loop stalls all concurrent client connections.
* **Stream Large Files Instead of Loading Fully:** Use `fs.createReadStream()` and `fs.createWriteStream()` for files
  exceeding a few megabytes to keep memory consumption low and predictable.
* **Always Handle File System Errors Gracefully:** Wrap filesystem operations in `try...catch` blocks and check error
  codes (such as `ENOENT` for missing files or `EACCES` for permission failures) to prevent application crashes.
* **Use `path.join()` or `path.resolve()` for Cross-Platform Paths:** Avoid hardcoding path separators or string
  concatenation to ensure your file paths work correctly across Windows, macOS, and Linux.
* **Close File Watchers and Streams Explicitly:** Always call `.close()` on active file watchers and handle stream
  `finish` or `close` events to prevent file descriptor leaks in long-running Node.js processes.
* **Sanitize User-Supplied Paths:** Prevent path traversal vulnerabilities by validating and normalizing file paths
  using `path.basename()` or checking that resolved paths stay within allowed root directories.
* **Handle Backpressure in Custom Streams:** When writing custom transform streams or piping manual chunks, check the
  boolean return value of `stream.write()` to respect write queue limits and prevent memory bloat.
* **Use Atomic File Writes for Critical Data:** Write temporary configuration or data files to a staging path first,
  then use `fs.rename()` to swap them atomically, preventing data corruption if the process crashes mid-write.
* **Prefer `fs.rm()` Over `fs.rmdir()`:** Use `fs.rm(path, { recursive: true, force: true })` for modern, robust
  recursive deletion of files and directories without deprecation warnings.
* **Set Restrictive File Permissions:** Pass explicit mode parameters (such as `0o600` for private files) when creating
  sensitive files containing tokens, keys, or user data.
* **Watch Directories with Resilience:** Account for multiple duplicate change events or missing file names emitted by
  OS-level file watchers (`fs.watch`) across different platforms.
* **Avoid Race Conditions with Existence Checks:** Instead of checking `fs.access()` before reading or writing, attempt
  the operation directly inside a `try...catch` block to eliminate time-of-check to time-of-use race conditions.
* **Throttle High-Frequency File Watchers:** Implement debouncing logic on build tools or file watch handlers to prevent
  cascading rebuild loops when editors save files in multiple rapid bursts.
* **Use Proper Encoding Parameters:** Explicitly pass `'utf-8'` when reading text configuration files to guarantee
  correct string decoding across different host operating systems.
* **Monitor Open File Descriptors:** Track system resource limits (`ulimit`) in high-throughput servers handling
  thousands of concurrent file streams.
* **Clean Up Temporary Test Files:** Ensure test suites or build scripts delete their temporary file artifacts upon
  completion to avoid filling up host disk space.
* **Validate File Signatures for Uploads:** Check magic bytes of files written from multipart streams rather than
  trusting user-supplied file extensions or MIME headers.
* **Use Streams for HTTP Uploads:** Pipe incoming HTTP request payloads directly into `fs.createWriteStream()` to handle
  large file uploads without buffering them into server RAM.
* **Handle EPERM on Windows File Locks:** Implement retry logic when writing or deleting files on Windows environments
  where antivirus scanners or other processes temporarily lock file handles.
* **Isolate File System Access Logic:** Encapsulate all direct `fs` module calls inside dedicated service layers rather
  than scattering raw disk interactions throughout controllers.
* **Avoid Deeply Nested Sync Loops:** Use asynchronous recursive traversal helpers (`fs.readdir` with
  `{ recursive: true }`) instead of blocking synchronous loops when walking directory trees.
* **Check Disk Space Before Writing Massive Files:** Verify available disk storage via external modules or system checks
  before initiating massive file generation tasks.
* **Handle SIGINT and SIGTERM Gracefully:** Close open file streams and clean up temporary scratch files cleanly when
  application shutdown signals are received.
* **Test File Operations Under Failure Conditions:** Simulate disk full errors, permission denials, and broken symlinks
  in automated integration tests to verify error recovery logic.