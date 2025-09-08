// src/games/MemoryGame/MemoryGame.js
import React, { useState, useEffect } from 'react';
import './MemoryGame.css';

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [moves, setMoves] = useState(0);

  const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const cardPairs = [...emojis, ...emojis];
    const shuffledCards = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, flipped: false }));
    
    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
  };

  useEffect(() => {
    const checkMatch = () => {
      const [first, second] = flipped;
      
      if (cards[first].emoji === cards[second].emoji) {
        setSolved([...solved, first, second]);
      }
      
      setTimeout(() => {
        setFlipped([]);
      }, 1000);
    };

    if (flipped.length === 2) {
      setMoves(moves + 1);
      checkMatch();
    }
  }, [flipped, cards, solved, moves]);

  const handleCardClick = (index) => {
    if (flipped.length < 2 && !flipped.includes(index) && !solved.includes(index)) {
      setFlipped([...flipped, index]);
    }
  };

  const isGameCompleted = solved.length === cards.length && cards.length > 0;

  return (
    <div className="memory-game">
      <h2>Memory Game</h2>
      <div className="game-info">
        <div>Moves: {moves}</div>
        {isGameCompleted && <div className="win-message">You won! 🎉</div>}
      </div>
      <div className="cards-grid">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`card ${flipped.includes(index) || solved.includes(index) ? 'flipped' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            <div className="card-front">?</div>
            <div className="card-back">{card.emoji}</div>
          </div>
        ))}
      </div>
      <button className="reset-button" onClick={initializeGame}>
        New Game
      </button>
    </div>
  );
};

export default MemoryGame;