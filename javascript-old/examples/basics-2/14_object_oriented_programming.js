/* 
  Object-Oriented Programming
*/

// Factory Functions - function creating objects
function createUnit(name, weapon) {
  return {
    name: name,
    weapon: weapon,
    attack() {
      return "attack with " + this.weapon;
    },
  };
}

// Object.create() using Pure Inheritance
function createElf(name, weapon) {
  const elf = Object.create(elfFunctions);
  elf.name = name;
  elf.weapon = weapon;
  return elf;
}

function elfFunctions() {
  return {
    attack() {
      return "attack with " + this.weapon;
    },
  };
}

// Constructor Functions
function Elf(name, weapon) {
  this.name = name;
  this.weapon = weapon;
}

Elf.prototype.attack1 = function () {
  return "attack with " + this.weapon;
};

Elf.prototype.attack2 = function () {
  const self = this;
  function innerAttack() {
    return "attack with " + self.weapon; // this inside a function of another function points to the global execution context
  }
  return innerAttack();
};

Elf.prototype.attack3 = function () {
  const innerAttack = () => "attack with " + this.weapon; // this in arrow function is who calls the function/the object from its left.
  return innerAttack();
};

// ES6 Class
class Elf {
  constructor(name, weapon) {
    this.name = name;
    this.weapon = weapon;
  }

  attack() {
    return "attack with " + this.weapon;
  }
}

/* The 4 ways of using this */

// implicit binding
var person = {
  fname: "John",
  lname: "Doe",
  getFullName() {
    console.log(this.fname + " " + this.lname);
  },
};

// explicit binding
var person = {
  fname: "John",
  lname: "Doe",
  getFullName: function () {
    console.log(this.fname + " " + this.lname);
  }.bind(this),
};

// this in a function inside of a function
var person = {
  fname: "John",
  lname: "Doe",
  getFullName() {
    var self = this;
    function inner() {
      console.log(self.fname + " " + self.lname);
    }
    inner();
  },
};

// this in a function inside of an arrow function
var person = {
  fname: "John",
  lname: "Doe",
  getFullName() {
    var inner = () => console.log(this.fname + " " + this.lname);
    inner();
  },
};

/* 
    The 4 Pillar of OOP 

    1. Encapsulation
    2. Abstraction
    3. Inheritance
    4. Polymorphism
*/

/* 
  Constructor Functions and Prototypes

  1. Blueprint for objects
  2. Properties and methods
  3. Can be called with new keyword
  4. All properties and methods are enumerable
  5. Not in strict mode by default  

  A prototype is an object (let's call it "P") that is linked to another object (let's call it "O") - it (the prototype object) kind of acts as a 
  "fallback object" to which the other object ("O") can reach out if you try to work with a property or method that's not defined on the object ("O") 
  itself.

  EVERY object in JavaScript by default has such a fallback object (i.e. a prototype object) - more on that in the next lectures.

  Constructor Functions and Prototypes power JavaSCript Objects because JavaScript uses Prototypical inheritance.
  Constructor prototype is assigned to instance upon the creation of it. 
  The instance can have the default or manually assigned prototype.
  JavaScript automatically looks into the prototype of the object and searches for the property or method there.

  Prototype chain: obj.__proto__

  Prototype and Method Types:
  1. Method shorthand - Assigned to the objects prototype and hence shared across all instance (not re-created per instance)
  2. Property anonymous function - Assigned to individual instances and hence re-created per object. 'this' refers to what called the method.
  3. Property arrow function - Assigned to individual instances and hence re-created per object. 'this' always refers to instance.

  REMEMBER: Unnecessary re-creations of function can cost performance!
*/
var obj = { number: 10 };
console.log("PROTOTYPE CHAIN", obj.__proto__); // __proto__ links up to prototype

function Person(fname, lname) {
  this.firstName = fname;
  this.lastName = lname;
}

Person.prototype.getFullName = function () {
  this.firstName + " " + this.lastName; // this = the object that calls the function. Does not matter where it is written, but who calls it. Don't want lexically scope this.
};

Person.prototype.getFullName = () => {
  this.firstName + " " + this.lastName; // this = undefined because arrow functions are lexically scope, they define this based on where they are written. In this case global scope.
};

Person.prototype.getFullName = () => {
  var self = this; // store reference to this for later
  function fullName() {
    self.firstName + " " + self.lastName;
  }
  return fullName();
};

var person = new Person("John", "Doe");

/* 
  Classes

  1. Blueprint for objects
  2. Properties and methods
  3. Must be called with new keyword
  4. Methods are non-enumerable by defaults
  5. Always in strict mode  
*/
class Person {
  // Method shorthand (shared across all instances)
  greet() {}

  // Property anonymous function (recreated)
  greet2 = function () {};

  // Property arrow function (recreated)
  greet3 = () => {};
}

class Course {
  // private field - gets converted into private property when the constructor is called
  #price;

  // getter method to access the private price property - encapsulate
  get price() {
    return this.#price;
  }

  // setter method to change the private price property - encapsulate
  set price(value) {
    if (value < 0) {
      throw "Invalid value!";
    }

    this.#price = value;
  }

  constructor(title, length, price) {
    this.title = title;
    this.length = length;
    this.price = price;
  }

  calculateValue() {
    return this.length / this.price;
  }

  printSummary() {
    console.log(
      `Title: ${this.title}, Length: ${this.length}, Price: ${this.price}`
    );
  }
}

class PracticalCourse extends Course {
  constructor(title, length, price, exercisesCount) {
    super(title, length, price);
    this.exercisesCount = exercisesCount;
  }

  printSummary() {
    // overriding inherited method - super gives us access to the parent class
    super.printSummary();
    // specific code here
    console.log(`Exercise Count: ${this.exercisesCount}`);
  }
}

class TheoreticalCourse extends Course {
  publish() {
    console.log("Pushing...");
  }
}

const tc = new TheoreticalCourse("123", 123, 123, 32);
const pc = new PracticalCourse("123", 123, 123, 32);

pc.price = 10;
pc.printSummary();

// function Book(title, author, ISBN, numCopies) {
//   this.title = title;
//   this.author = author;
//   this.ISBN = ISBN;
//   this.numCopies = numCopies;
// }

// Book.prototype.getAvailability = function () {
//   if (this.numCopies === 0) {
//     return "Out of stock";
//   } else if (this.numCopies < 10) {
//     return "Low stock";
//   } else {
//     return "In stock";
//   }
// };

// Book.prototype.sell = function (numCopiesSold = 1) {
//   this.numCopies -= numCopiesSold;
// };

// Book.prototype.restock = function (numCopiesStocked = 5) {
//   this.numCopies += numCopiesStocked;
// };

class Book {
  constructor(title, author, ISBN, numCopies) {
    this.title = title;
    this.author = author;
    this.ISBN = ISBN;
    this.numCopies = numCopies;
  }

  get availability() {
    return this.getAvailability();
  }

  getAvailability = () => {
    if (this.numCopies === 0) {
      return "Out of stock";
    } else if (this.numCopies < 10) {
      return "Low stock";
    } else {
      return "In stock";
    }
  };

  sell(numCopiesSold) {
    this.numCopies -= numCopiesSold;
  }

  restock(numCopiesStocked) {
    this.numCopies += numCopiesStocked;
  }
}

class TechnicalBook extends Book {
  constructor(title, author, ISBN, numCopies, edition) {
    super(title, author, ISBN, numCopies);
    this.edition = edition;
  }

  getEdition() {
    return `The current version of this book is ${this.edition}`;
  }
}

const HungerGame = new TechnicalBook(
  "Hunger Games",
  "Suzanne Collins",
  123123,
  5
);
console.log(HungerGame.getAvailability());

HungerGame.restock(20);
console.log(HungerGame.getAvailability());

HungerGame.sell(25);
console.log(HungerGame.getAvailability());

console.log(HungerGame.getEdition());

// function Movie(title, director, genre, releaseYear, rating) {
//   this.title = title;
//   this.director = director;
//   this.genre = genre;
//   this.releaseYear = releaseYear;
//   this.rating = rating;
// }

// Movie.prototype.getOverview = function () {
//   return `${this.title} a ${this.genre} film directed by ${this.director} was released ${this.releaseYear}. It received a rating of ${this.rating}`;
// };

class Movie {
  constructor(title, director, genre, releaseYear, rating) {
    this.title = title;
    this.director = director;
    this.genre = genre;
    this.releaseYear = releaseYear;
    this.rating = rating;
  }

  get overview() {
    return `${this.title} a ${this.genre} film directed by ${this.director} was released ${this.releaseYear}. It received a rating of ${this.rating}`;
  }
}

const Batman = new Movie(
  "The Dark Knight",
  "Christopher Nolan",
  "Action",
  2008,
  83
);

console.log(Batman);
console.log(Batman.overview);
