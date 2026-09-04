/*
  Document Object Model - DOM

  The document is the Root DOM node. Provides access to element querying, DOM content etc. Exposes Web API to allow JavaScript to work with the parsed document.
  window is the active Browser Window/tab. Acts as global storage for scripts, also provides access to window-specific properties and methods.
  The DOM exposes Web API to allow JavaScript to work with the parsed document (HTML).
  The HTML get parsed and rendered by the browser. The DOM is created allowing JavaScript to interact with the HTML.

  Node vs Element (generic name for any type of object in the DOM / one specific type of node)

  NodeCollection vs NodeList

  - An HTMLCollection is pretty simple to understand since it can only contain elements.
  These collections are very similar to arrays so you may not even realize you are working with an HTMLCollection, but one thing HTMLCollections lack that arrays
  have are all the higher order functions. Things like forEach, map, and reduce are not available on an HTMLCollection.

  - A NodeList on the other hand can contain any type of node including elements.
  NodeLists are also similar to arrays, but they again lack most higher order functions. The only higher order function on a NodeList is the forEach function.

  Live vs Static Node
  - NodeList takes a Snapshot of the DOM elements - the snapshot is not a live list, does not include the most recent addition.
  - NodeCollection is not a snapshot so always returns a live list. Similar to all get{something} selectors.

  REMEMBER to CACHE selectors in variables so that the browser does not have to look up the DOM every time
*/
console.log(this);
console.log(window);
console.log(document);

// Querying elements
var html = document.documentElement;
var head = document.head;
var body = document.body;

// Selecting elements in the DOM
var formEl = document.querySelector("form");
var usernameEl = document.querySelector("#username");
var passwordEl = document.getElementById("password");
var resetBtn = document.querySelector('[type="reset"]');
var submitBtn = document.querySelector('[type="submit"]');

// Selecting multiple elements in the DOM
var inputList = document.querySelectorAll("input");
var inputCollection = document.getElementsByTagName("input");

inputList.forEach((input) => console.log(input));
// inputCollection.forEach((input) => console.log(input)); // forEach not available on NodeCollection

for (const input of inputCollection) {
  console.log(input);
}

// Getting and setting DOM properties (Elements attributes)
usernameEl.setAttribute("placeholder", "Enter your username");
passwordEl.setAttribute("placeholder", "Enter your password");
console.log(usernameEl.getAttribute("placeholder"));
console.log(passwordEl.getAttribute("placeholder"));

// Traversing the DOM (Child, Parent, Ancestor, Descendant)
console.log("Check if form has child node:", formEl.hasChildNodes());
console.log("Form has the following nodes:", formEl.childNodes);
console.log(`Form has ${formEl.childElementCount} elements count`);
console.log("Form children", formEl.children);
console.log("Form first child", formEl.firstChild);
console.log("Form first element child", formEl.firstElementChild);
console.log("Form last child", formEl.lastChild);
console.log("Form last element child", formEl.lastElementChild);
console.log("Form parent node", formEl.parentNode);
console.log("Form parent element", formEl.parentElement);
console.log("Form parent offset", formEl.offsetParent);
//...

// Creating DOM elements
var signInText = document.createElement("h1");
signInText.textContent = "Sign In";
signInText.style.color = "blue";

var registerText = document.createElement("h1");
registerText.textContent = "Register";
registerText.style.color = "red";

var extraButton = document.createElement("button");
extraButton.textContent = "Extra";

var warningPlaceholder = document.createElement("div");
warningPlaceholder.innerHTML = `
  <p>Please be aware that this is just a demo form, do not enter real data.</p>
`;

// Inserting DOM elements
formEl.before(signInText); // before the form
formEl.after(signInText); // after the form
formEl.prepend(signInText); // inside form as first element
formEl.append(signInText); // after the form as last child
formEl.appendChild(signInText); // inside form as last child
formEl.insertAdjacentElement("beforeBegin", signInText); // 'beforeBegin', 'afterBegin', 'beforeEnd', or 'afterEnd'.
formEl.insertAdjacentElement("beforeEnd", extraButton); // 'beforeBegin', 'afterBegin', 'beforeEnd', or 'afterEnd'.
formEl.after(warningPlaceholder);

// Replacing DOM elements
signInText.replaceWith(registerText);
formEl.parentElement.replaceChild(signInText, registerText);

// Removing DOM elements
formEl.removeChild(extraButton);
extraButton.remove();

// Cloning DOM Nodes
var submitBtnClone = submitBtn.cloneNode(true);
formEl.insertAdjacentElement("beforeend", submitBtnClone);

// Styling elements
submitBtn.style.color = "#FFF";
submitBtn.style.backgroundColor = "#772CE8";
submitBtn.style.borderRadius = "6px";
submitBtn.style.border = "none";
submitBtn.style.outline = "none";
submitBtn.style.padding = "10px";
submitBtn.style.margin = "10px 4px 10px 4px";
submitBtn.style.transition = "all 0.3s linear";
submitBtn.style.cursor = "pointer";
submitBtn.addEventListener(
  "mouseenter",
  (e) => (e.target.style.backgroundColor = "purple")
);
submitBtn.addEventListener(
  "mouseleave",
  (e) => (e.target.style.backgroundColor = "#772CE8")
);

// Getting elements dimensions and position
console.log(submitBtn.getBoundingClientRect());

// TODO:
// Positioning elements
// Handling scrolling

// Working with template tags
var tooltipTemplate = document.querySelector("#tooltip");
var tooltipBody = document.importNode(tooltipTemplate.content, true);
tooltipBody.querySelector("p").textContent = "Tooltip text is set";
document.body.appendChild(tooltipBody);

// Working with datasets (storing extra info or data to DOM node instead in JavaScript)
var div = document.createElement("div");
div.setAttribute(
  "data-extra-info",
  "This div element should be removed from the DOM"
);
document.body.appendChild(div);
console.log("Print the extra data stored in the DOM element", div.dataset);

// Working with location
console.log("Location", window.location);

// Working with history object
console.log("History", window.history);

// Working with navigator object
console.log("Navigator", window.navigator);

// Working with userAgent string to detect browsers
console.log("userAgent", window.navigator.userAgent);

/*
  Loading Scripts Dynamically
*/
async function add(a, b) {
  var { add } = await import("./lib.js");
  return add(a, b);
}

add(100, 500).then((res) => console.log("res", res));

/*
  Events
*/
var submitHandler = (e) => {
  e.preventDefault();
  alert("Form submitted");
};

// Adding event listeners
formEl.addEventListener("submit", submitHandler);

// Removing event listeners
formEl.removeEventListener("submit", submitHandler);

// Preventing the default behavior
var submitHandler = (e) => {
  e.preventDefault();
  alert("Form submitted");
};
formEl.addEventListener("submit", submitHandler);

// Event propagation (Capturing, Bubbling and Target phase)
// - Capturing phase (root -> target) -> checks for any event handlers registered on the ancestors before reaching the target element
// - Bubbling phase (target -> root) -> checks for any event handlers registered on the target element before moving up the DOM
// - Target phase -> when the actual click listener is executed
formEl.addEventListener("click", () => console.log("Form clicked"));

resetBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  // e.stopImmediatePropagation();
  console.log("Reset clicked");
});

class Form {
  handleEvent(event) {
    switch (event.type) {
      case "mousedown":
        element.innerHtml = "Mouse Button Pressed";
        break;
      case "mouseup":
        element.innerHtml = "Mouse Button Released";
        break;
    }
  }
}
var form = new Form();
formEl.addEventListener("click", form);

/* 
  Event delegation

  Benefits:
  1. Simplifies initialization and saves memory no need to add many event handlers
  2. Less code

  Limitations:
  1. Events must be bubbling... some events do not bubble
  2. Low level handlers should not use event.stopPropagation()
  3. Delegation might add CPU load (which is negligible)

*/
var fruits = ["🍎", "🍌", "🥝", "🍎", "🍌", "🥝", "🍎", "🍌", "🥝"];
var fruitList = document.createElement("ul");

fruits.forEach((fruit) => {
  var li = document.createElement("li");
  li.textContent = fruit;
  fruitList.appendChild(li);
});

// The addEventListener uses starts listening from the bubbling phase by default, passing true as option will invoke listeners during the capturing phase.
fruitList.addEventListener("click", (e) => e.target.remove());
document.body.appendChild(fruitList);

function highlightTdDelegation() {
  let table = document.querySelector("table");
  let selectedTd;

  table.addEventListener("click", function (event) {
    let td = event.target.closest(); // (1)
    if (!td) return; // (2)
    if (!table.contains(td)) return; // (3)

    if (selectedTd) selectedTd.classList.remove("highlight");
    selectedTd = target;
    selectedTd.classList.add("highlight"); // (4)
  });
}

highlightTdDelegation();

/*
  Setting timers and intervals
*/
var count = 0;

var timeoutID = setTimeout(() => console.log("count is", count), 2000);

var intervalID = setInterval(() => {
  if (count >= 1) clearInterval(intervalID);
  console.log("count is", count);
  count++;
}, 1000);

/* 
  Text Encoder and Text Decoder
*/
var encoder = new TextEncoder();
var uint8Array = encoder.encode("Hello World!"); // utf-8
console.log(uint8Array);

var decoder = new TextDecoder();
var uint8Array = decoder.decode(uint8Array); // utf-8
console.log(uint8Array);

/* 
  Blob

  new Blob(['Blob Content'], {type: Blob property containing MIME property})
  Pros:
  1. Good option for adding large binary data files to a database, and can be easily referenced
  2. Easy to set access rights using the rights management while using blob
  3. Database backups of blobs contains all the data

  Cons:
  1. Not all databases permit the use of blobs
  2. Inefficient due to the amount of disk space required and access time
  3. Creating backups is time consuming due to the size of the blobs
*/

// Create and read from a blob
var blob = new Blob(["JavaScript Tutorials"], { type: "text/plain" });
var reader = new FileReader();
reader.addEventListener("loadend", (e) => console.log(e.srcElement.result));
reader.readAsText(blob);

// Read as Buffer
var blob = new Blob(["JavaScript Tutorials"], { type: "text/plain" });
var reader = new FileReader();
reader.addEventListener("onload", (event) => console.log(reader.result));
reader.readAsArrayBuffer(blob);

// Download a file
var blob = new Blob(["Download JavaScript Tutorials"], { type: "text/plain" });
var link = document.querySelector("#download");
link.href = URL.createObjectURL(blob);

/* 
  File and FileReader

  It extends from the Blob and is extended with file system capabilities

  new FIle(fileparts, filename, [options]);
*/
function showFile(input) {
  var file = input.files[0];
  console.log(file.name);
  console.log(file.lastModified);
}

function readFile(input) {
  let file = input.files[0];
  let reader = new FileReader();
  reader.readAsText(file);
  reader.onload = () => console.log(reader.result);
  reader.onerror = () => console.log(reader.error);
}

/* 
  Frames and Windows

  TODO:

*/

/* 
  Forms
*/
var form = document.forms[0];
var username = form.elements.username;
var password = form.elements.password;
var form = username.form; // HTMLElement back referencing the form
console.log(form.elements.username == form.username);

form.addEventListener("focusin", () => form.classList.add("focused"), true);
form.addEventListener("focusout", () => form.classList.remove("focused"), true);
form.addEventListener("submit", () => console.log("form submitted"));
form.onsubmit = () => console.log("form submitted");

// Select and Options
var select = document.querySelector("select");
select.options[2].selected = true;
select.selectedIndex = 2;
select.value;

var option = new Option("text", "value", true, true);

// Multiple select (remember to add multiple attribute)
select.setAttribute("multiple", "");
var selected = Array.from(select.options)
  .filter((option) => option.selected)
  .map((option) => option.value);

// Inputs
var form = document.forms[0];
var username = form.elements.username;

username.onblur = function () {
  if (username.value.length < 6) {
    username.classList.add("error");
    username.focus();
  } else {
    username.classList.remove("error");
  }
};

username.onblur = function () {
  if (username.value.length < 6) {
    username.classList.add("error");
    error.innerHtml = "Username must be 6 or more characters";
  }
};

username.onfocus = function () {
  if (username.classList.contains("invalid")) {
    username.classList.remove("error");
    error.innerHtml = "";
  }
};

username.onpaste = function (event) {
  console.log("paste", event.clipboardData.getData("text/plain"));
  // event.preventDefault();
};

username.oncut = username.oncopy = function (event) {
  console.log(event.type, document.getSelection());
  // event.preventDefault();
};
