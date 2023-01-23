import React from 'react';

import Post from './Post';

function PostList(props) {
  const { posts } = props;

  return (
    // eslint-disable-next-line no-underscore-dangle
    posts.map((post) => <li key={post._id}><Post post={post} /></li>)
  );
}

export default PostList;
