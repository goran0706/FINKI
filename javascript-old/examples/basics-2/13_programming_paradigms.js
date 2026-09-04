/* 
  Procedural Paradigm
*/
function handleFormSubmit(e) {
  e.preventDefault();
  var username = document.querySelector("#username").value;
  var password = document.querySelector("#password").value;

  if (username.length > 0 && password.length > 3) {
    alert(`Hello ${username}`);
  } else {
    alert("Error: Please enter required fields");
  }
}

var form = document.querySelector("form");
// form.addEventListener("submit", handleFormSubmit);

/* 
  OOP Paradigm
*/
class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }
}

class Validator {
  static REQUIRED = 1;
  static MIN_LENGTH = 3;
  static validate(username, password) {
    if (username.length < this.REQUIRED || password.length < this.MIN_LENGTH) {
      return false;
    } else {
      return true;
    }
  }
}

class SignInForm {
  constructor() {
    this.form = document.querySelector("form");
    this.username = document.querySelector("#username");
    this.password = document.querySelector("#password");
    this.form.addEventListener("submit", this.submitListener);
  }

  submitListener(e) {
    e.preventDefault();

    var { username, password } = new User(
      this.username.value,
      this.password.value
    );

    var isValid = Validator.validate(username, password);

    if (isValid) {
      alert(`Hello ${username}`);
    } else {
      alert(`Please enter all the required fields`);
    }
  }
}

var form = new SignInForm();

/* 
  Functional Paradigm

  The Pillar of Functional Programming - Pure Functions

  Benefits:
  - Clear + Understandable
  - Easy to extend
  - Easy to maintain
  - Memory efficient
  - DRY
*/

// compose
var compose = (f, g) => (data) => f(g(data));
var pipe = (f, g) => (data) => g(f(data));

function validate(username, password) {
  var REQUIRED = 1;
  var MIN_LENGTH = 3;
  return username.length > REQUIRED && password.length > MIN_LENGTH;
}

function successHandler(username) {
  alert(`Hello ${username}`);
}

function errorHandler() {
  alert(`Please enter all the required fields`);
}

function submitHandler(e) {
  e.preventDefault();
  var username = getInputValue("#username");
  var password = getInputValue("#password");
  var isValid = validate(username, password);
  isValid ? successHandler(username) : errorHandler();
}

function getForm(formId, formSubmitHandler) {
  var form = document.querySelector(formId);
  form.addEventListener("submit", formSubmitHandler);
}

function getInputValue(input) {
  var element = document.querySelector(input);
  return element.value;
}

getForm("form", submitHandler);

// Another functional programming example
// Implement a cart feature:
// 1. Add items to cart
// 2. Add 5% tax to item in cart
// 3. Buy item: cart -> purchase
// 4. Empty cart
// 5. Accept refunds
// 6. Track history
var user = {
  name: "John",
  active: true,
  cart: [],
  purchases: [],
};

var storeHistory = [];

var compose =
  (f, g) =>
  (...args) =>
    f(g(...args));

var pipe =
  (f, g) =>
  (...args) =>
    g(f(...args));

purchaseItem(
  addItemToCart,
  applyTaxToItem,
  buyItem,
  emptyCart
)(user, { name: "laptop", price: 200 }); // using compose

// function purchaseItem(user, item) {
//   return { ...user, purchases: user.purchases.push(item) }; // too simplistic
// }

function purchaseItem(...fns) {
  storeHistory.push(user); /// sometimes we have to do side effects, the idea of FP is to minimize side effects
  return fns.reduce(pipe);
}

function addItemToCart(user, item) {
  storeHistory.push(user);
  const updatedCart = user.cart.concat(item);
  return { ...user, cart: updatedCart };
}

function applyTaxToItem(user) {
  storeHistory.push(user);
  const { cart } = user;
  const taxRate = 5;
  const updatedCart = cart.map((item) => {
    return {
      name: item.name,
      price: item.price * taxRate,
    };
  });
  return { ...user, cart: updatedCart };
}

function buyItem(user) {
  storeHistory.push(user);
  return { ...user, purchases: user.cart };
}

function emptyCart(user) {
  storeHistory.push(user);
  return { ...user, cart: [] };
}

function refundItem(user) {
  storeHistory.push(user);
}
