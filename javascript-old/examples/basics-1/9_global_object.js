/* 
  Global Object 

  'window' - in Web browsers
  'global' - in Node
  'self' - in Worker threads
  'globalThis' - as generic for any environment
*/

console.log(this); // web and node
console.log(self); // worker thread
console.log(window); // web browsers
console.log(global); // node environment
console.log(globalThis); // generic usage
