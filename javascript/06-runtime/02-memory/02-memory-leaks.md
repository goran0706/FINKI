# Memory Leaks

## Core Concepts & Definition

**Memory Leak:** A subtle defect where memory that is no longer needed by the application fails to be released back to
the system or heap pool, gradually degrading application performance or causing crashes.

| Aspect         | Description / Impact                                                                                                                    |
|:---------------|:----------------------------------------------------------------------------------------------------------------------------------------|
| **Root Cause** | Unwanted retention of references, keeping objects reachable from execution roots long after they are functionally obsolete              |
| **Symptoms**   | Increasing memory consumption over time, sluggish UI performance, garbage collection pauses, and eventual browser out-of-memory crashes |

## Common Causes of Memory Leaks

| Cause / Scenario                | Mechanism of Retention                                                                                                                                                | Prevention Strategy                                                                                 |
|:--------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------|:----------------------------------------------------------------------------------------------------|
| **Global Variables**            | Accidentally attaching variables to the global scope (e.g., omitting `const`/`let`, or using `this` in global contexts) keeps them reachable indefinitely.            | Use strict mode (`"use strict"`), local scoping, and linters to catch undeclared variables.         |
| **Forgotten Event Listeners**   | Adding listeners to global targets (`window`, `document`) or long-lived elements without removing them keeps the listener callbacks and their enclosing scopes alive. | Explicitly call `removeEventListener` during cleanup cycles (e.g., component unmount phases).       |
| **Detached DOM Nodes**          | Storing references to DOM elements in JavaScript variables after they have been removed from the document tree keeps the entire node tree in memory.                  | Clear DOM element references by setting them to `null` once removed from the active layout.         |
| **Timers & Intervals**          | Active `setInterval` or `setTimeout` callbacks retain references to variables in their scope until cleared.                                                           | Always clear timers using `clearInterval` or `clearTimeout` when components or processes terminate. |
| **Closures Holding References** | Inner functions retaining lexical scopes can inadvertently keep large outer data structures alive longer than necessary.                                              | Minimize captured variables inside closures or nullify unused scope references.                     |
| **Circular References**         | Objects referencing each other (historical issue in reference counting, though handled by modern Mark-and-Sweep, can still cause issues if anchored to roots).        | Break intentional circular links by clearing reference properties when objects are disposed.        |

## Best Practices

* **Cleanup side effects:** Always pair resource allocations (listeners, timers, subscriptions) with corresponding
  cleanup logic.
* **Audit global state:** Limit the lifetime of global objects and singleton stores to prevent perpetual memory
  retention.
* **Remove event listeners on unmount:** Explicitly call `removeEventListener` for every listener added to window,
  document, or long-lived nodes when components or views are destroyed.
* **Clear active timers diligently:** Always invoke `clearInterval` and `clearTimeout` inside cleanup routines to
  prevent lingering callbacks from holding lexical scopes in memory.
* **Avoid accidental global variables:** Use strict mode (`"use strict"`) and modern build tools to catch undeclared
  variable assignments that default to the global scope.
* **Nullify detached DOM node references:** Clear object variables pointing to removed DOM elements by setting them to
  `null` to ensure the entire node tree can be garbage collected.
* **Be mindful of closure scope retention:** Avoid capturing massive outer data structures inside inner functions or
  long-lived callbacks when only small properties are required.
* **Unsubscribe from reactive streams and observers:** Ensure explicit teardown or unsubscription calls are made for
  RxJS observables, event emitters, and pub/sub patterns.
* **Dispose of third-party library instances:** Call explicit destroy methods on heavy plugins, charts, or editors (like
  canvas or map instances) before removing them from the DOM.
* **Use `WeakMap` and `WeakSet` for metadata storage:** Leverage weak collections to store data associated with objects
  without preventing those objects from being garbage collected.
* **Avoid storing state in static class properties:** Restrict long-lived static collections or caches from growing
  infinitely without an eviction strategy or size limit.
* **Profile memory usage regularly:** Utilize browser DevTools memory panels, heap snapshots, and allocation timelines
  to detect and diagnose memory leaks early.
* **Break circular references on disposal:** Explicitly clear interdependent object references when tearing down complex
  data structures or graph nodes.
* **Clear interval polling when idle:** Stop background polling intervals or web sockets when applications enter
  background tabs or inactive states.
* **Limit cache sizes using LRU patterns:** Implement Least Recently Used (LRU) eviction algorithms or TTL expirations
  for in-memory caching layers to prevent unbounded growth.
* **Clean up Web Workers and Broadcast Channels:** Terminate active web workers, close message channels, and disconnect
  broadcast streams when they are no longer needed.
* **Avoid holding DOM node references in closures:** Ensure event handlers attached to elements do not capture parent
  component instances or large local scopes unnecessarily.
* **Release canvas and WebGL contexts:** Free up GPU textures, buffers, and rendering contexts explicitly when tearing
  down graphics-heavy view components.
* **Audit singletons for retained state:** Ensure global singleton stores or application state containers clear stale
  data and old collections during route changes or user logouts.
* **Write automated memory regression tests:** Incorporate performance profiling checks into continuous integration
  pipelines to catch memory leaks before production deployment.
* **Avoid retaining large payloads in error logs:** Ensure exception handling blocks do not capture and retain massive
  payload objects or request states indefinitely.
* **Nullify callback references in asynchronous queues:** Clean up pending promise resolutions or deferred callbacks if
  components unmount before async tasks settle.
* **Monitor detached DOM counts in DevTools:** Regularly check heap snapshot summaries for detached DOM tree counts to
  catch lingering node leaks instantly.
* **Keep component lifecycles strictly synchronized:** Align data subscriptions and resource bindings precisely with UI
  component mount and unmount lifecycles.
* **Educate engineering teams on GC mechanics:** Ensure developers understand how JavaScript's Mark-and-Sweep garbage
  collection algorithm determines reachability from roots.