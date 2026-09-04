// Function Declaration
function printSummary(summary) {
  console.log(summary);
}

// Named Function Expression
const printSummaryNamed = function namedFunctionExpression(summary) {
  console.log(summary);
};

// Anonymous Function Expression
const printSummaryAnonymous = function (summary) {
  console.log(summary);
};

// Arrow Function
const printSummaryArrow = (summary) => console.log(summary);

printSummary("function declaration/named function");
printSummaryNamed("function expression/named function");
printSummaryAnonymous("function expression/anonymous function");
printSummaryArrow("function expression/arrow function");
