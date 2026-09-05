import { useEffect, useRef } from "react";

const UseRef = () => {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const modal = useRef();

  // 1. useState - rerender component
  // 2. useRef - do not rerender component

  // 1. Uncontrolled component - Components that read their state from the DOM are called uncontrolled components. You can use refs to access and update the state.
  // 2. Controlled component - single source of truth, React keeps the state and does not read from the DOM.

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      "Username:" + usernameRef.current.value,
      "Password" + passwordRef.current.value
    );
  };

  useEffect(() => {
    const element = modal.current;
    if (!element) {
      const body = document.querySelector("body");
      const modalEl = document.createElement("div");
      modalEl.innerHTML = `
        <div>
          <h1>Modal</h1>
          <p>Content lorem ipsum</p>
          <button>Cancel</button>
          <button>Confirm</button>
        </div>
      `;
      body.appendChild(modalEl);
    }
    return () => {
      element.remove();
    };
  }, []);

  return (
    <div className="box">
      <form onSubmit={handleSubmit}>
        <legend>Login:</legend>
        <fieldset>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" ref={usernameRef} />
          <label htmlFor="password">Password</label>
          <input type="text" id="password" ref={passwordRef} />
        </fieldset>
        <button>Submit</button>
      </form>
    </div>
  );
};

export default UseRef;
