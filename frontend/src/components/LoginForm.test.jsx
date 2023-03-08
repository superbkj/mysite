import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// library user-event makes simulating user input a bit easier
import userEvent from '@testing-library/user-event';

import LoginForm from './LoginForm';

test('renders login form', () => {
  const { container } = render(<LoginForm />);
  const div = container.querySelector('.login_form');

  screen.debug(div);

  expect(div).toHaveTextContent('Email');
  expect(div).toHaveTextContent('Password');
  expect(div).toHaveTextContent('Login');
});

test('clicking login button calls event handler once', async () => {
  const props = {
    email,
    password,
    onEmailChange,
    onPasswordChange,
    onLogin,
  };
  
  // mock function defined with Jest
  const mockSubmitHandler = jest.fn();
  // A session is started to interact with the rendered component:
  const user = userEvent.setup();

  const { container } = render(<LoginForm />);

  const email = container.querySelector("#email");
  const password = container.querySelector("#password");

  await user.type(email, 'abc@abc.com');
  await user.type(password, 'abc');

  const loginButton = screen.getByText('Login');
  // Clicking happens with the method click of the userEvent-library
  await user.click(loginButton);

  expect(mockSubmitHandler.mock.calls).toHaveLength(1);
  expect(mockSubmitHandler.mock.calls[0][0].content).toBe('abc@abc.com');
  // checks that the event handler is called with the right parameters
  // that a note with the correct content is created when the form is filled
  expect(mockSubmitHandler.mock.calls[0][1].content).toBe('abc');
});
