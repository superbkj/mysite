import { useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState("");

  const handleClick = () => {
    fetch("http://localhost:3001/test")
    .then(res => res.json())
    .then(data => {
      console.log(data.message);
      setMessage(data.message);
    });
  };

  return (
    <div className="App">
      <p>{message}</p>
      <button onClick={handleClick}>Click</button>
    </div>
  );
}

export default App;
