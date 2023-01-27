import React from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';

function Post(props) {
  const { post } = props;

  return (
    <div className="post-container">
      {/* eslint-disable-next-line no-underscore-dangle */}
      <Link to={`/posts/${post._id}`}>
        <h2>{post.title}</h2>
      </Link>
      <p>{post.lead}</p>
      <p>{post.user.username}</p>
      <p>{post.createdDate}</p>
    </div>
  );
}

Post.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    lead: PropTypes.string,
    user: PropTypes.shape({
      username: PropTypes.string,
      _id: PropTypes.string,
    }),
    createdDate: PropTypes.string,
  }).isRequired,
};

export default Post;
