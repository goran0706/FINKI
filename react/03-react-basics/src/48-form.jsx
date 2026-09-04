/* eslint-disable react/prop-types */

const Form = ({ onUserSubmit }) => {
  const handleSubmission = (formEvent) => {
    formEvent.preventDefault();
    const { email, password } = formEvent.target.elements;
    const user = { email: email.value, password: password.value };
    onUserSubmit(user);
  };

  return (
    <form onSubmit={handleSubmission} className="form">
      <div className="input-control ">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" />
      </div>
      <div className="input-control ">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Form;
