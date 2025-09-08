// src/games/Snake/Snake.js
import React, { useState, useEffect, useCallback } from 'react';
import './Snake.css';

const Snake = () => {
  const gridSize = 20;
  const initialSnake = [{ x: 10, y: 10 }];
  const initialDirection = 'RIGHT';
  const initialFood = { x: 5, y: 5 };

  const [snake, setSnake] = useState(initialSnake);
  const [direction, setDirection] = useState(initialDirection);
  const [food, setFood] = useState(initialFood);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(150);

  const generateFood = () => {
    const newFood = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };
    
    // Make sure food doesn't appear on snake
    for (let segment of snake) {
      if (segment.x === newFood.x && segment.y === newFood.y) {
        return generateFood();
      }
    }
    
    return newFood;
  };

  const handleKeyPress = useCallback((e) => {
    e.preventDefault();
    switch (e.key) {
      case 'ArrowUp':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
      default:
        break;
    }
  }, [direction]);

  useEffect(() => {
    if (!gameOver) {
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [gameOver, handleKeyPress]);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    const head = { ...snake[0] };
    
    switch (direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
      default:
        break;
    }

    // Check if snake hits the wall
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
      setGameOver(true);
      return;
    }

    // Check if snake hits itself
    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        setGameOver(true);
        return;
      }
    }

    const newSnake = [head, ...snake];
    
    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
      setFood(generateFood());
      setScore(score + 1);
      
      // Increase speed every 5 points
      if (score > 0 && score % 5 === 0) {
        setSpeed(prev => Math.max(prev - 10, 50));
      }
    } else {
      newSnake.pop();
    }
    
    setSnake(newSnake);
  }, [snake, direction, food, gameOver, score]);

  useEffect(() => {
    if (!gameOver) {
      const gameInterval = setInterval(moveSnake, speed);
      return () => clearInterval(gameInterval);
    }
  }, [moveSnake, gameOver, speed]);

  const resetGame = () => {
    setSnake(initialSnake);
    setDirection(initialDirection);
    setFood(initialFood);
    setGameOver(false);
    setScore(0);
    setSpeed(150);
  };

  const renderGrid = () => {
    const grid = [];
    
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const isSnake = snake.some(segment => segment.x === x && segment.y === y);
        const isFood = food.x === x && food.y === y;
        
        let cellClass = 'grid-cell';
        if (isSnake) cellClass += ' snake';
        if (isFood) cellClass += ' food';
        
        grid.push(
          <div
            key={`${x}-${y}`}
            className={cellClass}
          />
        );
      }
    }
    
    return grid;
  };

  return (
    <div className="snake-game">
      <h2>Snake Game</h2>
      <div className="game-info">
        <div>Score: {score}</div>
        {gameOver && <div className="game-over">Game Over!</div>}
      </div>
      <div className="grid-container">
        {renderGrid()}
      </div>
      <button className="reset-button" onClick={resetGame}>
        New Game
      </button>
    </div>
  );
};

export default Snake;