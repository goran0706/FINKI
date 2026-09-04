# Primitive vs Reference Types

* **Memory Representation:**
    * *Primitive Types:* Stored directly inside the execution stack allocation for the running context. The memory slot
      reserved for the identifier holds the raw literal primitive value itself.
    * *Reference Types:* Allocated dynamically within the unmanaged memory heap. The stack slot allocated to the
      identifier does not hold the actual object data; instead, it holds a fixed-size reference pointer pointing
      directly to the object's location in the heap.
    * *Engine-Level Layout:* In practice (e.g., V8), a heap object is not a copy of its literal syntax. It is a fixed
      header holding a pointer to a shared **hidden class** ("Map") that describes the object's shape and property
      offsets, followed by value slots holding either inline tagged values or further pointers. The property *name*
      exists once, in the shared shape descriptor — not duplicated inside every object instance.


* **Copy Behavior:**
    * *Primitive Copying:* Copying a primitive replicates the exact literal value into a fresh, isolated stack memory
      cell. The two variables remain completely independent.
    * *Reference Copying:* Copying a reference duplicates *only* the stack reference pointer. Both the original variable
      and the newly assigned variable now point to the exact same physical object in the heap. Mutating a property
      through one variable is instantly reflected across the other.


* **Pass by Value Operations:** JavaScript passes all parameters to function scopes explicitly by value. For primitive
  arguments, a literal duplicate of the value is pushed onto the local functional call stack, keeping the outer scope
  completely isolated from modification.


* **Pass by Reference Concepts:** When passing reference types, the value passed to the functional argument is the
  reference pointer itself. The function receives a copy of the pointer, meaning it can mutate the properties of the
  underlying heap object directly. However, reassigning the parameter identifier inside the function breaks this link,
  redirecting the local pointer to a new address while leaving the outer reference untouched.


* **Primitive Autoboxing (Wrapper Objects):** Primitives do not naturally possess methods or properties. When a method
  or property is invoked on a primitive string, number, or symbol (e.g., `str.toLowerCase()`), the JavaScript engine
  instantly triggers an internal protocol called **Autoboxing**. It temporarily creates a transient object wrapper
  (using the internal `String`, `Number`, or `Symbol` object constructors) to execute the property lookup. The instant
  the expression completes evaluation, this temporary wrapper object is discarded and marked for immediate garbage
  collection.

## Primitive vs Reference Types Examples

```javascript
// 1. Primitive Allocation (Call Stack)
// Primitives are fixed in size and stored directly on the Call Stack.
let score = 100;

// 2. Reference Allocation (Memory Heap)
// The object is created in the Memory Heap, and `userProfile` holds a reference pointer.
let userProfile = {
    username: "coder123",
    active: true
};

// 3. Creating a Second Reference
// Both `userProfile` and `adminProfile` point to the exact same object in the Memory Heap.
let adminProfile = userProfile;

// 4. Removing References
// We remove the first reference. 
userProfile = null;

// The object in the Heap is NOT garbage collected yet because `adminProfile` still points to it. 
// The reference count is 1.
console.log(adminProfile.username); // "coder123"

// 5. Removing the Final Reference
// Now, no variables point to the heap object. The reference count drops to 0.
adminProfile = null;

// The Garbage Collector's mark-and-sweep algorithm will now identify 
// this object as unreachable during its next cycle and free up its memory.
```

## Engine-Level Deep Dive: What's Actually in the Heap

The `0x0012FA → { age: 20 }` shorthand used above is notation for humans. Here's the literal mechanism underneath it
(V8-specific, but structurally similar in other engines):

```javascript
let count = 20;
let user = {age: 20};
```

**Stack (fixed-size tagged words, one per variable):**

```
Address   Identifier   Raw word stored
0x001     count        0x28              (Smi tag: 0x28 = 20 << 1, tag bit 0 = "value")
0x002     user         0x0012FA          (tag bit 1 = "this is a pointer to the heap")
```

`count`'s slot doesn't hold a plain "20" — it holds a tagged Smi: the integer shifted left one bit with a `0` tag bit
appended, so the engine can tell at the bit level "this word IS a value, don't dereference it." `user`'s slot holds
`0x0012FA` tagged with a `1` bit — "this word is an address, go follow it."

**Heap at `0x0012FA` — the object instance itself (fixed-size header + inline slots, not JS syntax):**

```
Address     Word            Content
0x0012FA    Word 0          → pointer to Map (hidden class) at 0x00A200
0x0012FA+8  Word 1          → pointer to Properties backing store (empty here)
0x0012FA+16 Word 2          → pointer to Elements backing store (empty, not an array)
0x0012FA+24 Word 3          → 0x28   (Smi-tagged 20 — the "age" value, stored inline)
```

**Heap at `0x00A200` — the Map (shape descriptor), a separate allocation:**

```
Address     Content
0x00A200    Shape descriptor: property "age" → in-object offset 3, type Smi
```

The literal text `"age"` exists once, here in the Map — not inside the object instance at `0x0012FA` at all. Every other
object created later with the exact same shape (`{ age: <number> }`) gets its own header + Word 3 slot, but reuses a
pointer to this same Map at `0x00A200`, rather than each object storing its own copy of the property name.

**Walking `user.age` at runtime:**

1. Read stack slot `0x002` → get pointer `0x0012FA`.
2. Follow it to the object header → read Word 0 → get Map pointer `0x00A200`.
3. Look up "age" in the Map → Map says "offset 3, inline."
4. Jump directly to `0x0012FA + Word 3` → read `0x28` → untag it → `20`.

That's the concrete mechanism underneath the `0x0012FA → { age: 20 }` shorthand — a pointer to a header block whose
words are either tagged raw values or further pointers, with the property names living separately in a shared shape
descriptor rather than inside each object.
