import { useState } from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Latest from "./components/Latest";
import Search from "./components/Search";
import PostForm from "./components/PostForm";
import PostDetails from "./components/PostDetails";

function App() {
  const [message, setMessage] = useState("");

  const handleHelloClick = () => {
    fetch("/api/hello")
    .then(res => res.json())
    .then(data => {
      setMessage(data.message);
    });
  };

  const handleLoadClick = () => {
    fetch("api/load-testdata")
    .then(res => res.json())
    .then(data => console.log(data.message))
    .catch(err => console.error(err));
  }

  return (
    <div className="App">
      <BrowserRouter>
        <button onClick={handleLoadClick}>Load Test Data</button>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/latest" element={<Latest />}></Route>
          <Route path="/search" element={<Search />}></Route>
          <Route path="/make-a-post" element={<PostForm />}></Route>
          <Route path="/posts/:id" element={<PostDetails />}></Route>
        </Routes>
        <p>Message from backend: {message}</p>
        <button onClick={handleHelloClick}>Hello</button>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
