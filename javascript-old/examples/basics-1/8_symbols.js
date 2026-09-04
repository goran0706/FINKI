/* 
  Symbols

  Symbols were added to serve as non-string property names.
  Symbols are nice when used with object to ensure not overriding an existing property
  Symbols are mainly used for meta-programming
  Symbols values are always unique, never the same, even when the same argument is passed to the Symbol constructor
  Symbols can be used to declare private properties
*/

const s = Symbol("Test");
const sKey = Symbol.keyFor(s);
const sSymbol = Symbol.for(sKey);
console.log(s, sKey, sSymbol);

const fname = Symbol("fname");
const person = { fname: "John", lname: "Doe" };
person[fname] = "Johnny";
console.log(person); // { fname: 'John', lname: 'Doe', [Symbol(fname)]: 'Johnny' }
console.log(person.fname);
console.log(person[fname]);


