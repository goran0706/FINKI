/* 
  Closures
*/
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

function counter() {
  // closure is created for the bellow function so count is still kept by JavaScript because it is referenced by the inner function.
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

function callMeMaybe() {
  // JavaScript creates a closure for the 'callMe' variable because it is referenced in the function, even if the callMeMaybe function has already executed.
  setTimeout(function () {
    console.log(callMe);
  }, 2000);
  const callMe = "Hi!, I am done now.";
}

var foo = (greet) => (fname) => (lname) => `${greet} ${fname} ${lname}`;
foo("hello")("John")("Doe");

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
      view = "🏔";
      called = true;
      console.log("view has been set!");
    }
  };
}

const runOnce = initialize();
runOnce();
runOnce();
runOnce();
console.log(view);

// function scope vs block scoped index
var numbers = [1, 2, 3, 4, 5];
for (var i = 0; i < numbers.length; i++) {
  // when using var i = 0; it prints "At index 5" five times. To fix the issue do:

  // 1. just declare the index using block scoped 'let' keyword
  setTimeout(() => console.log("At index", i), 3000);

  // 2. use a closures IIFE
  ((index) => setTimeout(() => console.log("IIFE At index", index), 3000))(i);
}
