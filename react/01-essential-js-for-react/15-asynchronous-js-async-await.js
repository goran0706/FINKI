async function getTodos() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos");
  const data = await res.json();
  console.log(data);
  return data;
}

async function getTodos() {
  const res = await axios.get("https://jsonplaceholder.typicode.com/todos");
  const { data } = res;
  console.log(data);
  return data;
}
