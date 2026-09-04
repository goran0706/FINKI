/* 
  Async JavaScript (Promises and Callbacks, HTTP Requests)

*/

var promise = new Promise((resolve, reject) => {
  if (true) {
    resolve("Stuff Worked");
  } else {
    reject("Error, promise rejected");
  }
});

// Handling Promises using then/catch
promise
  .then((result) => result + "!")
  .then((result2) => result2 + "@")
  .then((result3) => result3 + "#")
  .catch((e) => console.log(e)) // catches any error in the above promises but not bellow
  .then((result4) => result4 + "$"); // not handled

// Handling Multiple Promises using Promise.all
var promise1 = new Promise((resolve, reject) =>
  setTimeout(reject, 1000, "Promise 1")
);

var promise2 = new Promise((resolve, reject) =>
  setTimeout(resolve, 2000, "Promise 2")
);

var promise3 = new Promise((resolve, reject) =>
  setTimeout(resolve, 3000, "Promise 3")
);

var promise4 = new Promise((resolve, reject) =>
  setTimeout(resolve, 4000, "Promise 4")
);

Promise.all([promise1, promise2, promise3, promise4])
  .then((response) => {
    console.log(response[0]);
    console.log(response[1]);
    console.log(response[2]);
    console.log(response[3]);
  })
  .catch((e) => console.log(e));

// Handling Multiple HTTP Requests using Promise.all
var urls = [
  "https://jsonplaceholder.typicode.com/users",
  "https://jsonplaceholder.typicode.com/todos",
  "https://jsonplaceholder.typicode.com/photos",
  "https://jsonplaceholder.typicode.com/posts",
];

var promises = urls.map((url) =>
  fetch(url).then((response) => response.json())
);

// Promise.race is resolved or rejected when any of the provided Promises are resolved or rejected.
Promise.race(promises)
  .then((response) => {
    console.log(response[0]);
    console.log(response[1]);
    console.log(response[2]);
    console.log(response[3]);
  })
  .catch((e) => console.log(e))
  .finally(() => console.log("runs anyways regardless the promise"));

// Promise.all is resolved with an array of results when all of the provided Promises resolve, or rejected when any Promise is rejected.
Promise.all(promises)
  .then((response) => {
    console.log(response[0]);
    console.log(response[1]);
    console.log(response[2]);
    console.log(response[3]);
  })
  .catch((e) => console.log(e))
  .finally(() => console.log("runs anyways regardless the promise"));

// Promise.allSettled is resolved with an array of results when all of the provided Promises resolve or reject.
Promise.allSettled(promises)
  .then((response) => {
    console.log(response[0]);
    console.log(response[1]);
    console.log(response[2]);
    console.log(response[3]);
  })
  .catch((e) => console.log(e))
  .finally(() => console.log("runs anyways regardless the promise"));

/*
      Async/Await
  */
async function fetchUsers() {
  var response = await fetch("https://jsonplaceholder.typicode.com/users");
  var data = await response.json();
  return data;
}

fetchUsers()
  .then((res) => console.log(res))
  .catch((e) => console.log(e));

var getData = async function () {
  try {
    var [users, todos, photos, posts] = await Promise.all(promises);
    console.log(users);
    console.log(todos);
    console.log(photos);
    console.log(posts);
  } catch (e) {
    console.log(e);
  }
};

getData()
  .then((res) => console.log(res))
  .catch((e) => console.log(e));

/* 
  for await of
*/
var getData = async function () {
  var results = [];
  var promises = urls.map((url) => fetch(url));

  for await (var request of promises) {
    var data = await request.json();
    results.push(data);
  }

  return results;
};

getData()
  .then((res) => console.log(res))
  .catch((e) => console.log(e));
