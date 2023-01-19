function Post(props) {
  const {post} = props;

  return (
    <>
      <h2>{post.title}</h2>
      <p>{post.text}</p>
      <p>{post.createdDate}</p>
    </>
  );
}

export default Post;