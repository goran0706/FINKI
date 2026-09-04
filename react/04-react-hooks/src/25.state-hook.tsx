import React, { ChangeEvent, FormEvent, useState } from "react";

/* 
  Props: 
  - Input passed to a component
  - Similar to function args
  - Immutable
  - Cause a re-render

  State:
  - Data managed by a component
  - Similar to local variables
  - Mutable
  - Cause a re-render

  Understanding the state hook:
  - React updates state asynchronously
  - State is stored outside of the component
  - State hook must be used at the top level of the component

  Best state practices:
  - Avoid redundant state variables
  - Group related variables inside an object, but avoid deeply nested state structures. Prefer flat over deeply nested state structures

  - Keep components pure --> same props same JSX in order for React to skip unnecessary re-rendering.
  - In strict mode (only in development mode) React renders twice.

  1. never change props --> props should be immutable
  2. only change state when needed --> state is mutable

  https://react.dev/reference/react/useState
*/

const StateHook = () => {
  // Avoiding recreating the initial state. If you pass a function to useState, React will only call it during initialization.
  const [count, setCount] = useState(() => 0);

  const [form, setForm] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@gmail.com",
  });

  const [customer, setCustomer] = useState({
    name: "John",
    address: {
      city: "San Francisco",
      zipCode: 94111,
    },
  });

  // Don't use State variables for things that can be computed from existing state variables.
  const fullName = form.firstName + " " + form.lastName;
  console.log(fullName);

  const [tags, setTags] = useState(["happy", "cheerful"]);
  const [bugs, setBugs] = useState([
    { id: 1, title: "Bug 1", fixed: false },
    { id: 2, title: "Bug 2", fixed: false },
  ]);

  // Updating state
  const reset = () => setCount(0);

  // Updating state based on the previous state
  const increment = () => setCount((count) => count + 1);
  const decrement = () => setCount((count) => count - 1);

  // Updating objects in state
  // The { ...form } spread syntax ensures that the state object is replaced rather than mutated.
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(form);
  };

  // Updating nested objects in state
  // The { ...customer } spread syntax ensures that the state object is replaced rather than mutated.
  // Shallow copying will not copy the nested object, but the reference to it.
  const handleCustomerChange = () => {
    setCustomer({
      ...customer,
      address: { ...customer.address, zipCode: 94112 },
    });
  };

  // Updating array
  // Add elements to an array
  const handleAdd = () => setTags([...tags, "last"]); // setTags(['first', ...tags]);

  // Update elements in an array
  const handleUpdate = () =>
    setTags(tags.map((tag) => (tag === "happy" ? "happiness" : tag)));

  // Remove elements from an array
  const handleRemove = () => setTags(tags.filter((t) => t !== "happy"));

  // Updating array of objects
  // We don't need to update all the objects inside the array, just that one object that matches the criteria
  const handleObjectsUpdate = () => {
    setBugs(bugs.map((bug) => (bug.id === 1 ? { ...bug, fixed: true } : bug)));
  };

  return (
    <div>
      <div>
        <h1>Updating State based on previous state</h1>
        <button onClick={reset}>Reset</button>
        <button onClick={increment}>Increment</button>
        <button onClick={decrement}>Decrement</button>
        <p>Count: {count}</p>
      </div>
      <div>
        <h1>Updating objects in state</h1>
        <form>
          <label>
            First Name:
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </label>
          <button onClick={handleSubmit}>Submit</button>
        </form>
      </div>
      <div>
        <h1>Updating nested objects in state</h1>
        <button onClick={handleCustomerChange}>Click Me</button>
        <p>Name: {customer.name}</p>
        <p>City: {customer.address.city}</p>
        <p>ZipCode: {customer.address.zipCode}</p>
      </div>
      <div>
        <h1>Updating Arrays</h1>
        <button onClick={handleAdd}>Add</button>
        <button onClick={handleUpdate}>Update</button>
        <button onClick={handleRemove}>Delete</button>
        <ul>
          {tags.map((tag, i) => (
            <li key={i}>{tag}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Updating State Objects In Array</h2>
        <button onClick={handleObjectsUpdate}>Click Me</button>
        <ul>
          {bugs.map((bug) => {
            const { id, title, fixed } = bug;
            return (
              <li key={id}>
                <span>{title}</span>
                <span>Fixed:{fixed.toString()}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default StateHook;
