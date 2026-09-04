/*
  Control Flow with Control Structures

  - if statement
  - else if statement
  - else statement
  - switch statement
  - ternary operator
  - while loop
  - do while loop
  - for loop
  - for-of loop
  - for-in loop
  - continue
  - break
  - labeled statements
*/

var a = 1;
var b = 2;

// if statement
if (a > b) console.log("a is greater than b");

// else statement
if (a > b) console.log("a is greater than b");
else console.log("a is smaller than b");

// else if statement
if (a > b) console.log("a is greater than b");
else if (a < b) console.log("a is smaller than b");
else console.log("a is smaller than b");

var httpCode = 301;

if (httpCode === 200) {
  console.log("Success");
} else if (httpCode >= 400 && httpCode <= 500) {
  console.log("Error");
} else {
  console.log("Unexpected status");
}

// switch statement
switch (today) {
  case 1:
    console.log("Monday");
  case 2:
    console.log("Tuesday");
  case 3:
    console.log("Wednesday");
  case 4:
    console.log("Thursday");
  case 5:
    console.log("Friday");
  case 6:
    console.log("Saturday");
  default:
    console.log("Sunday");
}

// ternary operator
var today = 0;
var day = today === 0 ? "Saturday" : "Today is not sunday";

var day =
  today === 0
    ? "Monday"
    : today === 1
    ? "Tuesday"
    : today === 2
    ? "Wednesday"
    : "Thursday";

// Loops
var obj = { number: 1 };
var fruits = ["🍎", "🍌", "🥝"];
var count = 0;

while (count < fruits.length) {
  console.log(fruits[count]);
  count++;
}

do {
  console.log(fruits[count]);
  count++;
} while (count < fruits.length);

for (var i = 0; i < fruits.length; i++) {
  var fruit = fruits[i];
  console.log(fruit);
}

// for-of works only with iterable (not objects since objects are not iterable)
for (const fruit of fruits) {
  console.log(fruit);
}

// for-in loops over enumerable properties and enumerable property names of an object
for (const prop in obj) {
  if (Object.hasOwnProperty.call(obj, prop)) {
    const element = obj[prop];
    console.log(element);
  }
}

// continue
for (const fruit of fruits) {
  if (fruit === "🍌") continue;
  console.log(fruit);
}

// break
for (const fruit of fruits) {
  if (fruit === "🍌") break;
  console.log(fruit);
}

// Labelled statements
fruitsLoop: for (const fruit of fruits) {
  if (fruit === "🍎") continue fruitsLoop;
  if (fruit === "🍌") break fruitsLoop;
  console.log(fruit);
}

// Conditional expressions, involving keywords such as if and else, provide JavaScript programs with the ability to
// perform different actions depending on a Boolean condition: true or false.

/* -------------------------------------------------------------------------- */
/*                         If / Else If / Else Control                        */
/* -------------------------------------------------------------------------- */
var i = 0;

if (i < 1) {
  console.log("i is smaller than 1");
}

if (i < 1) {
  console.log("i is smaller than 1");
} else {
  console.log("i was not smaller than 1");
}

if (i < 1) {
  console.log("i is smaller than 1");
} else {
  if (i < 2) {
    console.log("i is smaller than 2");
  } else {
    console.log("none of the previous conditions was true");
  }
}

if (i < 1) {
  console.log("i is smaller than 1");
} else if (i < 2) {
  console.log("i is smaller than 2");
} else {
  console.log("none of the previous conditions was true");
}

/* -------------------------------------------------------------------------- */
/*                                Ternary operators                           */
/* -------------------------------------------------------------------------- */
// Can be used to shorten if/else operations.
// Stylistically this should only be used with short variable names, as multi-line ternaries can drastically decrease readability.
var animal = "kitty";
var result = "";

if (animal === "kitty") {
  result = "cute";
} else {
  result = "still nice";
}

foo ? (bar ? 1 : 2) : 3;
// To be clear, this is evaluated left to right and can be more explicitly expressed as:
foo ? (bar ? 1 : 2) : 3;

var animal = "kitty";
return animal === "kitty" ? "meow" : "woof";

/* -------------------------------------------------------------------------- */
/*                                Switch statement                            */
/* -------------------------------------------------------------------------- */
// Switch statements compare the value of an expression against 1 or more values and executes different
//  sections of code based on that comparison.

var value = 1;
switch (value) {
  case 1:
    console.log("I will always run");
    break;
  case 2:
    console.log("I will never run");
    break;
}

// Using Default case
var animal = "Lion";
switch (animal) {
  case "Dog":
    console.log('I will not run since animal !== "Dog"');
    break;
  case "Cat":
    console.log('I will not run since animal !== "Cat"');
    break;
  default:
    console.log("I will run since animal does not match any other case");
}

// Multiple Inclusive Criteria for Cases
var x = "c";
switch (x) {
  case "a":
  case "b":
  case "c":
    console.log("Either a, b, or c was selected.");
    break;
  case "d":
    console.log("Only d was selected.");
    break;
  default:
    console.log("No case was matched.");
    break; // precautionary break if case order changes
}

var x = 10;
x == 10 && alert("x is 10");
x == 10 || alert("x is not 10");

/* -------------------------------------------------------------------------- */
/*                                Strategy                                    */
/* -------------------------------------------------------------------------- */
// A strategy pattern can be used in JavaScript in many cases to replace a switch statement. It is especially helpful
// when the number of conditions is dynamic or very large. It allows the code for each condition to be independent and separately testable.
// Strategy object is simple an object with multiple functions, representing each separate condition.

const AnimalSays = {
  dog() {
    return "woof";
  },
  cat() {
    return "meow";
  },
  lion() {
    return "roar";
  },
  // ... other animals
  default() {
    return "moo";
  },
};

function makeAnimalSpeak(animal) {
  // Match the animal by type
  const speak = AnimalSays[animal] || AnimalSays.default;
  console.log(animal + " says " + speak());
}

/* -------------------------------------------------------------------------- */
/*                           Using || and && short circuiting                 */
/* -------------------------------------------------------------------------- */
var x = 10;
x == 10 && alert("x is 10");
x == 10 || alert("x is not 10");
