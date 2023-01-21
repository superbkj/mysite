import { useState } from "react";
import PostList from "./PostList";

function Search() {
  const [results, setResults] = useState();
  const [keywords, setKeywords] = useState("");

  const handleKeywordsChange = (event) => {
    setKeywords(event.target.value);
  };


  const handleSearchClick = (event) => {
    event.preventDefault();

    const userQuery = {};
    userQuery.keywords = keywords;

    console.dir(userQuery);

    fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({userQuery})
    })
    .then(res => res.json())
    .then(data => {
      setResults(data);
    })
    .catch(error => console.error(error));
  };

  return (
    <>
      <form>
        <label htmlFor="keywords">Keywords</label>
        <input id="keywords" required type="text" value={keywords} onChange={handleKeywordsChange} />
        <button type="submit" onClick={handleSearchClick}>Search</button>
      </form>
      {results && <PostList posts={results}/>}
    </>
  );
}

export default Search;