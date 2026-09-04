/* 
  Conditionals:

  - if
  - else if
  - ternary
  - switch
*/

const value = 5;

// if
if (value >= 5) {
  console.log("grater than 5");
}

// else if
if (value > 5) {
  console.log("grater than 5");
} else {
  console.log("less than 5");
}

// else if
if (value > 5) {
  console.log("grater than 5");
} else if (value === 5) {
  console.log("equals to 5");
} else {
  console.log("less than 5");
}

// ternary operator
value > 5 ? console.log("grater than 5") : console.log("grater than 5");

// switch
switch (value) {
  case 1:
  case 2:
  case 3:
  case 4:
    console.log("less than 5");
    break;
  case 5:
    console.log("equals to 5");
    break;
  default:
    console.log("greater than 5");
}

/* 
  Loops:
  
  - while
  - do/while
  - for
  - for/of
  - for/in
  - forEach
*/

let count = 0;

while (count <= 5) {
  // do something...
}

do {
  // do something...
} while (count <= 5);

for (let i = 0; i < 5; i++) {
  // do something...
}

for (let i = 5; i > 5; i--) {
  // do something...
}

for (const entry of [1, 2, 3]) {
  // do something with entry
}

for (const key in { a: 1, b: 2, c: 3 }) {
  // do something with key
}

[1, 2, 3].forEach((entry) => {
  // do something with entry
});

/* 
  Jumps:

  - labeled statements
  - break
  - continue
  - return
  - yield
  - throw
  - try/catch/finally
*/

function isEven(n) {
  return n % 2 === 0;
}

function isGreaterThan(base) {
  return function (num) {
    return num > base;
  };
}

const isGreaterThan8 = isGreaterThan(8);

const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

outerLoop: for (const row of matrix) {
  innerLoop: for (const el of row) {
    if (isEven(el)) continue innerLoop;
    if (isGreaterThan8(el)) break outerLoop;
    console.log(el);
  }
}

function throws() {
  throw new Error("Oops something went wrong. Catch me if you can!");
}

try {
  throws();
} catch (error) {
  console.error(error);
} finally {
  console.log("clean up");
}
