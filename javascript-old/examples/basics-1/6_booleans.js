const isLoading = true;

if (isLoading) {
  console.log("Loading...");
} else {
  console.log("DONE");
}

function checkLoading() {
  return isLoading ? "Loading..." : "DONE";
}

const hasArrived = false;
hasArrived ? console.log("HERE") : console.log("NOT YET");

if (isLoading && hasArrived) console.log("loading AND not yet arrived");
if (isLoading || hasArrived) console.log("loading OR not yet");
if (!isLoading) console.log("DONE");

const condition = isLoading || hasArrived;

const nullish1 = 0;
const nullish2 = -0;
const nullish3 = "";
const nullish4 = false;
const nullish5 = null;
const nullish6 = undefined;
console.log(nullish1 ?? "NOT nullish");
console.log(nullish2 ?? "NOT nullish");
console.log(nullish3 ?? "NOT nullish");
console.log(nullish4 ?? "NOT nullish");
console.log(nullish5 ?? "nullish"); // null
console.log(nullish6 ?? "nullish"); // undefined

/* Falsy and Truthy values */
// false, 0, -0, null, undefined, ''
