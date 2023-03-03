import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';

import Header from './Header';

test('renders header', () => {
  const { container } = render(<Header />, {wrapper: MemoryRouter});
  const div = container.querySelector('.navbar');

  screen.debug(div);

  expect(div).toHaveTextContent('My Site');
  expect(div).toHaveTextContent('Latest');
  expect(div).toHaveTextContent('Search');
  expect(div).toHaveTextContent('Post');
});
