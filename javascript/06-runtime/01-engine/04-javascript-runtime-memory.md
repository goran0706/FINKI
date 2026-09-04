## Runtime Memory Concepts

* **Memory Allocation:** The operational process of provisioning hardware memory space. The engine automatically handles
  allocation: primitive values are mapped directly to memory contexts, while structural object entities require dynamic
  sizing properties on the memory heap.


* **Memory Stack:** A structured, contiguous, and fixed-size LIFO memory layout region. It stores execution context
  frames, parameters, evaluation pointers, and local references pointing to heap memory allocations.


* **Memory Heap:** A vast, unorganized, and non-linear memory pool used for dynamic memory allocations. It holds complex
  reference data types (objects, closures, arrays, functions, and dynamically resized string values) whose total memory
  footprints cannot be calculated prior to execution.


* **Garbage Collection (GC):** An automated background memory reclamation system. The engine monitors reference
  allocations using a **Mark-and-Sweep** algorithm. It defines roots (e.g., global object references, active stack
  variables), traces all interconnected object pointer pathways to mark reachable targets, and sweeps away all unmarked
  heap allocations back into the system's available memory pool.