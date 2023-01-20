import {Link} from "react-router-dom";

function Post(props) {
  const {post} = props;
  console.dir(post._id);

  return (
    <div className="post-container">
      <Link to={`/posts/${post._id}`}>
        <h2>{post.title}</h2>
      </Link>
      <p>{post.lead}</p>
      <p>{post.createdDate}</p>
    </div>
  );
}

export default Post;