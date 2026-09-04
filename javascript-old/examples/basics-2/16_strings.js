/* -------------------------------------------------------------------------- */
/*                                Creating Strings                            */
/* -------------------------------------------------------------------------- */

// Strings can be created from other types using the String() function.
var intString = String(32); // "32"
var booleanString = String(true); // "true"
var nullString = String(null); // "null"

// Or, toString() can be used to convert Numbers, Booleans or Objects to Strings.
var _intString = (5232).toString(); // "5232"
var _booleanString = false.toString(); // "false"
var _objString = {}.toString(); // "[object Object]"

// Strings also can be created by using String.fromCharCode method.
String.fromCharCode(104, 101, 108, 108, 111); //"hello"

// Creating a String object using new keyword is allowed, but is not recommended as it behaves like Objects unlike primitive strings.
var objectString = new String('Yes, I am a String object');
typeof objectString; //"object"
typeof objectString.valueOf(); //"string"

/* -------------------------------------------------------------------------- */
/*                             Concatenating Strings                          */
/* -------------------------------------------------------------------------- */

// String concatenation can be done with the + concatenation operator, or with the built-in concat() method on the String object prototype.
var foo = 'Foo';
var bar = 'Bar';
console.log(foo + bar); // => "FooBar"
console.log(foo + ' ' + bar); // => "Foo Bar"
foo.concat(bar); // => "FooBar"
'a'.concat('b', ' ', 'd');

// Strings can be concatenated with non-string variables but will type-convert the non-string variables into strings.
var string = 'string';
var number = 32;
var boolean = true;
console.log(string + number + boolean); // "string32true"

/* -------------------------------------------------------------------------- */
/*                                String Templates                            */
/* -------------------------------------------------------------------------- */

var place = `World`;
var greet = `Hello ${place}!`;
console.log(greet); // "Hello World!"

`a\\b`; // = a\b
String.raw`a\\b`; // = a\\b

/* -------------------------------------------------------------------------- */
/*                                Reverse String                              */
/* -------------------------------------------------------------------------- */

var reversed1 = 'String'.split('').reverse().join('');
var reversed2 = [...'String'].reverse().join('');
var reversed3 = customReverse('String');

console.log(reversed1);
console.log(reversed2);
console.log(reversed3);

function customReverse() {
    var strRev = '';
    for (let index = string.length - 1; index >= 0; index--) {
        strRev += string[index];
    }
    return strRev;
}

/* -------------------------------------------------------------------------- */
/*                           Comparing Strings Lexicographically              */
/* -------------------------------------------------------------------------- */

var a = 'hello';
var b = 'world';
console.log(a.localeCompare(b)); // -1

// This is especially useful when using a sorting function that compares based on the sign of the return value (such as sort).
var arr = ['bananas', 'cranberries', 'apples'];
arr.sort(function (a, b) {
    return a.localeCompare(b);
});

/* -------------------------------------------------------------------------- */
/*                            Access character at index                       */
/* -------------------------------------------------------------------------- */

var string = 'Hello, World!';
console.log(string.charAt(4)); // "o"

var string = 'Hello, World!';
console.log(string.charCodeAt(4)); // 111

var string = 'Hello, World!';
console.log(string[4]); // "o

/* -------------------------------------------------------------------------- */
/*                                Word Counter                                */
/* -------------------------------------------------------------------------- */

function wordCount(val) {
    var wom = val.match(/\S+/g);
    return {
        charactersNoSpaces: val.replace(/\s+/g, '').length,
        characters: val.length,
        words: wom ? wom.length : 0,
        lines: val.split(/\r*\n/).length,
    };
}
// Use like:
wordCount(someMultilineText).words; // (Number of words)

/* -------------------------------------------------------------------------- */
/*                                Trim whitespace                             */
/* -------------------------------------------------------------------------- */

console.log('       String      '.trim());
console.log('       String      '.trimStart());
console.log('       String      '.trimEnd());

/* -------------------------------------------------------------------------- */
/*                             Splitting a string into an array               */
/* -------------------------------------------------------------------------- */

var arrS;
var s = 'one, two, three, four, five';
s.split(', '); // ["one", "two", "three", "four", "five"]
s.split(', ').join('--'); // "one--two--three--four--five"
arrS = [...s];

/* -------------------------------------------------------------------------- */
/*                              Detecting a string                            */
/* -------------------------------------------------------------------------- */

var aString = 'my string';
var anInt = 5;
var anObj = {};

// To detect whether a parameter is a primitive string, use typeof:
typeof aString === 'string'; // true
typeof anInt === 'string'; // false
typeof anObj === 'string'; // false

// If you ever have a String object, via new String("somestr"), then the above will not work. In this instance, we can use instanceof:
var aStringObj = new String('my string');
aStringObj instanceof String; // true

// To cover both instances, we can write a simple helper function:
var isString = function (value) {
    return typeof value === 'string' || value instanceof String;
};
var aString = 'Primitive String';
var aStringObj = new String('String Object');
isString(aString); // true
isString(aStringObj); // true
isString({}); // false
isString(5); // false

/* -------------------------------------------------------------------------- */
/*                            Substrings with slice                           */
/* -------------------------------------------------------------------------- */

var s = '0123456789abcdefg';
s.slice(0, 5); // "01234"
s.slice(5, 6); // "5"
s.slice(10); // "abcdefg"

/* -------------------------------------------------------------------------- */
/*                           Number String representation                     */
/* -------------------------------------------------------------------------- */
// base 10 Number
var b10 = 12;
// base 16 String representation
var b16 = b10.toString(16); // "c"

// base 16 String representation
var b16 = 'c';
// base 10 Number
var b10 = parseInt(b16, 16); // 12

let b16 = '3.243f3e0370cdc';
// Split into integer and fraction parts
let [i16, f16] = b16.split('.');
// Calculate base 10 integer part
let i10 = parseInt(i16, 16); // 3
// Calculate the base 10 fraction part
let f10 = parseInt(f16, 16) / Math.pow(16, f16.length); // 0.14158999999999988
// Put the base 10 parts together to find the Number
let b10 = i10 + f10; // 3.14159

/* -------------------------------------------------------------------------- */
/*                          String Find and Replace Functions                 */
/* -------------------------------------------------------------------------- */
var string = 'Hello, World!';
console.log(string.indexOf('o')); // 4
console.log(string.indexOf('foo')); // -1

var string = 'Hello, World!';
console.log(string.lastIndexOf('o')); // 8
console.log(string.lastIndexOf('foo')); // -1

var string = 'Hello, World!';
console.log(string.includes('Hello')); // true
console.log(string.includes('foo')); // false

var string = 'Hello, World!';
string = string.replace('Hello', 'Bye');
console.log(string); // "Bye, World!"

string = string.replace(/W.{3}d/g, 'Universe');
console.log(string); // "Bye, Universe!"

var string = 'heLlo, woRlD!';
string = string.replace(/([a-zA-Z])([a-zA-Z]+)/g, function (match, g1, g2) {
    return g1.toUpperCase() + g2.toLowerCase();
});
console.log(string); // "Hello, World!"

/* -------------------------------------------------------------------------- */
/*                      Find the index of a substring inside a string         */
/* -------------------------------------------------------------------------- */
'Hello World'.indexOf('Wor'); // 7
'harr dee harr dee harr'.indexOf('dee', 10); // 14
'Hello World'.indexOf('WOR');

/* -------------------------------------------------------------------------- */
/*                            String to Upper Case                            */
/* -------------------------------------------------------------------------- */
console.log('qwerty'.toUpperCase()); // 'QWERTY'

/* -------------------------------------------------------------------------- */
/*                            String to Lower Case                            */
/* -------------------------------------------------------------------------- */
console.log('QWERTY'.toLowerCase()); // 'qwerty'

/* -------------------------------------------------------------------------- */
/*                            Repeat a String                                 */
/* -------------------------------------------------------------------------- */
'abc'.repeat(3); // Returns "abcabcabc"
'abc'.repeat(0); // Returns ""
'abc'.repeat(-1); // Throws a RangeError
