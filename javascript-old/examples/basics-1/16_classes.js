// A Person class using a constructor function
function Person(fname, lname, age) {
  // prevent calling constructors without the new keyword
  if (!new.target) {
    throw new Error("Constructor can only be invoked using new");
  }

  this.fname = fname;
  this.lname = lname;
  this.age = age;
}

Person.prototype.describe = function () {
  console.log(
    `Hi my name is ${this.fname} ${this.lname}, and i am ${this.age} years old.`
  );
};

const john = new Person("John", "Doe", 33);
john.describe();

const jane = new Person("Jane", "Doe", 28);
jane.describe();

// Constructor property

const prototype = Person.prototype; // the prototype property is an object that have a constructor property
const constructor = prototype.constructor; // [Function: Person]
console.log(constructor);

/* A Person class using the ES6 class syntax */

class PersonClass {
  constructor(fname, lname, age) {
    this.fname = fname;
    this.lname = lname;
    this.age = age;
    this._SSN = "";
    PersonClass.instanceCount++;
  }

  static instanceCount = 0;
  static numberOfInstances() {
    console.log(PersonClass.instanceCount);
  }

  describe() {
    console.log(
      `Hi my name is ${this.fname} ${this.lname}, and i am ${this.age} years old.`
    );
  }

  get SSN() {
    console.log(this._SSN);
  }

  set SSN(val) {
    this._SSN = val;
  }
}

const jo = new PersonClass("John", "Doe", 33);
jo.describe();
jo.SSN;
jo.SSN = 101;
jo.SSN;

const ja = new PersonClass("Jane", "Doe", 28);
ja.describe();

PersonClass.numberOfInstances();

/* 
  OOP and Classes using the ES6 Class syntax

  1. Abstract class
  2. Concrete class
  3. Inheritance
  4. Composition (Delegation over inheritance)
*/

class AbstractAnimal {
  constructor(type) {
    this.type = type;
  }

  eat() {
    console.log("eating...");
  }

  sleep() {
    console.log("sleeping...");
  }

  hunt() {
    console.log("hunting...");
  }
}

class Lion extends AbstractAnimal {
  constructor(type, size, weight) {
    super(type);
    this.size = size;
    this.weight = weight;
  }

  roar() {
    console.log("Roar!");
  }
}

class Cat extends AbstractAnimal {
  constructor(type, size, weight) {
    super(type);
    this.size = size;
    this.weight = weight;
  }

  meow() {
    console.log("meow!");
  }
}

const lion = new Lion("Wild cat", "Large", "300kg");
lion.roar();
lion.hunt();
lion.eat();
lion.sleep();

const kitty = new Cat("Domestic cat", "small", "5kg");
kitty.meow();
kitty.hunt();
kitty.eat();
kitty.sleep();

function Kitty(base) {
  return class extends base {
    constructor(type, size, weight) {
      super(type);
      this.size = size;
      this.weight = weight;
    }

    meow() {
      console.log("meow!");
    }
  };
}

const k = new Kitty(AbstractAnimal);

/* 

  COMPOSITIONS:

  - mixins
  - factory functions
  - dependency injection
  - modules
  - object.assign

*/

// Mixin for logging
const LoggerMixin = {
  log(message) {
    console.log(message);
  },
};

// Class that uses the LoggerMixin
class User {
  constructor(name) {
    this.name = name;
    Object.assign(this, LoggerMixin);
  }
}

// Use the mixin to add logging capabilities
// Object.assign(User.prototype, LoggerMixin);

const user = new User("John");
user.log("User created"); // Logs "User created"

// Factory functions
function UserFactory(name) {
  function log(message) {
    console.log(message);
  }

  return {
    log,
    name: name,
  };
}

const user1 = UserFactory("Jane");
user1.log("User created"); // Logs "User created"

// Dependency Injection
class Database {
  constructor(connString) {
    this.connectionString = connString;
  }

  connect() {
    console.log("connected to " + this.connectionString);
  }
}

class UserRepository {
  constructor(database) {
    this.database = database;
  }

  fetch() {
    this.database.connect();
    console.log("fetching users...");
  }
}

const db = new Database("test.db");
const users = new UserRepository(db);
users.fetch();
