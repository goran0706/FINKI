/* 64-bit floating point format */

const n1 = 12345; // primitive type -> 12345
const n3 = Number(12345); // primitive type -> 12345
const n2 = Number("12345"); // primitive type -> 12345, the Number constructor function is used for explicit conversion
const n4 = new Number(12345); // reference type -> [Number: 12345]
console.log(n1, n2, n3, n4);

/* decimals and exponential */
const f1 = 10.5;
const f2 = 100.99;
const f3 = 1e4;
console.log(f1, f2, f3);

/* separator - ignored by the parser */
const SSN = 1234_5678_9012_3456;
console.log(SSN);

/* Precision with BigNumber */
const largeNumber = Number(1 + "0".repeat(30));
const bn = BigInt(largeNumber); /* convert number or string into BigNumber */
const bnLiteral = 1 + "0".repeat(30) + "n";
console.log(bn);
console.log(bnLiteral);
