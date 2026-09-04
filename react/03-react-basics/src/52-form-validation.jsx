import { useState } from 'react';

export default function FormValidator() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const checkErrors = () => {
    const errors = [];
    if (!email || !password || !confirmPassword)
      errors.push('All fields must be filled in');
    if (email.match(/@/g)?.length !== 1)
      errors.push('An email must have exactly one @ sign');
    if (password.length < 8)
      errors.push('Password must be 8 characters or longer');
    if (password !== confirmPassword) errors.push('Passwords must match');
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = checkErrors();
    setMessage(errors.length ? errors.join(',') : 'Successfully logged in');
  };

  return (
    <form className='wrapper' onSubmit={handleSubmit}>
      <h1>Sign Up!</h1>
      <div className='form-control'>
        <label htmlFor='email'>Email:</label>
        <input
          type='text'
          id='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className='form-control'>
        <label htmlFor='password'>Password:</label>
        <input
          type='password'
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className='form-control'>
        <label htmlFor='confirmPassword'>Confirm Password:</label>
        <input
          type='password'
          id='confirmPassword'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      {message &&
        message.split(',').map((m) => (
          <span key={m} className='error'>
            {m}
          </span>
        ))}
      <button type='submit'>Sign In</button>
    </form>
  );
}
