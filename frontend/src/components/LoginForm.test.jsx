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
  // mock function defined with Jest
  const mockHandler = jest.fn();
  
  render(<LoginForm />);
  
  // A session is started to interact with the rendered component:
  const user = userEvent.setup();

  const button = screen.getByText('Login');
  // Clicking happens with the method click of the userEvent-library
  await user.click(button);

  expect(mockHandler.mock.calls).toHaveLength(1);
});
