import React from 'react';
// Jest testing library developed by Facebook
// In addition to Jest, we also need another testing library
// that will help us render components for testing purposes.
// The current best option for this is react-testing-library
import { render, screen } from '@testing-library/react';
// We also installed jest-dom which provides some nice Jest-related helper methods.
import '@testing-library/jest-dom/extend-expect';

import Post from './Post';

test('renders content', () => {
  const post = {
    title: 'test title',
    lead: 'test lead',
    // text: 'test text',
    createdDate: new Date(),
    _id: 'test userid',
    username: 'test username',
  };

  // renders the components in a format that is suitable
  // for tests without rendering them to the DOM
  render(<Post post={post} />);

  const element = screen.getByText('test title');
  expect(element).toBeDefined();
});
