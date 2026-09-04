/* 

  Arrays - ordered collection of indexed elements, accessible by index
*/

// Creating Arrays
const a1 = [1, 2, 3];
const a2 = new Array(1, 2, 3);
const a3 = Array.from({ 0: 1, 1: 2, 2: 3, length: 3 }); // from array-like
const a4 = Array.of(1, 2, 3); // of elements
const a5 = [...a1]; // spread array, copy

console.log(a1);
console.log(a1[0]);
a1[0] = 100;
console.log(a1[0]);

a1.unshift(0);
a1.push(4);

const { length } = a1;

for (let i = 0; i < length; i++) {
  console.log(a1[i]);
}

for (const num of a1) {
  console.log(num);
}

a1.forEach((num) => console.log(num));

// Array Iterator Methods
a1.map();
a1.filter();
a1.forEach();
a1.find();
a1.findIndex();
a1.every();
a1.some();

// Flattening Array
a1.flat();
a1.flatMap();

// adding arrays with concat
a1.concat(a2);
a1 = [...a1, ...a2];

// Stacks and Queues with push, pop, shift, unshift
a1.unshift();
a1.shift();
a1.push();
a1.pop();

// subarray
a1.slice(0, 2);
a1.splice(0, 2);
a1.fill(1, 0, 4);
a1.copyWithin(1, 0, 4);

// array searching
a1.includes(1);
a1.indexOf(1);
a1.lastIndexOf(1);
a1.findIndex(1);

// array to string
a1.toString();
a1.toLocaleString();
a1.join("-");

// Static array functions
Array.of(a1);
Array.from();
Array.isArray(a1);

// Array like objects
const arrLike = { 0: 0, 1: 1, 2: 2, length: 3 };
