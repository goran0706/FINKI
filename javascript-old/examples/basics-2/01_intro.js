/* 
  JavaScript is a high-level, single threaded, garbage collected, interpreted or JIT compiled, prototype based, 
  multi-paradigm, dynamic language with a non-blocking event loop(without blocking the main thread).

  "Anything that can be built with JavaScript, will be built with JavaScript"
*/

/* 
  An ECMAScript Engine is a program that executes source code written in a version of the ECMASCript language standard, for example JavaScript.
  It reads the code and runs the code.

  Inside the engine:
  1. Lexical analysis parses the code into Abstract Syntax Tree (AST)
  2. The AST gets processed by the Interpreter which translates and reads the file line by line on the fly or just-in-time (JIT).
  3. The Interpreter spits out a Bytecode
  4. The Profiler checks pieces of code as the code is running if they can be optimized
  5. The Profiler sends those parts to the Compiler which optimizes the code and spits out Machine code, instead of the slower Bytecode.
*/

/* 
  Single Threaded

  JavaScript is single threaded, since it has a single call stack. 
  This makes JavaScript synchronous, one at a time, in order as it appears, only one thing can happen. 
*/

/* 
  Call Stack and Memory Heap

  The two places where JavaScript remembers the items are the Call Stack and Memory Heap.
  - Simple values are stored inside the Call stack, 
  - complex objects are stored in the Heap.

  Call Stack - is where the engine keeps track of the code execution.
  Memory Heap - is where the memory allocation happens.
*/

var foo = 10; // allocate memory for number
var foo = "some text"; // allocate memory for a string
var foo = {
  fname: "John",
  address: {
    street: "1st Avenue",
  }, // allocate memory for the nested object
}; // allocate memory for an object

/* 
  Global Execution Context is the most global function that runs our script.
*/

/* 
  Execution Context is the environment that calls the current execution.
*/

/* 
  Stack Overflow 

  A stack overflow is a type of buffer overflow error that occurs when a computer program tries to use more memory space 
  in the call stack than has been allocated to that stack.
*/

/* 
  Garbage Collection

  The Garbage collector marks, sweeps and cleans memory locations that have no references anymore. It releases the allocated memory space.
*/
function foo() {
  var person = {
    fname: "John",
    lname: "Doe",
  };
  person = "John Doe";
  return person;
}

/* 
  Memory Leaks
*/
// Global variable
var a = 1;
var b = 2;
var c = 3;

// Event listeners
// in case we are not removing the event listeners from the page which commonly happens with Single-Page Applications when moving back and forth,
// so the event listeners keep adding but not getting removed.
var body = document.body;
bode.addEventListener("click", () => {});

// Timers and Intervals
setInterval(() => {
  // referencing objects... these objects will not be cleared from the memory because the interval keeps running...
}, 1000);

/*
  Adding JavaScript

  1) Inline or External file.
  2) In the <head></head> or <body></body> tag.
  3) JavaScript loading and execution is configurable via async, defer or both.
  4) The best way is to add in the HEAD tag using defer or async for standalone script that does not depend on the html content.

  <script src='external-file.js' defer></script>
  <script src='external-file.js' async></script>
  <script src='external-file.js' async defer></script>

  1. Inline - Immediately executed, blocks HTML parsing & rendering
  2. External - Immediately loaded & executed, blocks HTML parsing & rendering
  3. External File (async) - Immediately loaded & and executed right-after, blocks HTML parsing & rendering
  4. External File (defer) - Immediately loaded & but executed after HTML parsing and rendering
  5. External File (async & defer) - If both are present and the browser only supports defer then it will fall back to the defer behavior.
  These attributes only make sense when using the script in the head portion of the page, and they are useless if you put the script in the body footer.
*/

/*
  Strict Mode

  - Eliminates some JavaScript silent errors by changing them to throw errors.
  - Fixes mistakes that make it difficult for JavaScript engines to perform optimizations: strict mode code can sometimes be made to run faster than identical code that's not strict mode.
  - Prohibits some syntax likely to be defined in future versions of ECMAScript.

  - changes converting mistakes into errors (as syntax errors or at runtime)
  - changes simplifying how variable references are resolved
  - changes simplifying eval and arguments
  - changes making it easier to write "secure" JavaScript
  - changes anticipating future ECMAScript evolution.

  "use strict";
*/

/* 
  Statements - a statement tells JS to do something
  Expression - an expression evaluates (aka resolves) to a value
*/
