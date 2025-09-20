// src/components/GameContainer/GameContainer.js
import React from 'react';
import TicTacToe from '../../games/TicTacToe/TicTacToe';

import Snake from '../../games/Snake/Snake';
import Hangman from '../../games/Hangman/Hangman';
import './GameContainer.css';
import QuantumGame from '../../games/neongrid/QuantumGame';

const GameContainer = ({ activeGame }) => {
  const renderGame = () => {
    switch (activeGame) {
      case 'tic-tac-toe':
        return <TicTacToe />;
      case 'snake':
        return <Snake />;
      case 'hangman':
        return <Hangman />;
      case 'QuantumGame':
        return <QuantumGame />;
      default:
        return <TicTacToe />;
    }
  };

  return (
    <div className="game-container">
      <div className="game-content">
        {renderGame()}
      </div>
    </div>
  );
};

export default GameContainer;