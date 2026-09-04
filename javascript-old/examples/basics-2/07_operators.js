/*
  Operators

  Arithmetic Operators
  Assignment Operators
  Comparison Operators
  Logical Operators
  Short-Circuit Operators
  Bitwise Operators
  Unary Operators
  String Operators
  Type Operators
*/

{
  // Arithmetic Operators
  let num1 = 1;
  let num2 = 1;
  let result;
  result = num1 + num2;
  result = num1 - num2;
  result = num1 * num2;
  result = num1 / num2;
  result = num1 ** num2;
  result = num1 % num2;
}

{
  // Assignment Operators
  let num1 = 1;
  let num2 = 1;
  let result;
  result += num1;
  result -= num1;
  result *= num1;
  result /= num1;
  result **= num1;
  result %= num1;
}

{
  // Comparison Operators
  let num1 = 1;
  let num2 = 1;
  let result;
  result = num1 > num2;
  result = num1 < num2;
  result = num1 >= num2;
  result = num1 <= num2;
  result = num1 == num2;
  result = num1 === num2;
  result = num1 != num2;
  result = num1 !== num2;
  result = result ? num1 : num2;
}

{
  // Logical Operators
  let num1 = 1;
  let num2 = 1;
  let result;
  if (num1 && num2) console.log();
  if (num1 || num2) console.log();
  if (!num1) console.log();
  let arr = [];
  let hasItems = !!arr.length; // 0, undefined, null = false, anything else = true
  if (hasItems) console.log(hasItems);
  console.log(!true); // false
  console.log(!false); // true
  console.log(!!true); // true
  console.log(!!false); // false
  console.log(!!""); // false
  console.log(!!"John"); // true
}

{
  // Short-Circuit Operators
  let num1 = 1;
  let num2 = 1;
  let result;
  result = num1 && num2; // num2
  result = num1 || num2; // num1
  result = num1 ?? num2; // num1
}

{
  // Unary Operators
  let num1 = 1;
  let num2 = 1;
  let result;
  result++;
  result--;
  ++result;
  --result;
  result = -num1;
  result = -num1 + -num2;
}

{
  // String Operators
  let num1 = 1;
  let num2 = 1;
  let result;
  result = "abc" + "def" + "g";
  result = "1" + "1";
}

{
  // Type Operators
  let num1 = 1;
  let num2 = 1;
  let result;
  result = typeof num1;
  result = num1 instanceof Number;
}

{
  // Spread Operators
  let obj = { a: 1, b: 2 };
  let obj2 = { ...obj };

  let arr = [1, 2, 3, 4, 5];
  let arr2 = [6, 7, 8, 9, 10];
  let arr3 = [...arr, ...arr2];
}

{
  // Rest Operator
  function foo(...args) {}

  let obj = { a: 1, b: 2, c: 3 };
  let { a, ...props } = obj;

  let arr = [1, 2, 3, 4, 5];
  let [first, second, ...numbers] = arr;
}
