/* eslint-disable react/prop-types */
import { useRef } from "react";

const FormUncontrolled = ({ onUserSubmit }) => {
  // Prefer the useRef hook over the useState when working with complex forms to avoid re-rendering.
  // useRef should always be initialized to null or reference an existing DOM element in TypeScript
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmission = (formEvent) => {
    formEvent.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    onUserSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmission} className="form">
      <div className="input-control ">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" ref={emailRef} />
      </div>
      <div className="input-control ">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          ref={passwordRef}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default FormUncontrolled;
