const s1 = "Hello World"; // primitive type string 'Hello World'
const s2 = String(10); // primitive types string '10'
const s3 = new String("Hello World"); // reference type [String: 'Hello World']
console.log(s1, s2, s3);

/* Escape sequence in string literals */
console.log("Don't\ttouch\tthat");

/* singleline string declared multiline */
const singlelineString =
  "this \
  is\
  a\
  single line\
  string\
";

/* using the backticks we can interpolate javascript expression into strings, we can avoid escaping characters etc... */
const betterString = ` this  is  a  single line string`;

console.log(singlelineString);
console.log(betterString);

/* Working with Strings */
const s = "Hello World!";

// Obtaining portions of a string
s.substring(" ");
s.slice(0, 4);
s.slice(-3);
s.split(" ");

// Searching a string
s.indexOf("l");
s.indexOf("l", 3);
s.indexOf("zz");
s.lastIndexOf("l");

// Boolean searching functions in ES6 and later
s.includes("Hello");
s.startsWith("H");
s.endsWith("!");

// Creating modified versions of a string
s.toUpperCase();
s.toLocaleUpperCase();
s.toLowerCase();
s.toLocaleLowerCase();
s.normalize();
s.normalize("NFC");
s.replace("Hello", "Hi");

// Inspecting individual (16-bit) characters of a string
s.charAt(0);
s.charCodeAt(0);
s.codePointAt(0);

// String padding functions in ES2017
s.padStart(2);
s.padStart(2, "$");
s.padEnd(2);
s.padEnd(2, "-");

// Space trimming functions. trim() is ES5; others ES2019
s.trim();
s.trimStart();
s.trimEnd();

// Miscellaneous string methods
s.concat("!!");
s.repeat(10);

/* Template literals */
const { fname, lname, age } = { fname: "John", lname: "Doe", age: 33 };
const personDescription = `Hi i am ${fname} ${lname} and i am ${age} years old.`;
console.log(personDescription);

/* Tagged Template Literals */
function printPerson(strings, ...values) {
  const [s1, s2, s3, s4] = strings;
  const [v1, v2, v3] = values;
  const str = s1 + v1 + v2 + s2 + s3 + v3 + s4;

  return str;
}

const personDescription2 = printPerson`Hi i am ${fname} ${lname} and i am ${age} years old.`;
console.log(personDescription2);

/* Pattern matching, searching - RegularExpression */
const re = /Hello World/;
console.log(s.search(re));
console.log(s.match(re));
console.log(s.replace(re, "Hi World!"));
console.log(s.split(/\W/));
