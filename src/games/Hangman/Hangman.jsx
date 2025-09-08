// src/games/Hangman/Hangman.js
import React, { useState } from 'react';
import './Hangman.css';

const Hangman = () => {
  const words = ['REACT', 'JAVASCRIPT', 'DEVELOPER', 'COMPONENT', 'PROGRAMMING'];
  const [selectedWord, setSelectedWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [errorCount, setErrorCount] = useState(0);
  const maxErrors = 6;

  const initializeGame = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setSelectedWord(randomWord);
    setGuessedLetters([]);
    setErrorCount(0);
  };

  // Initialize game on first render
  if (!selectedWord) {
    initializeGame();
  }

  const handleLetterGuess = (letter) => {
    if (guessedLetters.includes(letter)) return;
    
    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);
    
    if (!selectedWord.includes(letter)) {
      setErrorCount(errorCount + 1);
    }
  };

  const displayWord = () => {
    return selectedWord.split('').map((letter, index) => (
      <span key={index} className="letter">
        {guessedLetters.includes(letter) ? letter : '_'}
      </span>
    ));
  };

  const isGameWon = selectedWord && selectedWord.split('').every(letter => guessedLetters.includes(letter));
  const isGameLost = errorCount >= maxErrors;

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="hangman">
      <h2>Hangman</h2>
      
      <div className="game-status">
        <div>Errors: {errorCount} / {maxErrors}</div>
        {isGameWon && <div className="win-message">You won! 🎉</div>}
        {isGameLost && <div className="lose-message">Game Over! The word was: {selectedWord}</div>}
      </div>
      
      <div className="word-display">
        {displayWord()}
      </div>
      
      <div className="alphabet">
        {alphabet.map(letter => (
          <button
            key={letter}
            onClick={() => handleLetterGuess(letter)}
            disabled={guessedLetters.includes(letter) || isGameWon || isGameLost}
            className="letter-btn"
          >
            {letter}
          </button>
        ))}
      </div>
      
      <button className="reset-button" onClick={initializeGame}>
        New Game
      </button>
    </div>
  );
};

export default Hangman;