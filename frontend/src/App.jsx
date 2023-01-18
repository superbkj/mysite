import { useState } from 'react';
import './App.css';

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
      <p>{message}</p>
      <button onClick={handleClick}>Click here</button>
    </div>
  );
}

export default App;
