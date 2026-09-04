/* 
  * Definition
  JavaScript arrays are fundamental data structures, providing a dynamic and versatile means to store and manipulate collections of data.
  The array is the most common data structure in computer programming. Every programming language includes some form of array. 
  Because arrays are built-in, they are usually very efficient and are considered good choices for many data storage purposes.

  * Properties and Characteristics of JavaScript Arrays:
  - Dynamic Sizing: JavaScript arrays dynamically adapt their size to the data at hand, eliminating the need for predefined dimensions.
  - Heterogeneous Data: JavaScript arrays embrace diversity. They allow elements of varying data types, from numbers to strings, objects, or even other arrays.
  - Zero-Based Indexing: Echoing the conventions of most programming languages, JavaScript arrays use zero-based indexing, commencing with the first element at index 0.
  - Sparse Arrays: JavaScript accommodates sparse arrays, permitting undefined or missing elements within the array.

  * Common Operations on JavaScript Arrays:
  - Creating Arrays
  - Accessing Array Elements
  - Modifying Array Elements
  - Adding and Removing Elements
  - Iterating Over Arrays
  - Sorting Arrays
  - Searching and Filtering Arrays

  * Best Use Cases for JavaScript Arrays
  - Collections: Storing and managing collections of data, serving as lists of items.
  - Queue and Stack: Implementing data structures like queues and stacks.
  - Iteration: Efficiently looping through and processing data.
  - Temporary Data Storage: Providing a transient space for data manipulation.
  - Implementing Hash Tables: Serving as the foundational structure for hash tables in specific use cases.
  - Dynamic Data Handling: When the size of data collections is unpredictable.

  * Time and Space Complexity
  - Access by index: O(1)
  - Modification by index: O(1)
  - Insertion/Deletion at the end: O(1)
  - Insertion/Deletion in the middle: O(n), because it requires shifting other elements.
  - Searching using linear search: O(n)
  - Space Complexity: O(n)

  * Advantages and Disadvantages
  Advantages:
  - Fast random access.
  - Efficient memory use.
  - Simple and easy to use.

  Disadvantages:
  - Fixed size.
  - Inefficient for insertions/deletions in the middle.
  - Wasted memory if size is overestimated.
*/

/* Creating Arrays */
const a1 = [1, 2, 3, 4, 5]; // Using an array literal
const a2 = new Array(5); // Creating a sparse array (empty items)
const a3 = new Array(1, 2, 3, 4, 5); // Using an array constructor function
const a4 = Array(1, 2, 3, 4, 5); // Using the Array wrapper function
const a5 = Array.of(1, 2, 3, 4, 5); // Using an array method of elements
const a6 = Array.from({ 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, length: 5 }); // Using an array method from an iterable object
const a7 = [...a1]; // Creating a copy
const a8 = a1.concat(); // Creating a copy
console.log("== Creating Arrays ==");
console.log(a1);
console.log(a2);
console.log(a3);
console.log(a4);
console.log(a5);
console.log(a6);
console.log(a7);
console.log(a8);

/* Accessing Array Elements */
// Array elements are accessed by their respective indices.
const four = a1[3]; // 4
const five = a1[4]; // 5

/* Modifying Array Elements */
// Modification of elements by simply assigning new values to specific indices.
a1[0] = "zero";

/* Adding and Removing Elements */
a1.unshift(-1); // append to the beginning of the array
a1.shift(); // remove the first element
a1.push(6); // append to the end of the array
a1.pop(); // remove the last element
a1.splice(5, 0, 6, 7); // insert at any index

/* Iterating Over Arrays */
for (const element of a1) {
  // do something with element
}

for (let i = 0; i < a1.length; i++) {
  const element = a1[i];
  // do something with element
}

a1.forEach((element) => {
  // do something with element
});

let i = 0;
while (i < a1.length) {
  const element = a1[i++];
}

let j = 0;
do {
  const element = a1[j++];
} while (j < a1.length);

// Array Iterator Methods
a1.map();
a1.find();
a1.findIndex();
a1.filter();
a1.forEach();
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
Array.of();
Array.from();
Array.isArray();

/* Multidimensional Arrays in JavaScript */
// 2D array
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

// Extending the Array with an object that creates a matrix
Array.matrix = function matrix(numRows, numCols, initial) {
  return new Array(numRows).fill(new Array(numCols).fill(initial));
};

Array.matrix = function matrix(numRows, numCols, initial) {
  const columns = [];
  for (let i = 0; i < numCols; i++) {
    columns[i] = initial;
  }

  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows[i] = columns;
  }

  return rows;
};

Array.matrix = function matrix(numRows, numCols, initial) {
  const matrix = [];

  for (let i = 0; i < numRows; i++) {
    const columns = [];
    for (let j = 0; j < numCols; j++) {
      columns[j] = initial;
    }
    matrix[i] = columns;
  }

  return matrix;
};

/* Arrays of Objects */
const objects = [{}, {}, new Object()];

/* Arrays in Objects */
const object = {
  numbers: [1, 2, 3, 4, 5],
};
