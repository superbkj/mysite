import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useCookies } from 'react-cookie';

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
  // const [loggedInUser, setLoggedInUser] = useState('');

  // Specify a list of cookie names that should trigger a re-render.
  // If unspecified, it will render on every cookie change.
  const [cookies, setCookie, removeCookie] = useCookies(['loggedInUser']);

  /*
  useEffect(() => {
    const storedUserStr = window.localStorage.getItem('mySiteLoggedInUser');
    if (storedUserStr && (storedUserStr !== 'undefined')) {
      const storedUserObj = JSON.parse(storedUserStr);
      info('Stored user:', storedUserObj.username);
      setLoggedInUser(storedUserObj.username);
    } else {
      info('No user stored');
    }
  }, []);
  */

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = (event) => {
    event.preventDefault();

    let success = true;

    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (!res.ok) {
          success = res.ok;
        }
        return res.json();
      })
      .then((data) => {
        if (success) {
          // undefinedをlocalStorageにセットしてしまうと、
          // 取り出すとき'undefined'という文字列になって困るので、
          // 値がundefinedの場合はセットしない
          if (data && data.username) {
            // setCookie(name, value, [options])
            // value (string|object):
            // save the value and stringify the object if needed
            setCookie('loggedInUser', data);
          }
          setEmail('');
          setPassword('');
        } else {
          throw new Error(data.error);
        }
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
      <p>{`Hello ${cookies.loggedInUser.username}`}</p>
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
