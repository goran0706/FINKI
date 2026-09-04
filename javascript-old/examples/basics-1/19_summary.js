/* 
  ECMAScript Basic Syntax

  - Everything is case-sensitive.
  - Variables are loosely typed.
  - End-of-line semicolons are optional.
  - There are two types of comments - single-line and multi-line comments.
  - Braces indicate code blocks.
*/

/* Primitive Types */
var noValue = undefined
var empty = null
var number = 10
var string = 'hello world'
var boolean = true
var bigint = BigInt(10)
var symbol = Symbol(10)

// typeof operator
console.log(typeof noValue) // undefined
console.log(typeof empty) // object Null
console.log(typeof number) // number
console.log(typeof string) // string
console.log(typeof boolean) // boolean
console.log(typeof bigint) // bigint
console.log(typeof symbol) // symbol

/* Conversions */
// Converting to a string
console.log(10..toString()) // 10
console.log((10).toString()) // 10

// Converting to a number
console.log(Number('10')) // 10
console.log(Number.parseInt('10this is ten')) // 10
console.log(Number.parseInt('n10this is ten')) // NaN

// Type casting
console.log(Number('10'))
console.log(String(10))
console.log(Boolean(1))
console.log(BigInt(10))
console.log(Symbol(1))


/* Reference Types */
var object = {} // object Object
var array = [] // object Array
var foo = function foo() {} // function

// instanceof operator
console.log(object instanceof Object) // true
console.log(array instanceof Array) // true
console.log(foo instanceof Function) // true

// constructor property
console.log(object instanceof object.constructor) // true
console.log(array instanceof array.constructor) // true
console.log(foo instanceof foo.constructor) // true

var numObject = new Number(10)
var strObject = new String('hello world')
var boolObject = new Boolean(true)
var object = new Object(10)


/* Statements */
var value = true

if (value) {
  // do something
}

if (value) {
  // do something
} else {
  // do something
}

if (value) {
  // do something
} else if (value > 10) {
  // do something
} else {
  // do something
}

switch(value) {
  case 1: 
    // do something
    break;
  case 2:
  case 3:
  case 4: 
    // do something
    break;
  default:
    // do something
}

var count = 0
while (count < length) {
  // do something
  count++
}

var count = 0
do {
  // do something
  count++
} while (count < length)

// for cache the length, so it is accessed only once
var items = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 ]
for (let i = 0, n = items.length; i < n; i++) {
  // do something
}

// for reversed
var items = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 ]
for (let i = items.length; i--;) {
  // do something
}

// for-of
var items = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 ]
for (const element of items) {
  // do something
}

// Labeled statements
var matrix = [ [1, 2, 3], [4, 5, 6, 7], [8, 9, 0] ]
outerLoop: for (const row of matrix) {
  innerLoop: for (const col of row) {
    if (col === 5) {
      break outerLoop // exit the loop
    }

    if (col % 2 === 0) {
      continue innerLoop // skip the iteration
    }
  }
}

// for-in
var object = { a: 1, b: 2, c: 3 }
for (const key in object) {
  // a pattern to filter out object's own properties, not enumerating the properties of the prototype chain
  if (Object.prototype.hasOwnProperty.call(object, key)) { // filter
    // process
  }
}

// avoid using with it augments the scope chain
var person = { fname: 'John', lname: 'Doe', age: 33 }
with(person) {
  var greet = `Hello ${fname} ${lname}. You are ${age} old.`
  console.log(greet)
}


/* Functions */

// Function Declaration
function foo() {}

// Function Expression
var foo = function () {} // anonymous function expression
var foo = function foo() {} // named function expression

// Arrow Function
var foo = () => {}

// Immediately Invoked Function Expression - IIFE
(function () {}) ()
(function foo() {}) ()
(() => {}) ()

// No Overloading

// arguments
function foo() {
  const copyArgs = [...arguments] // arguments is an implicit property array-like object, avoid working on it
  for (let i = 0, n = copyArgs.length; i < n; i++) {
    // do something
  }
}

// this
function foo() {
  // this = undefined, in strict mode
  // this = globalThis
  // this = object if called as a method
}

// Function Invocation
function foo() {} // Function
function Foo() {} // Constructor Function
var object = { 
  foo: function foo() {} // Method
}

foo() // Invoked as a function
var f = new Foo() // Invoked as a constructor
object.foo() // Invoked as a method
foo.call(this, 1, 2, 3) // Invoked indirectly - passing context
foo.apply(this, [1, 2, 3]) // Invoked indirectly - passing context
var foo = foo.bind(this) // Invoked indirectly - passing context

// Higher-Order Function

// Function as argument
function foo(callback, ...args) {
  if (typeof callback === 'function') {
    callback(...args);
  } else {
    console.log('Not a valid callback function.');
  }
}

function foo(callback) {
  // check callback
  callback = typeof callback === 'function' ? true : false
  if (!callback) {
    throw new Error('Passed invalid argument')
  }

  // invoke callback
  callback()
}

// Function returning a function
function foo(a) {
  return function (a, b) {
    return a + b
  }
}

function foo(x) {
  var base = 2

  function bar(y) {
    return x * base * y
  }

  return bar
}

// minimize closure memory usage and potentially improve performance.
var foo = (x) => (y) => x * 2 * y; // Function Curry


/* Object-Oriented Programming */

// Object declaration and instantiation
var object = {}
var object = new Object()
var object = Object.create(Object.prototype)
var objectEmpty = Object.create(null)

// Object referencing
var object1 = {}
var object2 = object1

// Object dereferencing
object1 = null
object2 = null

// Native Objects - native objects are the classes (reference types) defined by ECMA-262.
// Built-in Objects - Global and Math
// Host Objects - DOM and BOM

/* Defining Classes and Objects */

// Factory Pattern
function createObject(x, y) {
  const temp = new Object()
  temp.x = x
  temp.y = y
  temp.foo = function () {
    return this.x
  }

  return temp
}

// Hybrid Factory Pattern
function CreateObject(x, y) {
  var temp = new Object();
  temp.color = x
  temp.doors = y
  temp.foo = function () {
    return this.x
  };

  return temp;
}

// Constructor Pattern
function Constructor(x, y) {
  this.x = x
  this.y = y
  this.foo = function () {}
}

// Prototype Pattern
function Proto() {}
Proto.prototype.x = 'x'
Proto.prototype.y = 'y'
Proto.prototype.foo = function() {
  return this.x
}

// Hybrid Constructor/Prototype Pattern
function Constructor(x, y) {
  this.x = x
  this.y = y
}
Constructor.prototype.foo = function () {
  return this.x
}

// Dynamic Prototype Pattern
function Constructor(x, y) {
  this.x = x
  this.y = y

  // check if the Constructor was already called once
  if (!this._init) {
    // encapsulate the shared props and methods of the prototype within the constructor
    Constructor.prototype.foo = function () {
      return this.x
    }

    // mark it as initialized
    Constructor._init = true
  }
}

/* Inheritance */

// Prototype Chaining
function Foo(x, y) {
  this.x = x
  this.y = y
}
function Bar () {}
Bar.prototype = new Foo()

// call and apply methods
function Foo() {
  this.x = x
  this.y = y
}
function Bar (x, y, z) {
  Bar.call(this, x, y)
  // Bar.apply(this, [])
  this.z = z
}

// hybrid
function Foo() {
  this.x = x
  this.y = y
}
Foo.prototype.foo = function () {}

function Bar () {
  Bar.call(this)
  // Bar.apply(this, [])
}
Bar.prototype = new Foo()

/* ES6 Classes */
class Parent {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

class Child extends Parent {
  #privateProp = 'private'

  // static private property
  static #instanceCount = 0

  constructor(x, y, z) {
    super(x, y)
    this._z = z
    instanceCount++
  }

  // static method 
  static getInstanceCount() {
    return this.#instanceCount
  }

  get getPrivateProp() {
    return this.#privateProp
  }

  get z() {
    return this._z
  }

  set z(value) {
    this._z = value
  }
}

/* Augmenting Native Objects */
if (typeof Array.prototype.print !== 'function') {
  Array.prototype.print = function () {
    // process
  }
}

if (typeof Array.prototype.matrix !== 'function') {
  Array.prototype.matrix = function (numRows, numCols, initialValue) {
    return new Array(numRows).fill(new Array(numCols).fill(initialValue))
  }
}

/* Events  */

// Cross-Browser Events
function addHandler(oTarget, sEventType, fnHandler) {
  if (oTarget.addEventListener) {
    //for DOM-compliant browsers
    oTarget.addEventListener(sEventType, fnHandler, false);
  } else if (oTarget.attachEvent) {
    //for IE
    oTarget.attachEvent('on' + sEventType, fnHandler);
  } else { 
    //for all others
    oTarget['on' + sEventType] = fnHandler;
  }
}

function removeHandler(oTarget, sEventType, fnHandler) {
  if (oTarget.removeEventListener) {
    //for DOM-compliant browsers
    oTarget.removeEventListener(sEventType, fnHandler, false);
  } else if (oTarget.detachEvent) {
    //for IE
    oTarget.detachEvent('on' + sEventType, fnHandler);
  } else { 
    //for all others
    oTarget['on' + sEventType] = fnHandler;
  }
}


/* Error Handle */

// try/catch optimization
function expensiveComputationThrows1() {}
function expensiveComputationThrows2 () {}
function errorHandler (err) {}

try {
  // 1. try block does not get optimized
  // 2. wrap code into function, since functions are getting optimized by the JavaScript engine
  expensiveComputationThrows1()
  expensiveComputationThrows2()
} catch (error) {
  // 1. put less code in the catch block
  // 2. keep in mind that catch augments the scope chain 
  // pushing activation object for the exception into the scope chain
  errorHandler(error) 
} finally {
  // do clean up...
}