import React, { useState } from 'react';
import PostList from './PostList';

import { error } from '../utils/logger';

function Search() {
  const [results, setResults] = useState();
  const [keywords, setKeywords] = useState('');

  const handleKeywordsChange = (event) => {
    setKeywords(event.target.value);
  };

  const handleSearchClick = (event) => {
    event.preventDefault();

    const params = {};
    params.keywords = keywords;

    const paramsURLStr = new URLSearchParams(params).toString();

    fetch(`/api/posts?${paramsURLStr}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
      })
      .catch((err) => error(err));
  };

  return (
    <>
      <form>
        <label htmlFor="keywords">
          Keywords
          <input id="keywords" required type="text" value={keywords} onChange={handleKeywordsChange} />
        </label>
        <button type="submit" onClick={handleSearchClick}>Search</button>
      </form>
      {results && <PostList posts={results} />}
    </>
  );
}

export default Search;
