import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';

import Footer from './Footer';

test('renders footer', () => {
  const { container } = render(<Footer />, {wrapper: MemoryRouter});
  const div = container.querySelector('.footer');

  screen.debug(div);

  expect(div).toHaveTextContent('Footer here');
});
