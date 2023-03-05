import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';

import Search from './Search';

test('renders search', () => {
  const { container } = render(<Search />, {wrapper: MemoryRouter});
  const div = container.querySelector('.search');

  screen.debug(div);

  expect(div).toHaveTextContent('Keywords');
  expect(div).toHaveTextContent('Search');
});
