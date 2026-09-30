/**

 * Classes
 * =======
 *
 * Classes provide JavaScript syntax for defining objects that share behavior and state.
 * A class can define constructors, instance methods, getters, setters, static members,
 * private members, and inheritance relationships.
 *
 * Classes are built on JavaScript's prototype-based object model and provide
 * structured syntax for creating and working with related objects.
 */

// ---------------------------------------------------------------------
// 1. Basic class syntax
// ---------------------------------------------------------------------

// A class defines a structure for creating objects with shared behavior.

class User {
  greet() {
    return "Hello!";
  }
}

const user = new User();

console.log(user.greet()); // "Hello!"

// `new User()` creates an instance of `User`.
// `greet()` is an instance method available through `User.prototype`.

// ---------------------------------------------------------------------
// 2. The `constructor`
// ---------------------------------------------------------------------

// The constructor runs automatically when a new instance is created.

class Person {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Hello, ${this.name}!`;
  }
}

const person = new Person("John");

console.log(person.name); // "John"
console.log(person.greet()); // "Hello, John!"

// The constructor initializes instance state.
// `this` refers to the newly created instance during construction.

// ---------------------------------------------------------------------
// 3. Creating multiple instances
// ---------------------------------------------------------------------

// One class can create many independent objects.

class Product {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }

  getLabel() {
    return `${this.name}: $${this.price}`;
  }
}

const keyboard = new Product("Keyboard", 100);
const mouse = new Product("Mouse", 50);

console.log(keyboard.getLabel()); // "Keyboard: $100"
console.log(mouse.getLabel()); // "Mouse: $50"

// Each instance has its own property values.
// The method is shared through the class prototype.

// ---------------------------------------------------------------------
// 4. Instance properties
// ---------------------------------------------------------------------

// Properties assigned through `this` belong to the individual instance.

class Counter {
  constructor(initialValue) {
    this.value = initialValue;
  }

  increment() {
    this.value += 1;
  }
}

const counterA = new Counter(0);
const counterB = new Counter(10);

counterA.increment();

console.log(counterA.value); // 1
console.log(counterB.value); // 10

// `counterA` and `counterB` maintain independent state.

// ---------------------------------------------------------------------
// 5. Instance methods
// ---------------------------------------------------------------------

// Methods declared in a class are available to its instances.

class Calculator {
  add(a, b) {
    return a + b;
  }

  multiply(a, b) {
    return a * b;
  }
}

const calculator = new Calculator();

console.log(calculator.add(2, 3)); // 5
console.log(calculator.multiply(4, 5)); // 20

// Instance methods are normally defined once on the prototype
// rather than copied into every instance.

// ---------------------------------------------------------------------
// 6. Methods can use instance state
// ---------------------------------------------------------------------

class BankAccount {
  constructor(owner, balance) {
    this.owner = owner;
    this.balance = balance;
  }

  deposit(amount) {
    this.balance += amount;
  }

  getBalance() {
    return this.balance;
  }
}

const account = new BankAccount("John", 100);

account.deposit(50);

console.log(account.owner); // "John"
console.log(account.getBalance()); // 150

// Methods can read and modify the instance through `this`.

// ---------------------------------------------------------------------
// 7. `this` inside class methods
// ---------------------------------------------------------------------

// A class method receives `this` from the object used to call it.

class UserProfile {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}

const profile = new UserProfile("John");

console.log(profile.getName()); // "John"

// The call `profile.getName()` makes `profile` the method's `this` value.

// ---------------------------------------------------------------------
// 8. Losing `this` from a method reference
// ---------------------------------------------------------------------

// Extracting a method removes the object receiver from the call.

class Greeter {
  constructor(name) {
    this.name = name;
  }

  greet() {
    "use strict";
    return `Hello, ${this.name}!`;
  }
}

const greeter = new Greeter("John");
const greet = greeter.greet;

// `greet()` is now a standalone call, so it does not receive `greeter` as `this`.
//
// greet(); // TypeError: Cannot read properties of undefined

// The method can instead be called through its object or explicitly bound.

// ---------------------------------------------------------------------
// 9. Binding a class method
// ---------------------------------------------------------------------

// `bind()` returns a new function with a permanently associated `this` value.

class Message {
  constructor(text) {
    this.text = text;
  }

  print() {
    return this.text;
  }
}

const message = new Message("Hello");
const printMessage = message.print.bind(message);

console.log(printMessage()); // "Hello"

// `printMessage()` can be called as a standalone function because
// `bind()` fixes its `this` value to `message`.

// ---------------------------------------------------------------------
// 10. Class fields
// ---------------------------------------------------------------------

// Instance fields can be declared directly in the class body.

class UserAccount {
  role = "user";

  constructor(name) {
    this.name = name;
  }
}

const accountUser = new UserAccount("John");

console.log(accountUser.name); // "John"
console.log(accountUser.role); // "user"

// Instance fields are initialized separately for each new instance.

// ---------------------------------------------------------------------
// 11. Field initialization with expressions
// ---------------------------------------------------------------------

// Class fields can be initialized with expressions.

class Order {
  status = "pending";
  createdAt = new Date();

  constructor(id) {
    this.id = id;
  }
}

const order = new Order(1001);

console.log(order.id); // 1001
console.log(order.status); // "pending"

// `createdAt` contains the time at which this instance was initialized.
// Its exact value depends on when the code runs.

// ---------------------------------------------------------------------
// 12. Private fields
// ---------------------------------------------------------------------

// A `#` prefix creates a private class field.
// Private fields can only be accessed from within the class body.

class SecureAccount {
  #balance = 0;

  deposit(amount) {
    this.#balance += amount;
  }

  getBalance() {
    return this.#balance;
  }
}

const secureAccount = new SecureAccount();

secureAccount.deposit(100);

console.log(secureAccount.getBalance()); // 100

// Direct access from outside the class is invalid:
//
// secureAccount.#balance;

// Private fields provide language-level encapsulation.

// ---------------------------------------------------------------------
// 13. Private methods
// ---------------------------------------------------------------------

// Methods can also be private by using the `#` prefix.

class Validator {
  #isValid(value) {
    return value.length > 0;
  }

  validate(value) {
    return this.#isValid(value);
  }
}

const validator = new Validator();

console.log(validator.validate("JavaScript")); // true
console.log(validator.validate("")); // false

// `#isValid()` can only be called from code inside the class.

// ---------------------------------------------------------------------
// 14. Getters
// ---------------------------------------------------------------------

// A getter allows a method to be accessed using property syntax.

class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  get area() {
    return this.width * this.height;
  }
}

const rectangle = new Rectangle(10, 5);

console.log(rectangle.area); // 50

// `area` looks like a property but runs its getter when accessed.

// ---------------------------------------------------------------------
// 15. Setters
// ---------------------------------------------------------------------

// A setter allows assignment syntax to trigger custom behavior.

class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }

  get fahrenheit() {
    return (this.celsius * 9) / 5 + 32;
  }

  set fahrenheit(value) {
    this.celsius = ((value - 32) * 5) / 9;
  }
}

const temperature = new Temperature(20);

console.log(temperature.fahrenheit); // 68

temperature.fahrenheit = 86;

console.log(temperature.celsius); // 30
console.log(temperature.fahrenheit); // 86

// Getters and setters provide property-like syntax around custom behavior.

// ---------------------------------------------------------------------
// 16. Static methods
// ---------------------------------------------------------------------

// Static methods belong to the class itself rather than its instances.

class MathHelper {
  static add(a, b) {
    return a + b;
  }
}

console.log(MathHelper.add(2, 3)); // 5

// Static methods are called on the class:
//
// MathHelper.add(2, 3);

// They are not available as instance methods.

// ---------------------------------------------------------------------
// 17. Static fields
// ---------------------------------------------------------------------

// Static fields also belong to the class itself.

class Configuration {
  static environment = "development";
}

console.log(Configuration.environment); // "development"

// `environment` is a property of `Configuration`, not of its instances.

// ---------------------------------------------------------------------
// 18. Static members vs instance members
// ---------------------------------------------------------------------

class UserService {
  static serviceName = "UserService";

  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}

const serviceUser = new UserService("John");

console.log(UserService.serviceName); // "UserService"
console.log(serviceUser.getName()); // "John"

// Static members belong to the class.
// Instance members belong to individual objects.

// ---------------------------------------------------------------------
// 19. Static methods can create instances
// ---------------------------------------------------------------------

// A static method can act as a factory for class instances.

class UserFactory {
  constructor(name) {
    this.name = name;
  }

  static createGuest() {
    return new UserFactory("Guest");
  }
}

const guest = UserFactory.createGuest();

console.log(guest.name); // "Guest"

// Static factory methods can provide named construction operations.

// ---------------------------------------------------------------------
// 20. Class inheritance
// ---------------------------------------------------------------------

// `extends` creates a subclass that inherits from another class.

class Animal {
  speak() {
    return "Some sound";
  }
}

class Dog extends Animal {
  bark() {
    return "Woof!";
  }
}

const dog = new Dog();

console.log(dog.speak()); // "Some sound"
console.log(dog.bark()); // "Woof!"

// `Dog` inherits `speak()` from `Animal` and defines `bark()` itself.

// ---------------------------------------------------------------------
// 21. Constructors with inheritance
// ---------------------------------------------------------------------

// A derived constructor must call `super()` before accessing `this`.

class PersonBase {
  constructor(name) {
    this.name = name;
  }
}

class Employee extends PersonBase {
  constructor(name, role) {
    super(name);
    this.role = role;
  }
}

const employee = new Employee("John", "Developer");

console.log(employee.name); // "John"
console.log(employee.role); // "Developer"

// `super(name)` invokes the parent constructor.
// The parent constructor initializes the inherited part of the instance.

// ---------------------------------------------------------------------
// 22. Inherited methods
// ---------------------------------------------------------------------

class Vehicle {
  start() {
    return "Vehicle started";
  }
}

class Car extends Vehicle {
  drive() {
    return "Car is driving";
  }
}

const car = new Car();

console.log(car.start()); // "Vehicle started"
console.log(car.drive()); // "Car is driving"

// `Car` inherits `start()` through its prototype chain.

// ---------------------------------------------------------------------
// 23. Method overriding
// ---------------------------------------------------------------------

// A subclass can provide its own implementation of an inherited method.

class AnimalBase {
  speak() {
    return "Animal sound";
  }
}

class Cat extends AnimalBase {
  speak() {
    return "Meow";
  }
}

const cat = new Cat();

console.log(cat.speak()); // "Meow"

// The subclass method takes precedence over the inherited implementation.

// ---------------------------------------------------------------------
// 24. Calling a parent method with `super`
// ---------------------------------------------------------------------

// `super.method()` calls an inherited method.

class Parent {
  greet() {
    return "Hello";
  }
}

class Child extends Parent {
  greet() {
    return `${super.greet()}, child!`;
  }
}

const child = new Child();

console.log(child.greet()); // "Hello, child!"

// `super.greet()` invokes the parent implementation from the subclass method.

// ---------------------------------------------------------------------
// 25. `super` in subclass constructors
// ---------------------------------------------------------------------

// `super()` invokes the parent constructor.

class BaseUser {
  constructor(name) {
    this.name = name;
  }
}

class Admin extends BaseUser {
  constructor(name, permissions) {
    super(name);
    this.permissions = permissions;
  }
}

const admin = new Admin("John", ["read", "write"]);

console.log(admin.name); // "John"
console.log(admin.permissions); // ["read", "write"]

// The parent constructor initializes the inherited state.
// The subclass constructor then initializes its own state.

// ---------------------------------------------------------------------
// 26. `instanceof`
// ---------------------------------------------------------------------

// `instanceof` checks whether a prototype occurs in an object's
// prototype chain.

class UserEntity {}

class AdminEntity extends UserEntity {}

const adminEntity = new AdminEntity();

console.log(adminEntity instanceof AdminEntity); // true
console.log(adminEntity instanceof UserEntity); // true
console.log(adminEntity instanceof Object); // true

// Because `AdminEntity` extends `UserEntity`, its instances also satisfy
// the `instanceof UserEntity` check.

// ---------------------------------------------------------------------
// 27. Classes are prototype-based
// ---------------------------------------------------------------------

// JavaScript classes use prototypes underneath the class syntax.

class Example {
  greet() {
    return "Hello";
  }
}

const example = new Example();

console.log(example.greet()); // "Hello"
console.log(Object.getPrototypeOf(example) === Example.prototype); // true

// The instance delegates method lookup to `Example.prototype`.

// ---------------------------------------------------------------------
// 28. Methods are shared through the prototype
// ---------------------------------------------------------------------

class PersonRecord {
  greet() {
    return "Hello";
  }
}

const personA = new PersonRecord();
const personB = new PersonRecord();

console.log(personA.greet === personB.greet); // true

// Both instances access the same function through the prototype.

// ---------------------------------------------------------------------
// 29. Class expressions
// ---------------------------------------------------------------------

// A class can be assigned to a variable using a class expression.

const UserClass = class {
  Hello;

  greet() {
    return `Hello, ${this.name}!`;
  }
};

const classUser = new UserClass("John");

console.log(classUser.greet()); // "Hello, John!"

// Class expressions can be anonymous or named.

// ---------------------------------------------------------------------
// 30. Named class expressions
// ---------------------------------------------------------------------

// A class expression can have an internal name.

const ProductClass = class Product {
  constructor(name) {
    this.name = name;
  }
};

const classProduct = new ProductClass("Keyboard");

console.log(classProduct.name); // "Keyboard"

// The outer variable refers to the class value.
// The internal class name is available inside the class body.

// ---------------------------------------------------------------------
// 31. Classes are not callable like regular functions
// ---------------------------------------------------------------------

class UserClassExample {}

const classInstance = new UserClassExample();

console.log(classInstance instanceof UserClassExample); // true

// Calling a class without `new` throws a TypeError:
//
// UserClassExample();
// TypeError: Class constructor UserClassExample cannot be invoked without 'new'

// Classes must be instantiated with `new`.

// ---------------------------------------------------------------------
// 32. Class declarations are not usable before initialization
// ---------------------------------------------------------------------

// Class declarations are subject to the Temporal Dead Zone.

const createUserInstance = () => new LaterUser();

class LaterUser {
  constructor() {
    this.name = "John";
  }
}

console.log(createUserInstance().name); // "John"

// The function can reference the class before its declaration because
// the function is not executed until after the class has been initialized.

// Direct access before initialization would fail:
//
// const user = new FutureUser();
// class FutureUser {}

// ---------------------------------------------------------------------
// 33. Private fields and methods together
// ---------------------------------------------------------------------

class Account {
  #balance = 0;

  #isValidAmount(amount) {
    return amount > 0;
  }

  deposit(amount) {
    if (this.#isValidAmount(amount)) {
      this.#balance += amount;
    }
  }

  getBalance() {
    return this.#balance;
  }
}

const privateAccount = new Account();

privateAccount.deposit(100);
privateAccount.deposit(-50);

console.log(privateAccount.getBalance()); // 100

// Private implementation details can remain hidden while the class
// exposes a controlled public API.

// ---------------------------------------------------------------------
// 34. Classes and composition
// ---------------------------------------------------------------------

// Classes can contain instances of other classes instead of relying
// on inheritance for every relationship.

class Engine {
  start() {
    return "Engine started";
  }
}

class CarWithEngine {
  constructor() {
    this.engine = new Engine();
  }

  start() {
    return this.engine.start();
  }
}

const composedCar = new CarWithEngine();

console.log(composedCar.start()); // "Engine started"

// `CarWithEngine` contains an `Engine` instead of extending `Engine`.
// Composition and inheritance model different kinds of relationships.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Classes provide structured syntax for creating objects with shared behavior and state.
// - `constructor` initializes a new instance.
// - Instance properties belong to individual objects.
// - Instance methods are normally shared through the class prototype.
// - `this` in a class method depends on how the method is called.
// - Extracting a method can lose its original receiver.
// - `bind()` can create a function with a fixed `this` value.
// - Class fields can define instance and static properties.
// - Private fields and methods use the `#` syntax.
// - Getters and setters provide property-like access to custom behavior.
// - Static members belong to the class rather than its instances.
// - `extends` creates an inheritance relationship.
// - `super()` invokes a parent constructor.
// - `super.method()` invokes an inherited method.
// - Subclasses can override inherited methods.
// - `instanceof` checks the prototype chain.
// - Classes use JavaScript's prototype-based object model underneath the syntax.
// - Class expressions can be anonymous or named.
// - Class declarations are subject to the Temporal Dead Zone.
// - Composition allows a class to contain other objects without inheriting from them.
