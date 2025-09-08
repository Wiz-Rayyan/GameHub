// src/games/TicTacToe/TicTacToe.js
import React, { useState } from 'react';
import './TicTacToe.css';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    
    return null;
  };

  const handleClick = (i) => {
    const squares = [...board];
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    
    squares[i] = isXNext ? 'X' : 'O';
    setBoard(squares);
    setIsXNext(!isXNext);
    
    const winner = calculateWinner(squares);
    if (winner) {
      setScores({
        ...scores,
        [winner]: scores[winner] + 1
      });
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0 });
    resetGame();
  };

  const winner = calculateWinner(board);
  const isBoardFull = board.every(square => square !== null);
  let status;
  
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isBoardFull) {
    status = 'Draw!';
  } else {
    status = `Next player: ${isXNext ? 'X' : 'O'}`;
  }

  const renderSquare = (i) => {
    return (
      <button className="square" onClick={() => handleClick(i)}>
        {board[i]}
      </button>
    );
  };

  return (
    <div className="tic-tac-toe">
      <h2>Tic Tac Toe</h2>
      <div className="status">{status}</div>
      <div className="score-board">
        <div>X: {scores.X}</div>
        <div>O: {scores.O}</div>
      </div>
      <div className="board">
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
      <div className="controls">
        <button onClick={resetGame}>New Game</button>
        <button onClick={resetScores}>Reset Scores</button>
      </div>
    </div>
  );
};

export default TicTacToe;