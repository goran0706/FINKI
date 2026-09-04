/* 
  Type Conversions

  1. Implicit conversion - done by JavaScript itself
  2. Explicit conversion - done by user/developer explicitly, from one type to another,
    - primitive to another primitive
    - primitive to reference
    - reference to primitive 
*/

let num = 10;
let str = "5";
let result = num - str;

/* Primitive to other primitive */
console.log(result); // 5
console.log(typeof result); // number

console.log(num + str); // string concatenation: 1010
console.log(num + +str); // explicit conversion use unary +
console.log(num + Number(str)); // explicit conversion using Number constructor function

console.log(Number("3"));
console.log(String(3));
console.log(Boolean("true"));

const x = 1 + "";
console.log(x); // string
console.log(+x); // number
console.log(Number(x)); // number
console.log(Boolean(x)); // true
console.log(!!x); // true

/* Primitive to reference */
const sLiteral = "Hello World!";
const sObject = new String(sLiteral);
console.log(sLiteral);
console.log(sObject);

/* 
  Reference to primitive

  Algorithms:
  - prefer-number
  - prefer-string
  - no-preference
*/

const n = new Number(10);
console.log(n.toString(10));
console.log(n.valueOf());

const s = new String(10);
console.log(s.toString());
console.log(s.valueOf());

const o = { a: 1, b: 2 };
console.log(o.toString());
console.log(o.valueOf());

const d = new Date();
console.log(d.toString());
console.log(d.valueOf());

const a1 = [0];
const a2 = [100];
const a3 = [100, 200];
console.log(a1.toString());
console.log(a2.toString());
console.log(a3.toString());
console.log(a1.valueOf());
console.log(a2.valueOf());
console.log(a3.valueOf());
