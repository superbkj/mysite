import {useState} from "react";

function PostForm() {
  const [title, setTitle] = useState("");
  const [lead, setLead] = useState("");
  const [text, setText] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  // currentTarget: element to which the event handler has been attached
  // target: element on which the event occurred
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleLeadChange = (event) => {
    setLead(event.target.value);
  };
  
  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmitClick = (event) => {
    event.preventDefault();

    if (!title) {
      setValidationMessage("Title cannot be empty");
      return;
    }

    if (!text) {
      setValidationMessage("Text cannot be empty");
      return;
    }
    
    // Slash at the start of a path
    // ensures that the path is not relative
    // but read from the root of the site
    fetch("/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({title, lead, text})
    })
    .then(res => res.json())
    .then(data => {
      setTitle("");
      setLead("");
      setText("");
      setValidationMessage(data.message);
    })
    .catch(error => console.error(error));
  }

  return (
    <form>
      <p>{validationMessage}</p>
      <label htmlFor="title">Title</label>
      <input id="title" required type="text" value={title} onChange={handleTitleChange} />
      <label htmlFor="lead">Lead</label>
      <input id="lead" required type="text" value={lead} onChange={handleLeadChange} />
      <label htmlFor="content">Content</label>
      <input id="content" required type="textarea" value={text} onChange={handleTextChange} />
      <button type="submit" onClick={handleSubmitClick}>Submit</button>
    </form>
  );
}

export default PostForm;