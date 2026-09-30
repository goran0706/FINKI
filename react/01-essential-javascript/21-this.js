/**
 * `this`
 * ======
 *
 * `this` is a special value whose value is determined by how a function is called.
 * For regular functions, the call site determines `this`; it is not determined by
 * where the function was defined.
 *
 * Arrow functions behave differently because they do not create their own `this`.
 * Instead, they capture `this` lexically from their surrounding scope.
 */

// ---------------------------------------------------------------------
// 1. `this` inside a method
// ---------------------------------------------------------------------

// When a function is called as an object method, `this` refers to the
// object used as the receiver of the call (`user`).

const user = {
  name: "John",

  greet() {
    return `Hello, ${this.name}!`;
  },
};

console.log(user.greet()); // "Hello, John!"

// ---------------------------------------------------------------------
// 2. The same function can receive different `this` values
// ---------------------------------------------------------------------

// A regular function can be assigned to multiple objects.
// The receiver at the call site determines its `this` value.

function greetUser() {
  "use strict";
  return `Hello, ${this.name}!`;
}

const john = {
  name: "John",

  greet: greetUser,
};

const jane = {
  name: "Jane",

  greet: greetUser,
};

console.log(john.greet()); // "Hello, John!"
console.log(jane.greet()); // "Hello, Jane!"

// The function itself is the same; only the receiver changes.

// ---------------------------------------------------------------------
// 3. Losing the method receiver
// ---------------------------------------------------------------------

// Extracting a method into another variable removes the object from
// the call expression, so the standalone call no longer supplies `user` as `this`.

const profile = {
  name: "John",

  getName() {
    return this.name;
  },
};

const getName = profile.getName;

// `getName()` would throw because classically method syntax does not
// permanently bind the function to the object.
//
// getName(); // TypeError: Cannot read properties of undefined (reading 'name')

// The function is not permanently associated with `profile`.

// ---------------------------------------------------------------------
// 4. `this` in a standalone regular function
// ---------------------------------------------------------------------

// A standalone regular function does not receive an object receiver.
// In strict mode, `this` is therefore `undefined`.

function showThis() {
  "use strict";
  return this;
}

console.log(showThis()); // undefined

// This makes standalone-call behavior deterministic regardless of
// whether the surrounding file is executed as a script or module.

// ---------------------------------------------------------------------
// 5. `this` in nested regular functions
// ---------------------------------------------------------------------

// A nested regular function does not inherit the `this` value of the
// surrounding method. Its own call determines its `this` value.

const team = {
  name: "Engineering",

  describe() {
    function getName() {
      "use strict";
      return this.name;
    }

    // `getName()` is a standalone call, so `this` is `undefined`.
    // return getName(); // TypeError: Cannot read properties of undefined
    return this.name;
  },
};

console.log(team.describe()); // "Engineering"

// A nested regular function needs explicit binding, a receiver,
// or another mechanism if it needs the surrounding `this`.

// ---------------------------------------------------------------------
// 6. `this` with explicit binding
// ---------------------------------------------------------------------

// `call`, `apply`, and `bind` allow a regular function to receive
// an explicitly selected `this` value.

function introduce() {
  "use strict";
  return `My name is ${this.name}.`;
}

const person = {
  name: "John",
};

console.log(introduce.call(person)); // "My name is John."
console.log(introduce.apply(person)); // "My name is John."

// `bind()` does not invoke the function immediately.
// It returns a new function whose `this` value is permanently bound.

const introduceJohn = introduce.bind(person);

console.log(introduceJohn()); // "My name is John."

// ---------------------------------------------------------------------
// 7. `this` with constructors
// ---------------------------------------------------------------------

// When a regular function is called with `new`, JavaScript creates a new
// object, uses that object as `this`, and returns the instance unless
// the constructor explicitly returns another object.

function User(name) {
  this.name = name;
}

const userInstance = new User("John");

console.log(userInstance.name); // "John"

// Constructor functions are regular functions that can be invoked with `new`.

// ---------------------------------------------------------------------
// 8. `this` in a class method
// ---------------------------------------------------------------------

// Class methods use the receiver-based method-call rule.
// When called through an instance, `this` refers to that instance.

class Counter {
  constructor() {
    this.value = 0;
  }

  increment() {
    this.value += 1;
  }

  getValue() {
    return this.value;
  }
}

const counter = new Counter();

counter.increment();

console.log(counter.getValue()); // 1

// ---------------------------------------------------------------------
// 9. Extracting a class method
// ---------------------------------------------------------------------

// Class methods are strict-mode functions, but they are not automatically
// bound to their instance. Extracting one still loses the receiver.

class UserProfile {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}

const userProfile = new UserProfile("John");
const profileName = userProfile.getName;

// `profileName()` would throw because the extracted method receives
// `undefined` as `this` when called as a standalone function.
//
// profileName(); // TypeError: Cannot read properties of undefined

// Binding preserves the intended receiver.

const boundGetName = userProfile.getName.bind(userProfile);

console.log(boundGetName()); // "John"

// ---------------------------------------------------------------------
// 10. `this` and callback functions
// ---------------------------------------------------------------------

// Passing a method as a callback extracts the function from its original
// receiver. The callback invocation does not automatically preserve `this`.

const notification = {
  message: "Saved",

  show() {
    return this.message;
  },
};

function execute(callback) {
  return callback();
}

// `notification.show` is passed as a standalone function.
// Its original receiver is not preserved.
//
// console.log(execute(notification.show)); // TypeError

// Bind the method when the callback needs the original receiver.

console.log(execute(notification.show.bind(notification))); // "Saved"

// ---------------------------------------------------------------------
// 11. `this` in arrow functions
// ---------------------------------------------------------------------

// Arrow functions do not create their own `this`.
// They capture `this` from the surrounding lexical scope.

const settings = {
  name: "John",

  getName() {
    const readName = () => this.name;
    return readName();
  },
};

console.log(settings.getName()); // "John"

// The arrow function uses the `this` value of `getName()`.

// ---------------------------------------------------------------------
// 12. Arrow functions cannot change their `this` with `call`, `apply`, or `bind`
// ---------------------------------------------------------------------

// `call`, `apply`, and `bind` can control `this` for regular functions,
// but they do not replace the lexical `this` captured by an arrow function.

const objectA = {
  name: "Object A",
};

const objectB = {
  name: "Object B",
};

function createReader() {
  return () => this.name;
}

const readName = createReader.call(objectA);

console.log(readName()); // "Object A"
console.log(readName.call(objectB)); // "Object A"

// The arrow function keeps the `this` captured when it was created.

// ---------------------------------------------------------------------
// 13. `this` is not determined by the definition object
// ---------------------------------------------------------------------

// A function can be moved between objects.
// When called as a method, `this` is determined by the receiver at the call site.

const methods = {
  name: "Methods",

  getName() {
    return this.name;
  },
};

const anotherObject = {
  name: "Another object",
};

anotherObject.getName = methods.getName;

console.log(anotherObject.getName()); // "Another object"

// The function was originally defined as part of `methods`,
// but the call receiver is `anotherObject`.

// ---------------------------------------------------------------------
// 14. Choosing between regular and arrow functions
// ---------------------------------------------------------------------

// Use a regular function when `this` should depend on the call site.
// Use an arrow function when `this` should be inherited lexically.

const cart = {
  items: 0,

  add() {
    this.items += 1;
  },
};

cart.add();

console.log(cart.items); // 1

// A method commonly uses a regular function because its receiver
// should determine `this`.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - For regular functions, `this` is determined by how the function is called.
// - In `object.method()`, `this` refers to the object used as the receiver.
// - Extracting a method removes the original receiver from the call.
// - A standalone regular function receives `undefined` as `this` in strict mode.
// - Nested regular functions do not automatically inherit the surrounding `this`.
// - `call` and `apply` invoke a regular function with an explicit `this` value.
// - `bind` creates a new function with a bound `this` value.
// - With `new`, `this` refers to the newly created instance.
// - Class methods use receiver-based `this` and are strict-mode functions.
// - Arrow functions do not create their own `this`; they capture it lexically.
// - `call`, `apply`, and `bind` cannot replace an arrow function's lexical `this`.
// - A regular function's definition location does not determine its `this` value.
