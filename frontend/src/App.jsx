import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Latest from './components/Latest';
import Search from './components/Search';
import PostForm from './components/PostForm';
import PostDetails from './components/PostDetails';
import LoginForm from './components/LoginForm';
import { info, error } from './utils/logger';

function App() {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
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
      .then((data) => {
        window.localStorage.setItem(
          'mySiteLoggedInUser',
          JSON.stringify(data),
        );
        setEmail('');
        setPassword('');
      })
      .catch((err) => error(err));
  };

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

  return (
    // Regular HTML attributes also typically use double quotes instead of single,
    // so JSX attributes mirror this convention
    <div className="App">
      <button type="button" onClick={handleLoadClick}>Load Test Data</button>
      <LoginForm
        email={email}
        password={password}
        onEmailChange={handleEmailChange}
        onPasswordChange={handlePasswordChange}
        onLogin={handleLogin}
      />
      <BrowserRouter>
        <Header />
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
