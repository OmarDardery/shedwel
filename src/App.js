import './App.css';
import React, { useState } from 'react';
import Schedule from './components/schedule';

function App() {
    const [events, setEvents] = useState([]);
    const [response, setResponse] = useState("");
  return (
    <Schedule />
  );
}

export default App;