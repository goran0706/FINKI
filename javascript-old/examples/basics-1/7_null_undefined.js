/* 

  null - absence of a value. This is an explicit way to set an empty value. Used when a variable expects an object type.

  undefined - absence of a value. 
  - function parameter is undefined when the optional parameter is given
  - function that returns void actually returns undefined
  - undefined is the value when accessing and object property that does not exist
  - undefined is the default value of uninitialized variables
*/

console.log(undefined); // undefined
console.log(typeof undefined); // undefined

console.log(null); // null
console.log(typeof null); // object - this is a bug
