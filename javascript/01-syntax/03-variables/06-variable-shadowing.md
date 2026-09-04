# Variable Shadowing (Name Masking)

* **Shadowing Operational Rule:** Variable shadowing occurs when an identifier declared within an inner nested scope
  (such as a functional body, conditional block, or loop state) shares an identical name token with a variable declared
  in an outer parent scope.


* **Identifier Masking:** At the lexical lookup level, the inner variable completely masks the outer identifier
  reference. When the engine performs a dynamic scope chain lookup to resolve that token name, it reads outward and
  halts searching the exact millisecond it hits the nearest inner environment record.


* **State Isolation:** The outer scope variable remains completely unmodified and temporarily hidden from the inner
  execution thread. Once the inner scope layer exits and its environment record is popped or dereferenced, the outer
  variable binding regains visibility.


* **TDZ Shadowing Collision:** If an inner block declares a shadowing variable using `let` or `const`, it immediately
  establishes a fresh Temporal Dead Zone for that identifier inside that specific block. Any attempt to read the outer
  variable of the same name within that zone will fail and throw a `ReferenceError` rather than falling back to the
  parent scope.

```javascript
// Variable Shadowing & TDZ Collision Architecture Demo
const structuralValue = "Outer Root"; // Outer Identifier bound at root scope

if (true) {
    // --- Start of Inner Block Scope Layer ---
    // The line below would throw a ReferenceError because the inner let shadows the outer reference, 
    // immediately creating a local Temporal Dead Zone for 'structuralValue'.
    console.log(structuralValue);        // Logs: ReferenceError: Cannot access 'structuralValue' before initialization

    let structuralValue = "Inner Block"; // Shadowing variable masks the outer reference completely
    console.log(structuralValue);        // Logs: "Inner Block"
    // --- End of Inner Block Scope Layer ---
}

console.log(structuralValue);          // Logs: "Outer Root" (Outer state remains unmutated)
```
