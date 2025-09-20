// src/components/Menu/Menu.js
import React from 'react';
import './Menu.css';

const Menu = ({ activeGame, setActiveGame }) => {
  const menuItems = [
    { id: 'tic-tac-toe', name: 'Tic Tac Toe', icon: '⭕' },
   // { id: 'memory-game', name: 'Memory Game', icon: '🎮' },
    { id: 'snake', name: 'Snake', icon: '🐍' },
    { id: 'hangman', name: 'Hangman', icon: '🧩' },
    { id: 'QuantumGame' , name: 'Quantum Game', icon: '🕹️' },
  ];

  return (
    <div className="menu">
      <div className="menu-header">
        <h2>Game Hub</h2>
      </div>
      <ul className="menu-list">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`menu-item ${activeGame === item.id ? 'active' : ''}`}
            onClick={() => setActiveGame(item.id)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-text">{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;