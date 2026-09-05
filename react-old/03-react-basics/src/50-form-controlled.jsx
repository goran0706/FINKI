/* eslint-disable react/prop-types */
import { useState } from "react";

/* 
  Controlled elements - React stores the elements values in the component state
  Uncontrolled elements - React fetches the elements values from the DOM.

  Pros using Controlled elements:
  1. Single source of truth
  2. Less interactions with the DOM

  Cons using Controlled elements:
  1. Slight performance issues
  2. Re-renders the component on each value change

  How?
  To make a controlled element provide event handler and a value e.g. (onChange & value property)
  Prefer controlled elements when you need to re-render the component when the value changes.
*/

const FormControlled = ({ onUserSubmit }) => {
  // We store the state in the JavaScript rather than the DOM, in order to have a single source of truth.
  // This way we are not calling the DOM directly, it makes JavaScript the only place where state is stored.
  // If we compare the useState vs useRef approaches, then 'useState' might cause a bit of a performance issues when working with complex forms, because each time a values changes React re-renders the Component.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleChange = (changeEvent) => {
    const { name, value } = changeEvent.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleSubmission = (formEvent) => {
    formEvent.preventDefault();
    onUserSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmission} className="form">
      <div className="input-control ">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleChange}
        />
      </div>
      <div className="input-control ">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default FormControlled;
