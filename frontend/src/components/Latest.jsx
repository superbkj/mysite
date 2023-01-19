import { useState, useEffect } from "react";

import PostList from "./PostList";

function Latest() {

  const [results, setResults] = useState([]);

  // 
  useEffect(() => {
    (async () => {
      fetch("api/latest")
      .then(res => res.json())
      .then(data => setResults(data));
    })();
  }, []);

  if (!results) {
    return <p>Loading...</p>
  }

  return (
    <PostList posts={results} />
  );
}

export default Latest;