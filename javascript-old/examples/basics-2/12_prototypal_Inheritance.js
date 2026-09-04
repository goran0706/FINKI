/* 
  Prototypal Inheritance
*/
var array = [];
// .__proto__ links to the prototype property of the parent object (up the prototype chain).
// if it cant find the property or method on the current object, then it will check up the prototype chain, until it finds it or reach the root null prototype.
console.log(array.__proto__);

var obj1 = {
  fname: "John",
  lname: "Doe",
  getFullName() {
    return this.fname + " " + this.lname;
  },
};
var obj2 = {};

// obj2 inherits all the properties and methods from obj1, by linking __proto__ to prototype. Bad practice for inheritance.
obj2.__proto__ = obj1;
obj2.getFullName();

// check the inheritance
obj1.hasOwnProperty("fname"); // true
obj2.hasOwnProperty("fname"); // false

// check if property exists
obj1.hasOwn("fname");
obj1.hasOwnProperty("fname");
console.log("fname" in obj1);
