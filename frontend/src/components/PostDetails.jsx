import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function PostDetails() {
  const { id } = useParams();
  const [details, setDetails] = useState();

  useEffect(() => {
    (async () => {
      fetch(`/api/posts/${id}`)
        .then((res) => res.json())
        .then((data) => setDetails(data));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!details) {
    return <p>Loading...</p>;
  }

  return (
    <div className="post_details">
      <h2>{details.title}</h2>
      <p>{details.lead}</p>
      <p>{details.username}</p>
      <p>{details.text}</p>
      <p>{details.createdDate}</p>
    </div>
  );
}

export default PostDetails;
