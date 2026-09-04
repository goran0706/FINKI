/*
  Functions

  Functions are "Code on Demand".
  Functions are block of code designed to perform a particular task.
  Functions are executed when "something" invokes them (call them)
  Functions can be called multiple times (with different arguments).
  Functions can be called "directly" and "indirectly" - (invoke now or invoke later when an event triggers it)
  Functions defined as properties in objects are called methods.
  Functions are first-class objects.
  Functions can take parameters (arguments) and can return a value.
  Function parameters are listed inside the parentheses () in the function definition.
  Function arguments are the values received by the function when it is invoked.
  Inside the function, the arguments (the parameters) behave as local variables.
  Variables and constants created in functions "belong to that function".
*/

/* Basic syntax */

// function declaration
function foo() {}

// function invocation
foo();

// function constructor
var foo = new Function('a', 'b', 'return a +b');

// function explicit parameters
function foo(a, b) {}

// function implicit parameters
function foo(...rest) {
  console.log(this);
  console.log(arguments);
}

// function default parameters
function foo(a = 1, b) {}

// function rest parameters
function foo(a, b, ...rest) {}

// function arguments
foo(1, 2);

/* Function return */

// explicit return
var foo = (a, b) => {
  return a + b;
};

// implicit return
var foo = (a, b) => a + b;

/* Invoking functions */
function foo() {
  console.log(arguments);
}

var obj = {
  bar() {
    console.log('bar');
  },
};

// Directly invoking functions
foo();
foo.call(null, 1, 2, 3, 4);
foo.apply(null, [1, 2, 3, 4]);
var newFoo = foo.bind(null, 1, 2, 3, 4);
newFoo();

// Indirectly invoking functions
setTimeout(foo, 1000);

// As a method
obj.bar();

/*
  Function types
*/

// function declaration/named functions
function foo() {}

// function expression/anonymous functions
var foo = function foo() {};

// function expression/arrow functions
var foo = () => {};

// immediately invoked function expressions
(function () {})();
(() => {})();

/*
  Arrow Functions

  arrow functions don't have their own 'this' value. They remember the value of the this parameter at the time of their definition.
  arrow functions don't have arguments object
  arrow functions don't have prototype property
  arrow functions can't be used with new keyword
  arrow functions work better with setTimeout, setInterval
  don't use arrow functions as methods
  don't use arrow functions with call, apply, bind
*/
var foo = () => {};

/*
  Functions as First-Class objects
*/
// Created via literals
function foo() {}

// Assigned to variables, arrays and properties of other objects
var foo = function () {};

// Passed as arguments to other functions
function foo(bar) {
  bar();
}

// Returned as values from functions
function foo() {
  return function () {};
}

// They can possess properties that can be dynamically created and assigned
function foo() {}
foo.id = '#foo';
foo.name = 'my foo func';
foo.description = 'foo does nothing';

/*
  this keyword

  Alone, this refers to the global object.
  In a function, this refers to the global object.
  In a function, in strict mode, this is undefined.
  In an event, this refers to the element that received the event.
  In a method, this refers to the owner object.
  Methods like call(), and apply() can refer this to any object.
*/
console.log(this);

function foo() {
  console.log(this);
}

function foo() {
  'use strict';
  console.log(this);
}

/* The 4 ways of using this */

// implicit binding
var person = {
  fname: 'John',
  lname: 'Doe',
  getFullName() {
    console.log(this.fname + ' ' + this.lname);
  },
};

// explicit binding
var person = {
  fname: 'John',
  lname: 'Doe',
  getFullName: function () {
    console.log(this.fname + ' ' + this.lname);
  }.bind(this),
};

// this in a function inside of a function
var person = {
  fname: 'John',
  lname: 'Doe',
  getFullName() {
    var self = this;
    function inner() {
      console.log(self.fname + ' ' + self.lname);
    }
    inner();
  },
};

// this in a function inside of an arrow function
var person = {
  fname: 'John',
  lname: 'Doe',
  getFullName() {
    var inner = () => console.log(this.fname + ' ' + this.lname);
    inner();
  },
};

/*
  arguments keyword

  Arguments, are the parameters you pass to a function. JavaScript gives us a keyword of the same name which contains them all.
*/

function foo(...rest) {
  console.log(arguments);
}

var priceObj = {
  price: 10.5,
  getPrice: function () {
    console.log('this', this);
    return this.price;
  },
};

var obj = { number: 2 };

/*
  bind method

  The bind() method creates a new function that, when called, has its this keyword set to the provided value.
  The bind prepares a function for later use, when we need it, it is not immediately executed.
*/
var getPrice = priceObj.getPrice.bind(this);
var getPrice = priceObj.getPrice.bind(obj);

/*
  call method

  The call() method calls a function with a given this value and arguments provided individually.
  What that means, is that we can call any function, and explicitly specify what this should reference within the calling function.
*/
priceObj.getPrice.call(this);
priceObj.getPrice.call(obj);

/*
  apply method

  The call() method calls a function with a given this value and arguments provided individually.
  What that means, is that we can call any function, and explicitly specify what this should reference within the calling function.
  The only difference between how they work is that call() expects all parameters to be passed in individually, whereas apply() expects an array of all of our parameters.
*/
priceObj.getPrice.apply(this);
priceObj.getPrice.apply(obj);

/*
  Code Blocks

  Code blocks are used to group related piece of code and encapsulate it, mainly used with functions, but can also be used separately.
  Use code blocks we can reuse the same variable identifiers or function names, since they are not in the same scope.
*/

{
  let message = 'Hello World';
}

{
  let message = 'Hi There!';
}

/*
  Scope

  The current context of execution. The context in which values and expressions are visible, or can be referenced.
  A limited space where variables, constants, objects and functions are useable. Scopes can be nested and are entry only.

  Entry only means that child scope can access everything from parent scope but not vice-versa.

  Scope is WHEN and WHERE VARIABLES and FUNCTIONS are visible to other JavaScript code.
  - global scope -visible anywhere, to any code block
  - function scope - visible only inside the function
  - block scope - visible only inside the code block

  There are two types of scoping systems:

  - lexical or static scoping - sets the function scope based on the location of definition.
  - dynamic scoping - set the function scope based on the location of invocation
*/
var globalScope = 10;

function foo() {
  var functionScope = 10;
}

{
  let blockScope = 10;
}

function fooOuter() {
  var outerVal = 10;
  function fooInner() {
    var innerVal = outerVal;
    return innerVal;
  }
  return fooInner();
}

var globalScope = 10; // has global scope
function foo() {
  for (var i = 0; i < 1; i++) {
    console.log(i);
  }
  console.log(i); // i has function scope so is visible

  for (let j = 0; j < 1; j++) {
    console.log(j);
  }
  console.log(j); // Error: // j has block scope so is not visible
}

// Scoping systems
let msg = 'GLOBAL msg';

// the scope of a function is decided by where the function is defined not by where the function is invoked.
function A() {
  console.log(msg);
}

function B() {
  let msg = 'func B msg';
  A();
}

// function directly invoked
function foo() {}
foo();

// function indirectly invoked
function foo() {}
setTimeout(foo, 1000);

// function declaration prototype property
// do have prototype, and are therefore eligible as constructors
function Ctor() {}
var inst = new Ctor();
console.log(Object.getPrototypeOf(inst) === Ctor.prototype); // true

// function expression prototype property
// do not have prototype, and are therefore ineligible as constructors, even if a prototype property is later manually assigned
var method = { foo() {} }.foo;
var arrowFunction = () => {};
var boundFunction = function () {}.bind(null);
async function asyncFunction() {}

/* 
  The Two Pillars of JavaScript:

  1. Closures
  2. Prototypal Inheritance
*/

/* 
  Higher Order Functions
*/

// function accepting a function as an argument.
var foo = () => {};
function foo(bar) {
  bar();
}

// function returning a function
var foo = () => () => {};
function foo() {
  return function () {};
}

/* 
  Closures
*/
function counter() {
  // closure is created for the bellow function so count is still kept by JavaScript because it is referenced by the functions bellow.
  // closures are also lexically scoped or statically scope. JavaScript knows which functions have access to which variables, so it will keep the count.
  var count = 0;

  // Data encapsulation, a benefit because of Closures
  return {
    increment: () => count++,
    decrement: () => count--,
    reset: (value) => (count = value),
    getCount: () => count,
  };
}

function outer() {
  // closures provides a way to encapsulate data from the outer world
  // the state of X variable can only be changed by calling the inner function that is return by calling the outer function
  let x = 0;
  function inner() {
    x = x + 1;
  }
  return inner;
}
const incrementX = outer();
incrementX();
incrementX();

function callMeMaybe() {
  // JavaScript creates a closure for the 'callMe' variable because it is referenced in the function, even if the callMeMaybe function has already executed.
  setTimeout(function () {
    console.log(callMe);
  }, 2000);
  const callMe = 'Hi!, I am done now.';
}

var foo = (greet) => (fname) => (lname) => `${greet} ${fname} ${lname}`;
foo('hello')('John')('Doe');

// Call a function just once, based on functions as First-Class objects
var view;
function initialize(_view) {
  if (initialize.isInit) return;
  view = _view;
  initialize.isInit = true;
}
initialize(1);
initialize(2);
initialize(3);

// Call a function just once, based on Closures
var view;
function initialize() {
  var called = 0;
  return function () {
    if (called > 0) {
      return;
    } else {
      view = '🏔';
      called = true;
      console.log('view has been set!');
    }
  };
}

const runOnce = initialize();
runOnce();
runOnce();
runOnce();
console.log(view);

// function scope vs block scope index
var numbers = [1, 2, 3, 4, 5];
for (var i = 0; i < numbers.length; i++) {
  // when using var i = 0; it prints "At index 5" five times. To fix the issue do:

  // 1. just declare the index using block scoped 'let' keyword
  setTimeout(() => console.log('At index', i), 3000);

  // 2. use a closures IIFE
  ((index) => setTimeout(() => console.log('IIFE At index', index), 3000))(i);
}

/* 
  Prototypal Inheritance
*/
var array = [];
// .__proto__ links to the prototype property of the parent object (up the prototype chain).
// if it cant find the property or method on the current object, then it will check up the prototype chain, until it finds it or reach the root null prototype.
console.log(array.__proto__);

var obj1 = {
  fname: 'John',
  lname: 'Doe',
  getFullName() {
    return this.fname + ' ' + this.lname;
  },
};
var obj2 = {};

// obj2 inherits all the properties and methods from obj1, by linking __proto__ to prototype. Bad practice for inheritance.
obj2.__proto__ = obj1;
obj2.getFullName();

// check the inheritance
obj1.hasOwnProperty('fname'); // true
obj2.hasOwnProperty('fname'); // false

/* 
  Object-Oriented Programming
*/

// Factory Functions - function creating objects
function createUnit(name, weapon) {
  return {
    name: name,
    weapon: weapon,
    attack() {
      return 'attack with ' + this.weapon;
    },
  };
}

// Object.create() using Pure Inheritance
function createElf(name, weapon) {
  const elf = Object.create(elfFunctions);
  elf.name = name;
  elf.weapon = weapon;
  return elf;
}

function elfFunctions() {
  return {
    attack() {
      return 'attack with ' + this.weapon;
    },
  };
}

// Constructor Functions
function Elf(name, weapon) {
  this.name = name;
  this.weapon = weapon;
}

Elf.prototype.attack1 = function () {
  return 'attack with ' + this.weapon;
};

Elf.prototype.attack2 = function () {
  const self = this;
  function innerAttack() {
    return 'attack with ' + self.weapon; // this inside a function of another function points to the global execution context
  }
  return innerAttack();
};

Elf.prototype.attack3 = function () {
  const innerAttack = () => 'attack with ' + this.weapon; // this in arrow function is who calls the function/the object from its left.
  return innerAttack();
};

// ES6 Class
class Elf {
  constructor(name, weapon) {
    this.name = name;
    this.weapon = weapon;
  }

  attack() {
    return 'attack with ' + this.weapon;
  }
}

/*
  Advanced Function Concepts

  Closure - A closure allows a function to access and manipulate variables that are external to that function.
  Closures allow a function to access all the variables, as well as other functions, that are in scope when the function itself is defined.

  Callbacks - A callback function is a function that is passed as an argument to another function, to be "called back" at a later time.
  A function that accepts other functions as arguments is called a higher-order function, which contains the logic for when the callback function gets executed.
  It’s the combination of these two that allow us to extend our functionality.

  Pure - A pure function is a function that always produces the same output when given the same input.
  Impure - An impure function is a function that does not always produce the same output when given the same input.
  Side-effects - A side effect is a function that changes something outside of the function.

  Recursion - A recursive function is a function that calls itself during its execution. The process may repeat several times, outputting the result and the end of each iteration.
  - Recursion can save us a code, but can also solve an issue where a for loop cannot.
  - Recursion also requires an exist condition to avoid infinite loop.

  Function Factory - If we have a function that we call a multiple times in different parts of our application, and it can be pre-configured in a certain way
  so that we don't repeat ourselves as often, then a factory function is a convenient way to save time and code.

  Function Currying - Currying in JavaScript transforms a function with multiple arguments into a nested series of functions, each taking a single argument.
  Currying helps you avoid passing the same variable multiple times, and it helps you create a higher order function.

  Function Composition - Function composition is an approach where the result of one function is passed on to the next function, which is passed to another
  until the final function is executed for the final result. Function compositions can be composed of any number of functions.

  Function Memoization - remembering the previously computed result of a function when given the same input
*/

// Closure
function counter() {
  var count = 0; // count variable will continue to be bound to this particular instance of the function bellow
  return function () {
    return count++;
  };
}

var number = 10;

function foo() {
  var localNumber = number;
  function bar() {
    var result = number + localNumber;
    console.log(result);
  }
  bar();
}

// Using closures the JavaScript will keep (not garbage collect) anything that is still being referenced by any child function.
// Closures are also called Lexical Scoping:
// Lexical means where it is written
// Scoping means what variable we have access to
function foo() {
  var a = 1;
  return function () {
    var b = 1;
    return function () {
      var c = 1;
      return a + b + c;
    };
  };
}

// Callbacks
function processOrder(order, successHandler, errorHandler) {
  if (order.status === 'SUCCESS') {
    successHandler(order);
  } else {
    errorHandler(order);
  }
}

var promise = new Promise((resolve, reject) => {
  if (true) {
    resolve();
  } else {
    reject();
  }
});

promise.then((response) => console.log(response)).catch((e) => console.log(e));

var fruits = ['🍎', '🍌', '🥝'];

function printFruit(fruit) {
  console.log(fruit);
}

function processFruits(fruits = []) {
  fruits.forEach((fruit) => printFruit(fruit));
}

processFruits(fruits);

// Pure function
function foo(a, b) {
  return a + b;
}

var count;
var incrementPure = (value) => value + 1;
count = incrementPure(count);

// Impure function
function foo(a, b) {
  return Math.random() + a + b;
}

var count;
var incrementImpure = () => count++;

// Function producing Side-effects
var result;
function foo(a, b) {
  result = a + b;
}

// Recursive function
function pow(x, n) {
  if (n === 1) return x;
  return x * pow(x, n - 1);
}

function fibonacci(n) {
  if (n === 0) return 0;
  if (n === 1) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Function factory
var calculateReward = (percent) => (amount) => (amount * percent) / 100;
var calculateLockingReward = calculateReward(10);
var calculateStakingReward = calculateReward(20);
var calculateGovernanceReward = calculateReward(30);
var lockingReward = calculateLockingReward(10000);
var stakingReward = calculateStakingReward(10000);
var governanceReward = calculateGovernanceReward(10000);

function createCounter(initial = 0) {
  var count = initial;
  return {
    inc: () => count++,
    dec: () => count--,
    value: () => count,
    reset: (value) => (count = value),
  };
}

// Function currying
var sum = (a, b, c) => a + b + c;
var sum = (a) => (b) => (c) => a + b + c;
sum(1)(2)(3);

// Function composition of any number of functions
var compose =
  (...fns) =>
  (x) =>
    fns.reduceRight((y, f) => f(y), x);
var double = (x) => x * 2;
var square = (x) => x * x;

// function composition
var output_final = compose(square, double)(2);
console.log(output_final);

// function composition using pipe of any number of functions
var pipe =
  (...fns) =>
  (x) =>
    fns.reduce((y, f) => f(y), x);
var double = (x) => x * 2;
var square = (x) => x * x;

// function pipe
var output_final = pipe(square, double)(2);
console.log(output_final);

// Function memoization
function sum(a, b) {
  if (sum.store.a === a && sum.store.b === b) {
    return sum.store.result;
  }

  var sum = a + b;
  sum.store.result = sum;

  return sum;
}

/* 
  Decorators and Forwarding
*/
var obj = {
  someMethod() {
    console.log('called someMethod');
  },
  slow(x) {
    alert(`Called with ${x}`);
    this.someMethod();
  },
};

function slow(x) {
  alert(`Called with ${x}`);
  return x;
}

function hash() {
  return [].join.call(arguments); // Array.prototype.join.call(arguments)
}

// Wrapping function that is going to cache the results
function cachingDecorator(func, hashFunc) {
  let cache = new Map();
  return function (x) {
    let key = hashFunc(arguments);
    if (cache.has(key)) {
      return cache.get(key);
    }
    let result = func.call(this, ...arguments); // forward this
    cache.set(x, result);
    return result;
  };
}

slow = cachingDecorator(slow, hash);
obj.slow = cachingDecorator(obj.slow, hash);

/* 
  this forwarding: 

  func.bind(context, args);
  func.call(context, args);
  func.apply(context, [args]);
*/
