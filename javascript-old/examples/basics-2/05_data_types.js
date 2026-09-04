/*
  Data Types

  Number, BigInteger, String, Boolean, Object, Symbol, undefined, null

  1. Primitive data types - hold simple values, usually allocated in the call stack memory.
  2. Reference data types - hold references (address) to the location in memory, usually the heap memory.

  typeof null returns object.
  typeof undefined returns undefined.

  undefined - means absence of definition, is also the default value for uninitialized variables. Therefore the default parameters works only with undefined.
  null - means it has a value but is empty
*/

var num = 10;
var bigInt = 1000000000000000000000000000000n;
var string = "Hello World";
var bool = true;
var obj = {};
var symbol = Symbol("private");
var val; // undefined
var val = null;

/* -------------------------------------------------------------------------- */
/*                            Finding data types                              */
/* -------------------------------------------------------------------------- */
// * typeof is the 'official' function that one uses to get the type in JavaScript,
// * however in certain cases it might yield some unexpected results.

// 1. Strings
typeof "String";
typeof Date("2011, 01, 01");

// 2. Numbers
typeof 42;

// 3. Bool
typeof true;

// 4. Object
typeof {};
typeof [];
typeof null;
typeof /aaa/;
typeof Error();

// 5. Function
typeof function () {};

// 6. Undefined
var var1;
typeof var1;

/* -------------------------------------------------------------------------- */
/*                            Finding an object's class                       */
/* -------------------------------------------------------------------------- */
// * To ﬁnd whether an object was constructed by a certain constructor or one inheriting from it, you can use the instanceof command
// * Note that primitive values are not considered instances of any class:
console.log(2 instanceof Number); //false
console.log("abc" instanceof String); //false
console.log(true instanceof Boolean); //false
console.log(Symbol() instanceof Symbol); //false

// * Every value in JavaScript besides null and undefined also has a constructor property storing the function that was used to construct it.
// * This even works with primitives.
console.log([] instanceof Object, [] instanceof Array); //true true
console.log([].constructor === Object, [].constructor === Array); //false true
console.log(isNumber(null), isNumber(undefined)); //false false
console.log(isNumber(0), isNumber(Number("10.1")), isNumber(NaN)); //true true true
console.log(
  isNumber("abc"),
  isNumber([]),
  isNumber(() => 1)
); //false false false

/* -------------------------------------------------------------------------- */
/*              Getting object type by constructor name                       */
/* -------------------------------------------------------------------------- */
// * When one with typeof operator one gets type object it falls into somewhat wast category...
// * In practice you might need to narrow it down to what sort of 'object' it actually is and one way to do it is to use
// * object constructor name to get what flavor of object it actually is: Object.prototype.toString.call(yourObject)
Object.prototype.toString.call("String"); //  "[object String]"
Object.prototype.toString.call(42); //  "[object Number]"
Object.prototype.toString.call(true); //  "[object Boolean]"
Object.prototype.toString.call(Object()); //  "[object Object]"
Object.prototype.toString.call({}); //  "[object Object]"
Object.prototype.toString.call(function () {}); // "[object Function]"
Object.prototype.toString.call(new Date(2015, 10, 21)); //  "[object Date]"
Object.prototype.toString.call(new RegExp()); //  "[object RegExp]"
Object.prototype.toString.call(/foo/); //  "[object RegExp]"
Object.prototype.toString.call([]); //  "[object Array]"
Object.prototype.toString.call(null); // "[object Null]"
Object.prototype.toString.call(undefined); //  "[object Undefined]"
Object.prototype.toString.call(Error()); // "[object Error]"
