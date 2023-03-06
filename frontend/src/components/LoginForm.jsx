import React from 'react';
import PropTypes from 'prop-types';

function LoginForm(props) {
  const {
    email,
    password,
    onEmailChange,
    onPasswordChange,
    onLogin,
  } = props;

  return (
    <form className="login_form" onSubmit={onLogin}>
      <label htmlFor="email">
        Email
        <input type="text" id="email" value={email} onChange={onEmailChange} />
      </label>
      <label htmlFor="password">
        Password
        <input type="text" id="password" value={password} onChange={onPasswordChange} />
      </label>
      <button type="submit">Login</button>
    </form>
  );
}

LoginForm.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  onEmailChange: PropTypes.func.isRequired,
  onPasswordChange: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
};

export default LoginForm;
