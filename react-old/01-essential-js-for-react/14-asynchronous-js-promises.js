fetch("https://jsonplaceholder.typicode.com/todos")
  .then((res) => res.json())
  .then((data) => console.log(data));

axios
  .get("https://jsonplaceholder.typicode.com/todos")
  .then((res) => console.log(res.data));
