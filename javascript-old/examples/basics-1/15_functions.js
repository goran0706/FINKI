/* Defining Functions */

// function declaration
function foo() {}

// function expression
const foo = function foo() {}; // named function expression
const bar = function () {}; // anonymous function expression

// arrow function
const arrow = () => {};

// nested function
function outer() {
  function inner() {}
  inner();
}

function outer() {
  function inner() {}
  return inner;
}

function outer() {
  return function inner() {};
}

/* Invoking Functions */
foo(); // function invocation

const o = { sayHi() {} };
o.sayHi(); // method invocation

const p = new Object(); // constructor invocation

Object.getPrototypeOf.call(p); // indirect invocation
Object.getPrototypeOf.apply(p);
document.body.addEventListener("click", () => {});

const obj = {
  _val: 0,
  get val() {
    this._val;
  },
  set val(value) {
    this._val = value;
  },
};

obj.val = 10; // implicit invocation
console.log(obj.val);

/* Function Arguments and Parameters */
function f(x, y) {}

function f(mandatory, optional) {
  if (argument.length < 2) {
    throw new Error("Pass at least one argument");
  }
}

function f(mandatory, optional) {
  if (!mandatory) {
    throw new Error("Pass at least one argument");
  }
}

function f(x, y, ...rest) {} // rest operator

function f(x, y, ...rest) {
  const args = [...rest]; //spread operator
  const [z] = rest; // destructuring
}

function f(start, end, target) {} // positional parameters
function f({ start = 0, end = 0, target = 1 }) {} // named parameters

// function as objects
f.sayHi = function () {};
f.myFuncName = "f";

// closure
function outer() {
  const value = 100;

  return function inner() {
    return value * 2;
  };
}

// length
f.length; // parameters length
f.name;
f.prototype;

function Car(engine) {
  this.engine = engine;
  this.describe = function () {
    console.log(this.engine);
  };
}

const audi = new Car("1.8 Benzin");
audi.describe();

const extractedMethod = audi.describe.bind(audi);
extractedMethod();
extractedMethod.call(audi);
extractedMethod.apply(audi);
