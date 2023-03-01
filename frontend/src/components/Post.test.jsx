import React from 'react';
// Jest testing library developed by Facebook
// In addition to Jest, we also need another testing library
// that will help us render components for testing purposes.
// The current best option for this is react-testing-library
import { render, screen } from '@testing-library/react';
// We also installed jest-dom which provides some nice Jest-related helper methods.
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';

import Post from './Post';

const dateStr = new Date().toString();

test('renders post', () => {
  const post = {
    title: 'test title',
    lead: 'test lead',
    // text: 'test text',
    createdDate: dateStr,
    _id: 'test userid',
    username: 'test username',
  };

  // renders the components in a format that is suitable
  // for tests without rendering them to the DOM.
  // MemoryRouter to avoid the error: useHref() may be used only in the context of a <Router> component
  const { container } = render(<Post post={post} />, {wrapper: MemoryRouter});
  // the method querySelector of the object container
  // that is one of the fields returned by the render
  const div = container.querySelector('.post');

  screen.debug(div);

  expect(div).toHaveTextContent('test title');
  expect(div).toHaveTextContent('test lead');
  expect(div).toHaveTextContent(dateStr);
  //expect(div).toHaveTextContent('test userid');
  expect(div).toHaveTextContent('test username');
});
