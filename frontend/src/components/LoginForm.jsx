import React, { useState } from 'react';
import { info, error } from '../utils/logger';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = (event) => {
    event.preventDefault();

    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => info(data.token, data.username))
      .catch((err) => error(err));
  };

  return (
    <form onSubmit={handleLogin}>
      <label htmlFor="email">
        Email
        <input type="text" id="email" value={email} onChange={handleEmailChange} />
      </label>
      <label htmlFor="password">
        Password
        <input type="text" id="password" value={password} onChange={handlePasswordChange} />
      </label>
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;
