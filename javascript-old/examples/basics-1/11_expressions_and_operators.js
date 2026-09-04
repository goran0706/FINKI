/* 

  Primary Expressions - are those that stand alone:
  - literal values
  - certain keywords
  - references to variables
*/

/* Object Initializers */
const o1 = {};
const o2 = new Object();

const a1 = [];
const a2 = new Array();
const a3 = Array.from(); // from array-like-object
const a4 = Array.of(); // of elements

/* Array-like objects */
const arrayLike = { 0: "a", 1: "b", 2: "c", length: 3 }; // the property names are strings

/* Property Access 

  dot notation .
  bracket notation []
*/

const o = { name: "John", age: 33 };
console.log(o.name);

// programmatically access or set properties
const nameProp = "name";
console.log(o["name"]);
console.log(o[nameProp]);

// conditional property access
console.log(o?.name);

/* 
  Operators 
  
  - unary operators
  - binary operators
*/

// arithmetic (+, -, *, /, %, **)
// relational (<, >, <=, >=, ==, ===, !=, !==)
// logical (&&, ||, !)
// assignment (=)
// evaluation (eval, global, strict)
// miscellaneous (ternary ?:, ?? nullish, typeof, delete, await, void)
