import React, { useState, useEffect } from 'react';

import PostList from './PostList';

function Latest() {
  const [results, setResults] = useState([]);

  // Callback function passed to useEffect
  // should return either nothing or a clean up function.
  // useEffect(async () => {}) is not possible
  // because the callback would return a Promise in this case.
  // So if asynchronous processing is needed for side effect,
  // you need to pass a normal function to useEffect and
  // define & call an async function inside of it.
  useEffect(() => {
    (async () => {
      fetch('/api/posts')
        .then((res) => res.json())
        .then((data) => setResults(data));
    })(); // IIFE (Immediately Invoked Function Expression)
  }, []);

  if (!results) {
    return <p>Loading...</p>;
  }

  return (
    <PostList posts={results} />
  );
}

export default Latest;
