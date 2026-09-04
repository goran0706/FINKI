## Appendix: Specific Engine Implementations

### V8 Engine Architecture (Chrome / Node.js / Deno)

An open-source C++ engine developed by Google. It compiles ECMAScript source text directly into native machine code
utilizing a multi-tier pipeline:

* **Ignition:** A fast, low-latency interpreter that generates and executes bytecode from the AST.
* **TurboFan:** An optimizing JIT compiler that handles hot bytecode paths and converts them into highly optimized
  machine code based on runtime type feedback.

### SpiderMonkey Engine Architecture (Firefox)

The foundational JavaScript engine created by Brendan Eich in 1995, managed by Mozilla. It operates via a multi-tiered
compilation pipeline:

* **WarpMonkey:** The primary optimizing JIT compiler replacing older JIT iterations to improve performance.
* **CacheIR:** An intermediate representation layer specifically optimized to handle hidden class tracking and inline
  caching structures.