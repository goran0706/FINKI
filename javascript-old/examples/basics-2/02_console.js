/**
 * Using console.log
 *
 * All modern web browsers, Node.js as well as almost every other JavaScript environments support writing messages
 * to a console using a suite of logging methods. The most common of these methods is console.log().
 * In a browser environment, the console.log() function is predominantly used for debugging purposes.
 *
 * 1. Logging variables
 * 2. Logging objects
 * 3. Logging HTML elements
 * 4. Logging using placeholders
 *
 * List of console available methods:
 * assert;
 * clear;
 * count;
 * debug;
 * dir;
 * dirxml;
 * error;
 * group;
 * groupCollapsed;
 * groupEnd;
 * info;
 * log;
 * markTimeline;
 * profile;
 * profileEnd;
 * table;
 * time;
 * timeEnd;
 * timeStamp;
 * timeline;
 * timelineEnd;
 * trace;
 * warn;
 */

// Logging variables
const foo = "bar";
console.log(foo);

// Logging objects
console.log({
  name: "John",
  age: 32,
  address: {
    city: "New York",
    number: 1000,
  },
});

// Logging HTML elements
console.log(document.body);

// Logging placeholders
const greet = "Hello";
const firstName = "John";
console.log("%s, %s", greet, firstName);
console.log("string: %s", "this is a string placeholder");
console.log("number: %i", 1);
console.log("number: %d", 2);

/* -------------------------------------------------------------------------- */
/*                   Measuring time --> console.time(label)                   */
/* -------------------------------------------------------------------------- */
console.time("Check loop performance");
for (let index = 0; index < 100000; index++) {
  // do nothing...
}
console.timeEnd("Check loop performance");

/* -------------------------------------------------------------------------- */
/*                   Formatting console output using % tokens:                */
/* -------------------------------------------------------------------------- */
/**
 * * %s
 * * %i or %d Formats the value as an integer
 * * %f Formats the value as a floating point value
 * * %o Formats the value as an expandable DOM element
 * * %O Formats the value as an expandable JavaScript object
 * * %c Applies CSS style rules to the output string as specified by the second parameter
 */
console.log("%s", "string");
console.log("%i", 1);
console.log("%d", 2);
console.log("%f", 3);
console.log("%O", { num: 4 });
console.log("%cHello world!", "color: blue; font-size: xx-large");

/* -------------------------------------------------------------------------- */
/*                        Using groups to ident output                        */
/* -------------------------------------------------------------------------- */
console.groupCollapsed(); // creates a collapsed group that can be expanded
console.group(); // creates and expanded group that can be collapsed
console.groupEnd(); // exits the current group

/* -------------------------------------------------------------------------- */
/*          Including a stack trace when logging - console.trace()            */
/* -------------------------------------------------------------------------- */
function foo() {
  console.trace("My log statement");
}
foo();

/* -------------------------------------------------------------------------- */
/*                    Tabulating values - console.table()                     */
/* -------------------------------------------------------------------------- */
const data = {
  id: 1,
  username: "JohnnyB.Goode",
  firstName: "John",
  lastName: "Doe",
  age: 32,
};
var personArr = [
  {
    personId: 123,
    name: "Jhon",
    city: "Melbourne",
    phoneNo: "1234567890",
  },
  {
    personId: 124,
    name: "Amelia",
    city: "Sydney",
    phoneNo: "1234567890",
  },
  {
    personId: 125,
    name: "Emily",
    city: "Perth",
    phoneNo: "1234567890",
  },
  {
    personId: 126,
    name: "Abraham",
    city: "Perth",
    phoneNo: "1234567890",
  },
];
console.table(data);
console.table(personArr);

/* -------------------------------------------------------------------------- */
/*                        Counting - console.count()                          */
/* -------------------------------------------------------------------------- */
const greeting = "Hello World";
console.count(greeting);
console.count(greeting);
console.count("Hello World");
console.count("Hello World!!!");

/* -------------------------------------------------------------------------- */
/* Displaying objects and XML interactively - console.dir(), console.dirxml() */
/* -------------------------------------------------------------------------- */
const fruit = { label: "Banana", price: "$1" };
console.dir(fruit);
console.dirxml(document.body);

/* -------------------------------------------------------------------------- */
/*              Debugging with assertions - console.assert()                  */
/* -------------------------------------------------------------------------- */
console.assert(1 > 2);
console.assert(1 < 2);

/* -------------------------------------------------------------------------- */
/*                    Clearing the console - console.clear()                  */
/* -------------------------------------------------------------------------- */
console.clear();

/**
 * Using window.alert()
 *
 * The alert method displays a visual alert box on screen.
 * The alert method parameter is displayed to the user in plain text.
 * since all window properties are automatically global variables, we can use alert as a global variable instead of as a property of window -
 * meaning you can directly use alert() instead of window.alert().
 *
 * alert() acts as a modal prompt meaning that the code calling alert will pause until the prompt is answered.
 * Traditionally this means that no other JavaScript code will execute until the alert is dismissed.
 *
 * The use of alerts is usually discouraged in favour of other methods that do not block users from interacting with the page,
 * in order to create a better user experience. Nevertheless, it can be useful for debugging.
 */

alert("Hello World!");

/**
 * Using window.prompt()
 *
 * An easy way to get an input from a user is by using the prompt() method.
 * If the user clicks the OK button, the input value is returned. Otherwise, the method returns null.
 * The return value of prompt is always a string, unless the user clicks Cancel , in which that case it returns null.
 */
const userName = prompt("Enter your name");
const password = prompt("Enter your password");
alert(`You have entered ${userName} & ${password}`);
alert("You have entered %s & %s", userName, password);

/**
 * Using window.confirm()
 *
 * The window.confirm() method displays a modal dialog with an optional message and two buttons, OK and Cancel.
 */

const deleteConfirmed = confirm("Are you sure you want to delete this?");
