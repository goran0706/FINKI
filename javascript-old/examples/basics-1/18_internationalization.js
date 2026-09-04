function toEuros(amount) {
  const formatter = Intl.NumberFormat("en", {
    style: "currency",
    currency: "EUR",
  });
  return formatter.format(amount);
}

console.log(toEuros(10));

let data = [0.05, 0.75, 1];
let formatData = Intl.NumberFormat(undefined, {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
}).format;
console.log(data.map(formatData));

const obj = { a: 1 };
console.log(Object.getOwnPropertyDescriptor(obj, "a"));
console.log(Reflect.getOwnPropertyDescriptor(obj, "a"));
console.log(Reflect.isExtensible(obj));
Reflect.preventExtensions(obj);
console.log(Reflect.isExtensible(obj));
