# Reference Types

* **Objects:** Dynamic collections of key-value property mappings stored on the memory heap. Property keys can be
  strings or symbols, and values can point to any primitive or reference structure.


* **Functions:** First-class executable object structures containing an internal block of statements. Because they are
  true object instances, they can be assigned to variables, passed as algorithmic parameters, returned from other
  functions, and appended with arbitrary properties or methods.


* **Arrays:** Ordered, integer-indexed list structures optimized for sequential data access. In JavaScript, arrays are
  specialized objects whose keys are string representations of non-negative integers, automatically synchronized with a
  dynamic `.length` property tracking index boundaries.


* **TypedArrays:** Specialized heap-allocated buffers managing homogeneous, raw binary data (e.g., `Int8Array`,
  `Float64Array`, `Uint8ClampedArray`). Unlike standard JavaScript arrays which are dynamic, string-keyed objects,
  TypedArrays wrap a fixed-length **ArrayBuffer** directly in unmanaged memory for direct byte manipulation.


* **Key-Value Collections (Map and Set):** High-performance lookup structures. A `Map` allows keys of any arbitrary data
  type (including objects and primitives) and guarantees insertion-order iteration. A `Set` is an ordered collection of
  unique values.


* **Weak Collections (WeakMap and WeakSet):** Specialized memory-safe garbage collection variants. They store references
  *weakly*. If a key object in a `WeakMap` or a value object in a `WeakSet` has no other active references remaining in
  the application, the garbage collector destroys it automatically, preventing memory leaks.
