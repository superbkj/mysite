import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Latest from './components/Latest';
import Search from './components/Search';
import PostForm from './components/PostForm';
import PostDetails from './components/PostDetails';
import { info, error } from './utils/logger';

function App() {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleHelloClick = () => {
    fetch('/api/hello')
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
      });
  };

  const handleLoadClick = () => {
    fetch('/api/posts/test/load-testdata')
      .then((res) => res.json())
      .then((data) => info(data.message))
      .catch((err) => error(err));
  };

  const handleLogin = (event) => {
    event.preventDefault();

    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => info(data.token, data.username))
      .catch((err) => error(err));
  };

  return (
    // Regular HTML attributes also typically use double quotes instead of single,
    // so JSX attributes mirror this convention
    <div className="App">
      <BrowserRouter>
        <button type="button" onClick={handleLoadClick}>Load Test Data</button>
        <Header />
        <form onSubmit={handleLogin}>
          <label htmlFor="email">
            Email
            <input type="text" id="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label htmlFor="password">
            Password
            <input type="text" id="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          <button type="submit">login</button>
        </form>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/latest" element={<Latest />} />
          <Route path="/search" element={<Search />} />
          <Route path="/make-a-post" element={<PostForm />} />
          <Route path="/posts/:id" element={<PostDetails />} />
        </Routes>
        <p>
          {`Message from backend: ${message}`}
        </p>
        <button type="button" onClick={handleHelloClick}>Hello</button>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
