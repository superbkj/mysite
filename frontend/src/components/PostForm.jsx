import React, { useState } from 'react';

import { error } from '../utils/logger';

function PostForm() {
  const [title, setTitle] = useState('');
  const [lead, setLead] = useState('');
  const [text, setText] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

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

  let token = null;
  const setToken = (newToken) => {
    token = `Bearer ${newToken}`;
  };

  const handleSubmitClick = (event) => {
    event.preventDefault();

    if (!title) {
      setValidationMessage('Title cannot be empty');
      return;
    }

    if (!text) {
      setValidationMessage('Text cannot be empty');
      return;
    }

    const loggedInUser = JSON.parse(window.localStorage.getItem('mySiteLoggedInUser'));
    setToken(loggedInUser.token);

    // Slash at the start of a path
    // ensures that the path is not relative
    // but read from the root of the site
    fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ title, lead, text }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTitle('');
        setLead('');
        setText('');
        setValidationMessage(data.message);
      })
      // 401 Errorはこっちでキャッチしたい
      .catch((err) => error(err.error));
  };

  return (
    <form>
      <p>{validationMessage}</p>
      <label htmlFor="title">
        Title
        <input id="title" required type="text" value={title} onChange={handleTitleChange} />
      </label>
      <label htmlFor="lead">
        Lead
        <input id="lead" type="text" value={lead} onChange={handleLeadChange} />
      </label>
      <label htmlFor="content">
        Content
        <input id="content" required type="textarea" value={text} onChange={handleTextChange} />
      </label>
      <button type="submit" onClick={handleSubmitClick}>Submit</button>
    </form>
  );
}

export default PostForm;
