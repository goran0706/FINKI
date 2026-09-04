{
  /* Concatenate two arrays, and operate on them */
  const arr1 = [0, 1, 2, 3, 4];
  const arr2 = [5, 6, 7, 8, 9];

  // 1)
  const merged1 = arr1.concat(arr2);
  const merged2 = [...arr1, ...arr2]; // ES6 spread operator

  // 2)
  mergeArrays = (...args) => args.reduce((acc, el) => acc.concat(el), []);
  const merged3 = mergeArrays([1, 2, 3], [4, 5, 6], [7, 8, 9]);
}

{
  /* Remove duplicate elements using two methods */
  const duplicates = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 5, 6, 6, 6, 7, 7, 8, 8, 8];

  // 1) using a Set to automatically remove duplicates
  const set = new Set(duplicates);

  // 2) using reduce method that returns the new array or empty
  const deduplicate = (arr) =>
    arr.reduce((acc, el) => (!acc.includes(el) ? [...acc, el] : acc), []); // make sure to return accumulator
}

{
  /* Check the entire array and find the matching element */
  const fruits = ['Apple', 'Peach', 'Banana', 'Banana'];
  console.log(fruits.indexOf('Peach'));
  console.log(fruits.lastIndexOf('Banana'));
  console.log(fruits.find((el) => el === 'Banana'));
  console.log(fruits.findIndex((el) => el === 'Banana'));
  console.log(fruits.filter((el) => el === 'Banana'));
  console.log(fruits.every((el) => el === 'Banana'));
  console.log(fruits.some((el) => el === 'Banana'));
  console.log(fruits.includes('Banana'));
}

{
  /* How to remove and replace designated element and retrieve an array segment */
  const fruits = ['Apple', 'Peach', 'Banana', 'Banana'];
  fruits.splice(fruits.lastIndexOf('Banana'), 1, 'Kiwi', 'Kiwi'); // start_index, delete_count, replacement1,2,3...
  console.log(fruits);
}

{
  /* How to find the max and min element and how to reorganize array elements */
  const numbers = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];

  // 1) Using Math object
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);

  // 2) Using reduce method
  const minR = numbers.reduce((acc, el) => (acc < el ? acc : el), numbers[0]);
  const maxR = numbers.reduce((acc, el) => (acc > el ? acc : el), numbers[0]);
}

{
  /* Array with holes */
  const numbers = [1, 2, , 4, 5];

  numbers.forEach((num) => console.log(num)); // does not print undefined, it skips it

  for (const num of numbers) {
    console.log(num); // for it prints undefined, does not skip it
  }
}

{
  /* Calculating word count using the split method */

  const str = 'Hello World!';

  const strCount = str.split(' ').length;
  console.log(strCount);
}

{
  /* Extract a section of a string */

  const str = 'Hello World!';

  const firstWord = str.substring(0, str.indexOf(' '));
  console.log(firstWord);
}

{
  /* Replace a section of a string */

  const str = 'Hello World!';

  const replaced = str.replace('World', 'John');
  console.log(replaced);
}

{
  /* 
  Compare null, undefined and NAN 

  null is a primitive value of type object
  undefined is a primitive value of type undefined
  NAN is a global constant of type number that represents not a number

  null represents empty or nothing
  undefined represents unassigned value
  NAN represents a not a number, a global constant

  null == undefined // true because both are falsy values
  null === undefined // false because object is not equal to undefined
*/
}

{
  /* Create a function to check types */

  function check(source) {
    const phrase = 'Data type: ';
    if (source === 'null') {
      return phrase + 'null';
    } else {
      if (typeof source === 'function') {
        return phrase + 'function';
      } else if (typeof source === 'object') {
        if (source instanceof Array) {
          return phrase + 'array';
        }
        if (source instanceof Map) {
          return phrase + 'map';
        }
        if (source instanceof Set) {
          return phrase + 'set';
        }
      } else {
        return source;
      }
    }
  }
}

{
  /* Mapping users to get usernames */

  // 1. Write code to get array of names from given array of users
  // 2. Get back only active users
  // 3. Sort users by age descending
  const users = [
    {
      id: 1,
      name: 'Jack',
      isActive: true,
      age: 20,
    },
    {
      id: 2,
      name: 'John',
      isActive: true,
      age: 18,
    },
    {
      id: 3,
      name: 'Mike',
      isActive: false,
      age: 30,
    },
  ];

  const usernames = users
    .filter((u) => u.isActive)
    .map((u) => u.name)
    .sort((a, b) => a + b);
  console.log('usernames', usernames);
}

{
  // What will be logged in first example and in second example?
  let var1;
  console.log(var1); // undefined
  console.log(typeof var1); // undefined

  let var2 = null;
  console.log(var2); // null
  console.log(typeof var2); // object
}

{
  /* Hoisting */
  // What will be console.logged here

  // Question 1
  console.log(foo); // undefined
  foo = 1;

  // question 2
  console.log(foo); // 1
  var foo = 2;

  // question 3
  foo = 3;
  console.log(foo); // 3
  var foo;
}

{
  /* Create a counter function which has increment and getValue functionality */
  function counter(initValue = 0) {
    let count = initValue;
    return {
      increment: () => count++,
      decrement: () => count--,
      getValue: () => count,
      reset: (value) => (count = value),
    };
  }
}

{
  // Write a function which helps to achieve multiply(a)(b) and returns product of a and b
  // Create a curry function
  // What can your curried function do?
  const multiply = (a, b) => a * b;
  const curried = (a) => (b) => a * b;
  const result = curried(10)(10);
}

{
  // Write a function which get's an array and an element and returns a array with this element at the end
  const addToArray = (arr, el) => arr.push(el);
  const appendArray = (arr, el) => [...arr, el];
  const prependArray = (arr, el) => [el, ...arr];
}

{
  // Write a function which can concatenate 2 arrays
  const merge = (arr1, arr2) => [...arr1, ...arr2];
  const merge2 = (arr1, arr2) => arr1.concat(arr2);
}

{
  // Check that user with such name exists in array of objects

  const users = [
    {
      id: 1,
      name: 'Jack',
      isActive: true,
    },
    {
      id: 2,
      name: 'John',
      isActive: true,
    },
    {
      id: 3,
      name: 'Mike',
      isActive: false,
    },
  ];

  const isIncluded = (arr, name) => arr.some((el) => (el.name = name));

  const isIncluded1 = (arr, name) => {
    const index = arr.findIndex((el) => el.name === name);
    return index > 0;
  };

  const isIncluded2 = (arr, name) => {
    const el = arr.find((el) => el.name === name);
    return Boolean(el);
  };

  console.log(isIncluded(users, 'John'));
}

{
  // Remove all duplicates in the array

  const uniqueArr1 = (arr) => [...new Set(arr)];

  const uniqueArr2 = (arr) => {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      result.push(el);
    }
    return result;
  };

  const uniqueArr3 = (arr) =>
    arr.reduce((acc, el) => (!acc.includes(el) ? [...acc, el] : []), []);
}

{
  // Write a function which implements a range

  const range = (start, end) => {
    for (start; start < end; start++) {
      console.log(start);
    }
  };

  const rangeRecursive = (start, end) => {
    if (start >= end) return;
    console.log(start);
    return range(start + 1, end);
  };

  range(1, 50);
  rangeRecursive(1, 50);
}

{
  // Write a function which implements shuffle

  // 1) generate random index
  // 2) create temporal object
  // 3) sort by index
  // 4) extract the value only
  const shuffleItems = (items) =>
    items
      .map((item) => ({ sort: Math.random(), value: item }))
      .sort((a, b) => a - b)
      .map((a) => a.value);
}

{
  // Find the numbers of occurrences of minimum value in the list

  const list = [1, 1, 2, 3, 4, 5, 6, 4, 3, 2, 1, 2, 3, 1, 1, 1];

  // 1)
  const minValue = Math.min(...list);
  const count = list.filter((el) => el === minValue);

  // 2)
  const result = list.reduce(
    (acc, el) => {
      if (acc.min > el) acc.min = el;
      if (acc.min === el) acc.count++;
      return acc;
    },
    { min: list[0], count: 0 }
  );
}

{
  // Design a class for employee which takes id and name in during construction of object and has a salary property

  class Employee {
    constructor(id, name) {
      if (!id || !name) throw new Error('Id and name are mandatory');
      this.id = id;
      this.name = name;
    }

    get id() {
      return this.id;
    }

    get name() {
      return this.name;
    }

    get salary() {
      return this.salary;
    }

    set salary(newSalary) {
      if (newSalary < 0) throw new Error('Must be a positive number');
      this.salary = newSalary;
    }
  }

  class Manager extends Employee {
    constructor(id, name, department) {
      super(id, name);
      this.department = department;
    }

    get department() {
      return this.department;
    }
  }
}

{
  // Design the same class by using JavaScript Prototypes
  function Employee(id, name, salary) {
    this.id = id;
    this.name = name;
  }

  Employee.prototype.getId = function () {
    return this.id;
  };

  Employee.prototype.getName = function () {
    return this.name;
  };

  Employee.prototype.getSalary = function () {
    return this.salary;
  };

  Employee.prototype.setSalary = function (newSalary) {
    if (newSalary < 0) throw new Error('Must be a positive number');
    this.salary = newSalary;
  };

  function Manager() {
    Employee.apply(this, arguments); // call super constructor.
  }

  // subclass extends superclass
  Manager.prototype = Object.create(Employee.prototype);
  Manager.prototype.constructor = Manager;

  Manager.prototype.getDepartment = function () {
    return this.department;
  };

  Manager.prototype.setDepartment = function (department) {
    this.department = department;
  };

  const manager = new Manager(1, 'John');
  console.log(manager);
}

{
  // Create an ES6 module with function getName, getSurname and default export getFullName
  // export const getName = (name) => name;
  // export const getSurname = (surname) => surname;
  // export default (name, surname) => `${name} ${surname}`;
  // import * as obj from 'something.js';
  // import getFullName, { getName, getSurname } from 'something.js';
  // module.exports.getName = (name) => name;
  // module.exports.getSurname = (surname) => surname;
  // module.exports.default = (name, surname) => `${name} ${surname}`;
  // const obj = require('something.js');
}

{
  /* 
    Debouncing & Throttling in JavaScript

    Summary:

    Debouncing is a technique where we can monitor the time delay of user action and once that delay reaches our predetermined threshold 
    we can can make the function call.
    Throttling is a technique where we make the function call in a predetermined time interval irrespective of continuous user actions.
    Even though both debouncing and throttling seems like similar, both have their own use-cases. It’s not recommended to use throttling logic
    in search bar and we we cannot use debouncing in shooting game scenario or browser resizing or onScroll events.

    - Debounce is most suitable for control events like typing or button clicks.
    - Throttle is most suitable for continuous user events like resizing and scrolling.
  */

  function debounce(callback, delay = 1000) {
    var time;

    return (...args) => {
      clearTimeout(time);
      time = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  }

  function throttle(callback, delay = 1000) {
    let shouldWait = false;

    return (...args) => {
      if (shouldWait) return;

      callback(...args);
      shouldWait = true;
      setTimeout(() => {
        shouldWait = false;
      }, delay);
    };
  }
}

{
  /* DOM */
  // Highlight all words over 8 charts with yellow
  // Add a link
  // Remove a link
  // Split each sentence into a new line
  // browser Event delegation example
}

{
  /* Asynchronous JavaScript */

  // XML HTTP Request
  const xhr = XMLHttpRequest();
  xhr.open('GET', 'https://jsonplaceholder.typicode.com/users');
  xhr.send();

  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log('Success', xhr.response);
    } else {
      console.log('Error', xhr.status + xhr.statusText);
    }
  };

  xhr.onerror = function () {
    console.log('xhr request failed');
  };

  // fetch API
  fetch('https://jsonplaceholder.typicode.com/users').then((res) =>
    res
      .json()
      .then((data) => console.log(data))
      .catch((e) => console.log(e))
  );

  // Basic callback
  const asyncFunc = (callback) =>
    setTimeout(() => {
      callback();
    }, 2000);

  // Parallel Async Array
  const asyncParallel = (asyncFuncs, callback) => {
    const resultArr = new Array(asyncFuncs.length);
    let resultCounter = 0;

    asyncFuncs.forEach((asyncFunc, index) => {
      asyncFunc((value) => {
        resultArr[index] = value;
        resultCounter++;
        if (resultCounter >= asyncFuncs.length) {
          callback(resultArr);
        }
      });
    });
  };

  // Convert callback to promise
  const asyncCallback = (callback) =>
    new Promise((resolve, reject) => {
      callback((value) => {
        resolve(value);
      });
    });

  // Map data in promises
  const asyncMap = (asyncFuncs, callback) => {
    const resultArr = new Array(asyncFuncs.length);
    let resultCounter = 0;

    asyncFuncs.forEach((asyncFunc, index) => {
      asyncFunc((value) => {
        resultArr[index] = value;
        resultCounter++;
        if (resultCounter >= asyncFuncs.length) {
          callback(resultArr);
        }
      });
    });
  };

  // Rewrite mapping data in async await
  const asyncMapAsync = (asyncFuncs, callback) => {
    const resultArr = new Array(asyncFuncs.length);
    let resultCounter = 0;

    asyncFuncs.forEach((asyncFunc, index) => {
      asyncFunc((value) => {
        resultArr[index] = value;
        resultCounter++;
        if (resultCounter >= asyncFuncs.length) {
          callback(resultArr);
        }
      });
    });
  };

  // Map data in async await
  const asyncMapAsync2 = (asyncFuncs, callback) => {
    const resultArr = new Array(asyncFuncs.length);
    let resultCounter = 0;

    asyncFuncs.forEach((asyncFunc, index) => {
      asyncFunc((value) => {
        resultArr[index] = value;
        resultCounter++;
        if (resultCounter >= asyncFuncs.length) {
          callback(resultArr);
        }
      });
    });
  };

  // Design request manager
  const requestManager = (url, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = function () {
      if (xhr.status === 200) {
        callback(xhr.response);
      } else {
        console.log('Error', xhr.status + xhr.statusText);
      }
    };

    xhr.onerror = function () {
      console.log('xhr request failed');
    };

    xhr.send();
  };
}

{
  /* Comparison */
  // Shallow Comparison
  // Deep Comparison

  // Create memoization function

  const memo = () => {
    let cache = {};
    return (value) => {
      if (value in cache) return cache[value];
      const result = value + 10;
      cache[value] = result;
      return result;
    };
  };
}

{
  /* Fibonacci */
  const fibonacci = (n) => {
    if (n < 2) return 1;
    return fibonacci(n - 2) + fibonacci(n - 1);
  };
}

{
  /* Palindrome */
  const isPalindrome = (str) => str.split('').reverse.join('');
}

{
  /* Anagram */
  const isAnagram = (str1, str2) => {
    if (str1.length !== str2.length) return false;

    const lowerStr1 = str1.toLowerCase();
    const lowerStr2 = str2.toLowerCase();

    if (lowerStr1 === lowerStr2) return false;

    const sortedStr1 = lowerStr1.split('').sort().join('');
    const sortedStr2 = lowerStr1.split('').sort().join('');

    return sortedStr1 === sortedStr2;
  };
}

{
  /* Finding vowels */
  const findVowels = (str) => {
    const vowels = ['a', 'e', 'o', 'i', 'u'];

    return str
      .toLowerCase()
      .split('')
      .reduce((acc, char) => (vowels.includes(char) ? acc + 1 : acc), 0);
  };
}

{
  /* Convert to Title Case */
  const titleCase = (str) =>
    str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}

{
  /* Convert the Time Input Given in 12 Hours Format to 24 */
  const convertTo24HoursFormat = (timeText) => {
    const timeTextLower = timeText.toLowerCase();
    let [hours, mins] = timeTextLower.split(':');

    timeTextLower.endsWith('am')
      ? (hours = hours === '12' ? '0' : hours)
      : (hours = hours === '12' ? hours : String(+hours + 12));

    return hours.padStart(2, 0) + ':' + mins.slice(0, 2).padStart(2, 0);
  };

  console.log(convertTo24HoursFormat('12:10AM'));
  console.log(convertTo24HoursFormat('11:53PM'));
}

{
  /* Replace parameters in URL */

  const initialUrl = '/posts/:postId/comments/:commentId';

  const replaceParamsInUrl = (url, replacements) =>
    replacements.reduce(
      (acc,
      (replacement) => acc.replace(':' + replacement.from, replacement.to)),
      url
    );

  const resultUrl = replaceParamsInUrl(initialUrl, [
    { from: 'postId', to: '1' },
    { from: 'commentId', to: '3' },
  ]);
  console.log(resultUrl);
}
