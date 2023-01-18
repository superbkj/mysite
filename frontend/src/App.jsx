import { useState } from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Latest from "./components/Latest";
import Search from "./components/Search";
import PostForm from "./components/PostForm";

function App() {
  const [message, setMessage] = useState("");

  const handleClick = () => {
    fetch("/api/test")
    .then(res => res.json())
    .then(data => {
      console.log(data.message);
      setMessage(data.message);
    });
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/new" element={<Latest />}></Route>
          <Route path="/search" element={<Search />}></Route>
          <Route path="/post" element={<PostForm />}></Route>
        </Routes>
        <p>{message}</p>
        <button onClick={handleClick}>Click me</button>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
