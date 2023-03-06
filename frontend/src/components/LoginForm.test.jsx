import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// import { MemoryRouter } from 'react-router-dom';

import LoginForm from './LoginForm';

test('renders login form', () => {
  const { container } = render(<LoginForm />);
  const div = container.querySelector('.login_form');

  screen.debug(div);

  expect(div).toHaveTextContent('Email');
  expect(div).toHaveTextContent('Password');
  expect(div).toHaveTextContent('Login');
});
