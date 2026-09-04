# JavaScript Terminology & Environments

These concepts nest inside one another — each layer wraps and extends the one before it:

```
ECMAScript (spec)
   └─▶ JavaScript Engine (implements the spec)
          └─▶ Runtime / Host Environment (embeds the engine, adds APIs)
                 ├─▶ Browser Environment
                 └─▶ Server Environment
```

## ECMAScript Standard

The specification that defines what JavaScript *is* — syntax, types, operators, core objects. Maintained by Ecma
International (TC39) as ECMA-262. JavaScript is one commercial implementation of this spec.

## JavaScript Engine

The software that turns ECMAScript-compliant code into something a CPU can run: it parses the source, compiles it to
bytecode/machine code, and executes it (e.g., V8, SpiderMonkey, JavaScriptCore). The engine alone only knows the
*language* — it has no concept of a DOM, a filesystem, or a network socket.

## Runtime / Host Environment

The engine on its own can't do anything useful — no I/O, no timers, no output. A runtime **embeds an engine** and
supplies what's missing: global objects, an event loop, and platform-specific APIs. This is the layer where JavaScript
becomes capable of actually doing something (Web Browser, Node.js, Deno, Bun).

## Browser Environment (Client-Side)

A runtime built around rendering a page. Embeds the engine and adds the `window` global, DOM access, Web Storage, the
Fetch API, and a security sandbox that blocks raw system calls.

## Server Environment (Server-Side)

A runtime built around general-purpose computing. Embeds the engine and adds OS-level APIs — filesystem access, raw
network sockets, thread pools — with no DOM, since there's no page to render (e.g., Node.js).