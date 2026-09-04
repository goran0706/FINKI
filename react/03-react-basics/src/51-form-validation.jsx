/* eslint-disable react/prop-types */
import { useState } from "react";

const FormValidation = ({ onUserSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ email: "", password: "" });

  const validate = () => {
    const isEmailValid = email.split("").includes("@");
    const isPasswordValid = password.length >= 6;

    if (!isEmailValid) {
      setError((error) => ({ ...error, email: "Email is not valid" }));
    } else if (!isPasswordValid) {
      setError((error) => ({
        ...error,
        password: "Password must be at least 6 characters",
      }));
    } else {
      setError({ email: "", password: "" });
    }
  };

  const handleChange = (changeEvent) => {
    const { name, value } = changeEvent.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleSubmission = (formEvent) => {
    formEvent.preventDefault();
    validate();
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
      {error.email && <p>{error.email}</p>}
      {error.password && <p>{error.password}</p>}
      <button type="submit">Submit</button>
    </form>
  );
};

export default FormValidation;
