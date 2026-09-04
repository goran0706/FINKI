/* 
  Objects

  Objects are a reference type, a collection of unordered properties, which are name/value pairs.
  Property names are strings, or a Symbol values.

*/

// Creating objects
const o1 = {};
const o2 = new Object();
const o3 = Object.create(Object.prototype);
const empty = Object.create(null);

console.log(o1);
console.log(o2);
console.log(o3);
console.log(empty);

// prototypal chain
console.log(o1.__proto__);
console.log(o2.__proto__);
console.log(o3.__proto__);
console.log(empty.__proto__);

console.log(Object.getPrototypeOf(o1));
console.log(Object.getPrototypeOf(o2));
console.log(Object.getPrototypeOf(o3));
console.log(Object.getPrototypeOf(empty));

// Object.create() with property descriptor
const oc = Object.create(Object.prototype, {
  count: {
    value: 0,
    writable: true,
    configurable: true,
    enumerable: true,
  },
  increment: {
    value: function () {
      this.count++;
    },
    writable: true,
    configurable: true,
    enumerable: true,
  },
  decrement: {
    value: function () {
      this.count--;
    },
    writable: true,
    configurable: true,
    enumerable: true,
  },
});

const { count } = oc;
console.log(count);
oc.increment();
oc.increment();
oc.increment();
oc.decrement();
oc.decrement();
console.log(count);

// Querying and Setting Properties
console.log(oc.count); // access property
oc.newProp = "new property"; // update or add property
oc["another new property"] = "another new property"; // update or add property
console.log(oc);

// Inheritance
const animal = {
  eat: function () {
    console.log("eating...");
  },
};

const dog = Object.create(animal, {
  bark: {
    value: function () {
      console.log("barking...");
    },
  },
});

const cat = Object.create(animal);
cat.meow = function () {
  console.log("meowing...");
};

dog.eat();
dog.bark();
cat.eat();
cat.meow();

function Person(name, age) {
  this.name = name;
  this.age = age;
}

function Manager(managerId) {
  this.managerId = managerId;
}
Manager.prototype = new Person("John", 33);

function Director(directorId) {
  this.directorId = directorId;
}
Director.prototype = new Person("Jane", 28);

const manager = new Manager(1337);
const director = new Director(69);

console.log(manager.name);
console.log(manager.age);
console.log(manager.managerId);

console.log(director.name);
console.log(director.age);
console.log(director.directorId);

// Property Access Error
console.log(director?.managerId); // conditional access
console.log(director && director.directorId); // check for falsy values
console.log(director.managerId || "default id"); // check for falsy values or set default

// Deleting properties
delete director.directorId;
console.log(director.directorId); // undefined

// Testing properties
console.log("name" in director);
console.log(manager.hasOwnProperty("name")); // inherited
console.log(manager.hasOwnProperty("managerId")); // own
console.log(Object.prototype.hasOwnProperty.call(manager, "name"));
console.log(Object.prototype.hasOwnProperty.call(manager, "managerId"));

// Extending Objects
const extended = Object.assign({}, manager, {
  newProp: "new prop added to manager",
});
console.log(extended);

// Serializing objects
console.log(JSON.stringify(manager)); // serialization
console.log(JSON.parse(JSON.stringify(manager))); // deserialization

// Object methods
// toString
// toLocaleString
// valueOf
console.log(manager.toString()); // [object Object]
console.log(manager.toLocaleString()); // [object Object]
console.log(manager.valueOf()); // Person { managerId: 1337 }

// Extended object literal syntax

// shorthand properties
const myValue = 10;
const myOtherValue = "Hi!";
const myObj = { myValue, myOtherValue };

// shorthand methods
const obj = {
  sayHi() {
    console.log("Hi");
  },
};
obj.sayHi();

// computed properties
const PROPERTY_NAME = "p1";
function computePropertyName() {
  return "p" + 2;
}

let p = {
  [PROPERTY_NAME]: 1,
  [computePropertyName()]: 2,
};

// Symbol as prop
const privateProp = Symbol("private prop");
const privObj = { privateProp: "i am private" };
console.log(privObj.privateProp);

// spread operator
const { managerId } = manager;

// getter and setter
const countObj = {
  _value: 0,

  get value() {
    return this._value;
  },

  set value(val) {
    this._value = val;
  },
};

console.log(countObj.value);
countObj.value = 10;
console.log(countObj.value);
