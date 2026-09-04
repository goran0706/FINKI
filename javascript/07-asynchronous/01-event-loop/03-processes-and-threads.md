# Processes and Threads

## Core Concepts & Thread Models

**Process vs. Thread:** A process is an independent execution environment managed by the operating system, possessing
its own isolated memory space, system resources, and security profile. A thread is the smallest unit of execution within
a process, sharing the parent process's memory space, file descriptors, and resources while executing instructions
concurrently.

* **Process vs thread**
* **JavaScript thread model**
* **Browser threads**
* **Node.js runtime model**

## Deep-Dive Architectural Breakdown

| Concept / Mechanism         | Comprehensive Description & Engine Behavior                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|:----------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Process vs. Thread**      | • **Memory Isolation:** Processes operate in separate memory address spaces, meaning crashing one process or corrupting its memory does not directly impact another.<br>• **Resource Sharing:** Threads within the same process share heap memory, global variables, and open files, making inter-thread communication fast but vulnerable to race conditions and memory corruption.<br>• **Context Switching Overhead:** Operating system context switching between heavy processes is significantly more resource-intensive than switching between lightweight execution threads.                                                        |
| **JavaScript Thread Model** | • **Single-Threaded Engine Core:** An individual JavaScript engine instance (such as V8) executes on a single main thread, utilizing a single call stack and memory heap.<br>• **Event Loop Coordination:** To perform non-blocking operations despite having only one execution thread, JavaScript delegates I/O and time-based tasks to external system or browser facilities managed by an event loop.<br>• **Shared-Nothing Concurrency:** The core engine avoids traditional multi-threaded locking issues by processing all JS execution sequentially on its main thread.                                                            |
| **Browser Threads**         | • **Multi-Threaded Architecture:** Modern web browsers are complex multi-process applications containing separate processes for the browser UI, GPU rendering, network operations, and individual tab renderers.<br>• **Main Render Thread:** Within each tab renderer process, a single main thread handles DOM layout, style calculation, JavaScript execution, and UI painting.<br>• **Background Worker Support:** Browsers provide specialized background threads (such as Web Workers, Service Workers, and compositor threads) to offload heavy computations and rendering optimizations away from the main UI thread.              |
| **Node.js Runtime Model**   | • **Event-Driven Backend:** Node.js runs on a single-threaded event loop architecture utilizing Google's V8 engine and the `libuv` library.<br>• **Libuv Thread Pool:** For operations that cannot be handled non-blockingly by the operating system kernel (such as heavy filesystem access, DNS lookups, and crypto operations), `libuv` manages a dedicated background thread pool (default size of 4, configurable via `UV_THREADPOOL_SIZE`).<br>• **Asynchronous I/O Delegation:** Network I/O is delegated directly to non-blocking OS system calls (like epoll or kqueue), while CPU-heavy tasks leverage the internal thread pool. |

## Comprehensive Execution Workflow

1. **Host Container Initialization:** The operating system spawns the host application process (e.g., Chrome browser tab
   or Node.js process), allocating dedicated memory spaces and initial system resources.
2. **Main Thread Bootstrapping:** The core JavaScript engine initializes its primary execution thread, establishing the
   call stack, memory heap, and global execution context.
3. **Task Delegation & Offloading:** When code encounters asynchronous operations or system-level I/O, the runtime
   routes the task either to OS kernel handles, browser Web APIs, or Node.js worker thread pools.
4. **Synchronization via Event Loop:** Once background processing finishes, resulting callbacks are pushed back to the
   main JavaScript thread through queues, ensuring safe execution without concurrent memory collisions.

## Best Practices

* **Offload CPU-heavy computations:** Delegate intensive algorithmic tasks to Web Workers (in browsers) or Worker
  Threads (in Node.js) to prevent blocking the primary execution thread.
* **Tune thread pools cautiously:** Adjust Node.js thread pool limits (`UV_THREADPOOL_SIZE`) only when application
  profiles indicate heavy concurrent filesystem or crypto bottlenecks.
* **Prevent data corruption hazards:** Use safe messaging passing (`postMessage`) rather than shared memory patterns
  when communicating between isolated worker threads.