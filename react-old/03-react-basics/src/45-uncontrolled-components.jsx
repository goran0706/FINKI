import { useRef } from "react";

const UncontrolledComponents = () => {
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    alert(`username: ${username} & password: ${password}`);
  };

  return (
    <div>
      <h1>Uncontrolled Components</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input id="username" type="text" ref={usernameRef} />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input id="password" type="password" ref={passwordRef} />
        </div>
        <button type="reset">Reset</button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UncontrolledComponents;
