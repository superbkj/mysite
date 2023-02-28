import PostDetails from './PostDetails';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

const details = {
  title: 'test title',
  lead: 'test lead',
  text: 'test text',
  createdDate: dateStr,
  _id: 'test userid',
  username: 'test username',
};

const { container } = render(<PostDetails />);
const div = container.querySelector(".post_details");

screen.debug(div);

