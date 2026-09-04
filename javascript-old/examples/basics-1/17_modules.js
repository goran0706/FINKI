// ES6 exports
export const count = 10;
export function foo() {}
export class Count {}
export default function sayHi() {}

// ES6 imports
import test from "./test"; // default import

// Import and Export with renaming
export { count as counter };

// Re-exports
export { test };

// Dynamic imports
function bar() {
  import("./test").then((test) => test());
}

bar();

// Quick and Dirty modules for the web

// this creates a Counter property on the global object
var Counter = (function Counter(initial = 0) {
  let value = initial;

  const count = () => value++;
  const increment = () => value++;
  const decrement = () => value--;
  const reset = () => (value = initial);

  return {
    count,
    increment,
    decrement,
    reset,
  };
})();
