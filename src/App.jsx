// src/App.js
import React, { useState } from 'react';
import Menu from './components/Menu/Menu';
import GameContainer from './components/GameContainer/GameContainer';
import './App.css';

function App() {
  const [activeGame, setActiveGame] = useState('tic-tac-toe');

  return (
    <div className="app">
      <Menu activeGame={activeGame} setActiveGame={setActiveGame} />
      <GameContainer activeGame={activeGame} />
    </div>
  );
}

export default App;