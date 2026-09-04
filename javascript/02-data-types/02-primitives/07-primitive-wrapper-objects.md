# Primitive Wrapper Objects

* **Wrapper Objects Concept:** Temporary object instances created automatically by the JavaScript engine when accessing
  properties or methods on primitive values (except `null` and `undefined`). This mechanism allows primitives to access
  prototype methods without manually instantiating object instances.

* **Autoboxing (Implicit Wrapping):** The runtime mechanism that temporarily wraps a primitive value in its
  corresponding object constructor (`String`, `Number`, `Boolean`, `Symbol`, `BigInt`) to execute a property lookup or
  method call, and immediately disposes of the temporary wrapper object.

  ```javascript
  const str = "hello";
  
  // Autoboxing in action: temporary String object created behind the scenes
  console.log(str.toUpperCase()); // "HELLO"
  console.log(str.length);        // 5
  
  // Attempting to set properties on primitives fails or is ignored
  str.customProp = 42;            // Autoboxed, property set on temporary object, then object discarded
  console.log(str.customProp);    // undefined
  ```

* **Explicit Wrapping Constructors:** Invoking primitive constructors with the `new` keyword explicitly instantiates
  permanent object wrappers. This breaks standard primitive comparisons and type checks, introducing subtle bugs.
    * *Anti-Pattern:* Using `new String()`, `new Number()`, or `new Boolean()`.
    * *Note:* `Symbol()` and `BigInt()` throw a `TypeError` if invoked with `new`.

  ```javascript
  const primitiveNum = 42;
  const objectNum = new Number(42);
  
  typeof primitiveNum;          // "number"
  typeof objectNum;             // "object"
  
  primitiveNum === objectNum;   // false (strict equality fails)
  Boolean(new Boolean(false));  // true (all objects are truthy!)
  ```

* **Type Casting via Constructor Functions:** Invoking `String()`, `Number()`, or `Boolean()` as functions without `new`
  performs explicit type conversion returning primitive values, avoiding the pitfalls of wrapper objects.

  ```javascript
  const rawInput = "100";
  
  const numPrimitive = Number(rawInput);  // Type casting (returns primitive number)
  const strPrimitive = String(100);       // Type casting (returns primitive string)
  const boolPrimitive = Boolean(1);       // Type casting (returns primitive boolean)
  
  typeof numPrimitive;  // "number"
  typeof strPrimitive;  // "string"
  typeof boolPrimitive; // "boolean"
  ```

* **Unboxing via `valueOf()` and `toString()`:** Wrapper object instances can be explicitly converted back to their
  underlying primitive representation using `Object.prototype.valueOf()` or `Object.prototype.toString()`.

  ```javascript
  const wrappedStr = new String("JavaScript");
  
  const unboxedStr = wrappedStr.valueOf(); // Returns primitive "JavaScript"
  typeof unboxedStr;                       // "string"
  ```

* **Performance & Memory Considerations:** Autoboxing is optimized heavily by V8 and modern engines to prevent actual
  heap allocation during simple property access. However, explicitly instantiating wrapper objects via `new` creates
  true heap objects, causing unnecessary allocation overhead and garbage collection pressure inside tight loops.

  ```javascript
  // Optimized by JS engines (no allocation overhead)
  for (let i = 0; i < 100000; i++) {
      const char = "test".charAt(0);
  }
  
  // Heavy memory overhead (allocates 100,000 objects on heap)
  for (let i = 0; i < 100000; i++) {
      const obj = new String("test");
  }
  ```