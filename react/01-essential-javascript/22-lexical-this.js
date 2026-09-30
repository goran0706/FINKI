/**
 * Lexical `this`
 * ==============
 *
 * Arrow functions do not have their own `this` value.
 * Instead, they capture `this` from the surrounding lexical scope.
 *
 * This differs from regular functions, whose `this` value is determined
 * by how they are called.
 */

// ---------------------------------------------------------------------
// 1. Arrow functions capture `this`
// ---------------------------------------------------------------------

const user = {
  name: "John",

  greet() {
    const sayName = () => this.name;
    return sayName();
  },
};

console.log(user.greet()); // "John"

// `greet()` is called as a method, so its `this` value is `user`.
// `sayName` is an arrow function, so it captures that same `this` value.

// ---------------------------------------------------------------------
// 2. Regular functions do not inherit `this`
// ---------------------------------------------------------------------

const account = {
  owner: "John",

  describe() {
    function getOwner() {
      "use strict";
      return this.owner;
    }

    // A regular function has dynamically determined `this`.
    // A standalone strict-mode call gives `this` the value `undefined`.
    // return getOwner(); // TypeError: Cannot read properties of undefined

    return this.owner;
  },
};

console.log(account.describe()); // "John"

// The nested regular function does not inherit `this` from `describe`.
// An arrow function would capture the surrounding method's `this` instead.

// ---------------------------------------------------------------------
// 3. Arrow functions preserve method `this`
// ---------------------------------------------------------------------

const profile = {
  name: "Jane",

  getName() {
    const readName = () => this.name;
    return readName();
  },
};

console.log(profile.getName()); // "Jane"

// `getName()` receives `profile` as `this`.
// `readName` captures that value instead of receiving its own `this`.

// ---------------------------------------------------------------------
// 4. Lexical `this` in callbacks
// ---------------------------------------------------------------------

const counter = {
  value: 0,

  incrementLater() {
    setTimeout(() => {
      this.value += 1;
      console.log(this.value); // 1
    }, 0);
  },
};

counter.incrementLater();

// The arrow callback captures `this` from `incrementLater`.
// When the callback runs later, `this` still refers to `counter`.

// ---------------------------------------------------------------------
// 5. Regular callback functions can lose `this`
// ---------------------------------------------------------------------

const timer = {
  value: 0,

  incrementLater() {
    setTimeout(function () {
      "use strict";

      // A regular callback does not inherit `this` from `incrementLater`.
      // `setTimeout` invokes the callback as a standalone function.
      // this.value += 1; // TypeError: Cannot read properties of undefined
    }, 0);
  },
};

timer.incrementLater();

// An arrow callback is useful when the callback needs the surrounding
// method's `this` value.

// ---------------------------------------------------------------------
// 6. Returned arrow functions retain lexical `this`
// ---------------------------------------------------------------------

const object = {
  name: "John",

  createReader() {
    return () => this.name;
  },
};

const reader = object.createReader();

console.log(reader()); // "John"

// `createReader()` is called as a method, so `this` is `object`.
// The returned arrow function captures that `this`.
// Calling `reader()` later does not change the captured value.

// ---------------------------------------------------------------------
// 7. `call`, `apply`, and `bind` cannot change arrow `this`
// ---------------------------------------------------------------------

const objectA = {
  name: "Object A",

  createReader() {
    return () => this.name;
  },
};

const objectB = {
  name: "Object B",
};

const arrowReader = objectA.createReader();

console.log(arrowReader()); // "Object A"
console.log(arrowReader.call(objectB)); // "Object A"
console.log(arrowReader.apply(objectB)); // "Object A"
console.log(arrowReader.bind(objectB)()); // "Object A"

// `arrowReader` captured `objectA` as `this` when it was created.
// `call`, `apply`, and `bind` cannot replace an arrow function's lexical `this`.

// ---------------------------------------------------------------------
// 8. Arrow functions do not receive an object as dynamic `this`
// ---------------------------------------------------------------------

const userWithArrow = {
  name: "John",

  greet: () => this.name,
};

// Calling `userWithArrow.greet()` does not make `userWithArrow` the arrow's `this`.
// The arrow captures `this` from its surrounding lexical scope instead.
// The result can therefore depend on the surrounding execution environment.

// Use regular method syntax when the function should receive the calling
// object as `this`.

const userWithMethod = {
  name: "John",

  greet() {
    return this.name;
  },
};

console.log(userWithMethod.greet()); // "John"

// ---------------------------------------------------------------------
// 9. Lexical `this` and nested callbacks
// ---------------------------------------------------------------------

const shoppingCart = {
  items: ["Laptop", "Keyboard", "Mouse"],

  listItems() {
    return this.items.map((item) => `${this.items.length}: ${item}`);
  },
};

console.log(shoppingCart.listItems());
// ["3: Laptop", "3: Keyboard", "3: Mouse"]

// `listItems()` receives `shoppingCart` as `this`.
// The arrow callback captures that same `this` while `map()` invokes it.

// ---------------------------------------------------------------------
// 10. Preserving `this` with a captured variable
// ---------------------------------------------------------------------

const legacyObject = {
  name: "John",

  getName() {
    const self = this;

    function readName() {
      return self.name;
    }

    return readName();
  },
};

console.log(legacyObject.getName()); // "John"

// Before arrow functions, storing `this` in a variable such as `self`
// was a common way to make the surrounding context available to callbacks.

// ---------------------------------------------------------------------
// 11. Lexical `this` in class methods
// ---------------------------------------------------------------------

class Counter {
  constructor() {
    this.value = 0;
  }

  incrementLater() {
    setTimeout(() => {
      this.value += 1;
      console.log(this.value); // 1
    }, 0);
  }
}

const counterInstance = new Counter();

counterInstance.incrementLater();

// The class method receives the instance as `this`.
// The arrow callback captures that instance.

// ---------------------------------------------------------------------
// 12. Arrow functions have no own `arguments`
// ---------------------------------------------------------------------

function regularFunction() {
  const arrowFunction = () => arguments[0];
  return arrowFunction();
}

console.log(regularFunction("John")); // "John"

// Arrow functions do not create their own `arguments` object.
// The arrow accesses the `arguments` object from `regularFunction`.

// ---------------------------------------------------------------------
// 13. Arrow functions are not constructors
// ---------------------------------------------------------------------

const createUser = (name) => ({
  name,
});

// Arrow functions are not constructable and cannot be called with `new`.
// new createUser("John"); // TypeError: createUser is not a constructor

console.log(createUser("John")); // { name: "John" }

// Arrow functions do not have their own `prototype` property
// and do not provide constructor behavior.

// ---------------------------------------------------------------------
// 14. When lexical `this` is useful
// ---------------------------------------------------------------------

const notification = {
  message: "Saved",

  showLater() {
    setTimeout(() => {
      console.log(this.message); // "Saved"
    }, 0);
  },
};

notification.showLater();

// Lexical `this` is particularly useful when nested asynchronous code
// needs to continue using the surrounding method's object context.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Arrow functions do not have their own `this`.
// - Arrow functions capture `this` from their surrounding lexical scope.
// - Regular functions have dynamically determined `this` based on how they are called.
// - A nested regular function does not automatically inherit `this` from its outer function.
// - Arrow callbacks preserve surrounding `this` in nested and asynchronous code.
// - Calling an arrow function with a different receiver does not change its captured `this`.
// - `call`, `apply`, and `bind` cannot rebind an arrow function's `this`.
// - An arrow function used directly as an object property does not receive the object as `this`.
// - Regular method syntax should be used when an object's receiver should become `this`.
// - Arrow functions do not have their own `arguments` object.
// - Arrow functions are not constructable and cannot be called with `new`.
