import Post from "./Post";

function PostList(props) {
  const {posts} = props;

  return (
    posts.map(post => {
      return <li key={post._id}><Post post={post} /></li>
    })
  );
}

export default PostList;