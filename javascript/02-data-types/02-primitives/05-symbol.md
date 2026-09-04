# Symbols Architecture

* **Symbol Primitive Type:** A distinct, completely unique token primitive value that is immutable once created. It is
  used to generate clash-free property identifiers for objects.


* **Creating Symbols:** Generated via the factory function `Symbol()`, with an optional description string used purely
  for debugging diagnostics (`const sym = Symbol("id");`). Invoking the factory always yields a brand new, isolated
  symbol token, meaning `Symbol("id") === Symbol("id")` is always `false`.


* **Symbol.for() Registry:** A centralized global registry for sharing symbols across different script contexts or
  execution realms.
    * `Symbol.for("key")` searches the registry for an existing symbol matching the string token. If found, it returns
      it; if missing, it registers a fresh symbol and returns it.
    * `Symbol.keyFor(sym)` performs the reverse operation, looking up the string token key for a registered symbol
      instance.


* **Symbols as Object Keys:** Used to affix specialized properties to objects without risk of naming collisions from
  external dependencies. Keys assigned via symbols are non-enumerable, meaning they are completely hidden from standard
  reflection routines like `for...in` loops, `Object.keys()`, or `Object.getOwnPropertyNames()`. They can be read
  exclusively via `Object.getOwnPropertySymbols()`.


* **Well-Known Symbols:** Built-in system symbol constants exposed directly on the global `Symbol` constructor object.
  They serve as internal hooks allowing developers to directly modify how the JavaScript engine treats custom object
  operations:
    * `Symbol.iterator`: A method specifying how an object returns its default iterator structure for processing inside
      `for...of` loops.
    * `Symbol.toStringTag`: A string value property used to configure the default string description output of an object
      when parsed by `Object.prototype.toString()`.
    * `Symbol.hasInstance`: A method invoked by the engine to customize how the binary `instanceof` operator verifies an
      object's structural lineage.

## Symbols Examples

```javascript
// 1. Creating Unique Symbols
const sym1 = Symbol("id");
const sym2 = Symbol("id");
console.log(sym1 === sym2); // false (Each factory call creates a brand new unique token)


// 2. Global Symbol Registry (Symbol.for and Symbol.keyFor)
const globalSym = Symbol.for("app.token");
const sameGlobalSym = Symbol.for("app.token");
console.log(globalSym === sameGlobalSym); // true

const registryKey = Symbol.keyFor(globalSym);
console.log(registryKey); // "app.token"


// 3. Symbols as Object Keys (Non-Enumerable Properties)
const idSymbol = Symbol("id");
const user = {
    name: "Alice",
    [idSymbol]: 12345
};

// Hidden from standard reflection methods
console.log(Object.keys(user)); // ["name"]
for (let key in user) {
    console.log(key); // Prints only "name"
}

// Accessed exclusively via getOwnPropertySymbols
console.log(Object.getOwnPropertySymbols(user)); // [Symbol(id)]
console.log(user[idSymbol]); // 12345


// 4. Well-Known Symbols: Symbol.toStringTag
class CustomCollection {
    get [Symbol.toStringTag]() {
        return "CustomCollectionType";
    }
}

const myCollection = new CustomCollection();
console.log(Object.prototype.toString.call(myCollection)); // "[object CustomCollectionType]"
```