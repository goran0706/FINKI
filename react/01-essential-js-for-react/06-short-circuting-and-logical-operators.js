const isEvaluated = "isEvaluated";
const isUndefinedOrNull = "isUndefinedOrNull";

console.log(true && isEvaluated); // isEvaluated
console.log(false && isEvaluated); // false

// falsy: 0, '', null, undefined
console.log("jonas" && isEvaluated); // isEvaluated
console.log(0 && isEvaluated); // 0

console.log(true || isEvaluated); // true
console.log(false || isEvaluated); // isEvaluated

// nullish coalesce (more strict than falsy values, checks only if the value is undefined or null)
console.log(0 ?? isUndefinedOrNull); // 0
console.log("" ?? isUndefinedOrNull); // ''
console.log(undefined ?? isUndefinedOrNull); // isUndefinedOrNull
console.log(null ?? isUndefinedOrNull); // isUndefinedOrNull

// default values
const count = 10;
const pages = count || "Unknown number of pages";
