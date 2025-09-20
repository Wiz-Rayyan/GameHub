import React, { useState, useEffect, useCallback, useRef } from 'react';

// Constants
const WIDTH = 800;
const HEIGHT = 650;
const GRID_SIZE = 8;
const TILE_SIZE = 70;
const GRID_OFFSET_X = (WIDTH - GRID_SIZE * TILE_SIZE) / 2;
const GRID_OFFSET_Y = (HEIGHT - GRID_SIZE * TILE_SIZE) / 2 - 20;

// Colors
const BLACK = '#000000';
const WHITE = '#FFFFFF';
const RED = '#FF3232';
const BLUE = '#3232FF';
const PURPLE = '#9632FF';  // Swap Gate
const GREEN = '#32FF32';   // Phase Gate
const GRAY = '#646464';    // Walls

// Game states
const MENU = 0;
const PLAYING = 1;
const LEVEL_COMPLETE = 2;

const QuantumGame = () => {
  const [gameState, setGameState] = useState(MENU);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [redPos, setRedPos] = useState([1, 1]);
  const [bluePos, setBluePos] = useState([6, 6]);
  const [moves, setMoves] = useState(0);
  const [redPhased, setRedPhased] = useState(false);
  const [bluePhased, setBluePhased] = useState(false);
  const [entangled, setEntangled] = useState(false);
  const [level, setLevel] = useState([]);
  const [redGoal, setRedGoal] = useState([]);
  const [blueGoal, setBlueGoal] = useState([]);
  const [levelName, setLevelName] = useState('');
  
  const canvasRef = useRef(null);
  const lastProcessedKey = useRef(null);

  // Load a level
  const loadLevel = useCallback((levelNum) => {
    setRedPos([1, 1]);
    setBluePos([6, 6]);
    setMoves(0);
    setRedPhased(false);
    setBluePhased(false);
    setEntangled(false);
    
    if (levelNum === 0) {  // Tutorial
      setLevel([
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 2, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
      ]);
      setRedGoal([7, 6]);
      setBlueGoal([2, 1]);
      setLevelName("Tutorial: Basic Movement");
    
    } else if (levelNum === 1) {  // Swap Gate
      setLevel([
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 3, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 2, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
      ]);
      setRedGoal([6, 1]);
      setBlueGoal([1, 6]);
      setLevelName("Level 1: Quantum Swap");
    }
  }, []);

  // Initialize the game
  useEffect(() => {
    loadLevel(currentLevel);
  }, [currentLevel, loadLevel]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Prevent default for game keys to avoid scrolling
      if (['Space', 'KeyE', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) {
        event.preventDefault();
      }
      
      // Only process the key if it's different from the last processed key
      if (event.code === lastProcessedKey.current) {
        return;
      }
      
      lastProcessedKey.current = event.code;
      
      if (gameState === MENU && event.code === 'Space') {
        setGameState(PLAYING);
      } else if (gameState === PLAYING) {
        if (event.code === 'KeyE') {
          setEntangled(prev => !prev);
        } else if (event.code === 'KeyW') {
          moveParticles(0, -1);
        } else if (event.code === 'KeyS') {
          moveParticles(0, 1);
        } else if (event.code === 'KeyA') {
          moveParticles(-1, 0);
        } else if (event.code === 'KeyD') {
          moveParticles(1, 0);
        }
      } else if (gameState === LEVEL_COMPLETE && event.code === 'Space') {
        const nextLevel = currentLevel + 1 > 1 ? 0 : currentLevel + 1;
        setCurrentLevel(nextLevel);
        loadLevel(nextLevel);
        setGameState(PLAYING);
      }
    };

    const handleKeyUp = (event) => {
      if (event.code === lastProcessedKey.current) {
        lastProcessedKey.current = null;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, currentLevel, loadLevel]);

  // Move particles (single step)
  const moveParticles = (dx, dy) => {
    // For red particle - normal movement
    const newRedX = redPos[0] + dx;
    const newRedY = redPos[1] + dy;
    
    // For blue particle - reversed if entangled
    let blueDx = dx;
    let blueDy = dy;
    if (entangled) {
      blueDx = -dx;
      blueDy = -dy;
    }
    
    const newBlueX = bluePos[0] + blueDx;
    const newBlueY = bluePos[1] + blueDy;
    
    // Check if red can move
    let redCanMove = false;
    if (newRedX >= 0 && newRedX < GRID_SIZE && newRedY >= 0 && newRedY < GRID_SIZE) {
      if (level[newRedY][newRedX] !== 3 || redPhased) {
        redCanMove = true;
      }
    }
    
    // Check if blue can move
    let blueCanMove = false;
    if (newBlueX >= 0 && newBlueX < GRID_SIZE && newBlueY >= 0 && newBlueY < GRID_SIZE) {
      if (level[newBlueY][newBlueX] !== 3 || bluePhased) {
        blueCanMove = true;
      }
    }
    
    // If both can move, update positions
    if (redCanMove && blueCanMove) {
      const newRedPos = [newRedX, newRedY];
      const newBluePos = [newBlueX, newBlueY];
      
      setRedPos(newRedPos);
      setBluePos(newBluePos);
      setMoves(prev => prev + 1);
      
      // Check for gate interactions
      checkGates(newRedPos, newBluePos);
    }
  };

  // Check for gate interactions
  const checkGates = (newRedPos, newBluePos) => {
    // Check if red is on a gate
    const redCell = level[newRedPos[1]][newRedPos[0]];
    const blueCell = level[newBluePos[1]][newBluePos[0]];
    
    // Swap Gate logic
    if (redCell === 1 || blueCell === 1) {
      // Swap positions
      const tempPos = [...newRedPos];
      setRedPos([...newBluePos]);
      setBluePos(tempPos);
      
      // Update for gate effects
      if (redCell === 2) setRedPhased(prev => !prev);
      if (blueCell === 2) setBluePhased(prev => !prev);
      
      // Check if both reached goals after swap
      if (newBluePos[0] === redGoal[0] && newBluePos[1] === redGoal[1] &&
          tempPos[0] === blueGoal[0] && tempPos[1] === blueGoal[1]) {
        setGameState(LEVEL_COMPLETE);
      }
      return;
    }
    
    // Phase Gate logic
    if (redCell === 2) {
      setRedPhased(prev => !prev);
    }
    
    if (blueCell === 2) {
      setBluePhased(prev => !prev);
    }
    
    // Check if both reached goals
    if (newRedPos[0] === redGoal[0] && newRedPos[1] === redGoal[1] &&
        newBluePos[0] === blueGoal[0] && newBluePos[1] === blueGoal[1]) {
      setGameState(LEVEL_COMPLETE);
    }
  };

  // Draw the game
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = BLACK;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    if (gameState === MENU) {
      // Draw menu
      ctx.fillStyle = PURPLE;
      ctx.font = 'bold 72px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('NEON GRID', WIDTH / 2, HEIGHT / 3);
      
      ctx.fillStyle = WHITE;
      ctx.font = '36px Arial';
      ctx.fillText('Quantum Pathfinder', WIDTH / 2, HEIGHT / 3 + 80);
      
      ctx.fillStyle = GREEN;
      ctx.font = '24px Arial';
      ctx.fillText('Press E to toggle mirrored/opposite movement. Press SPACE to Begin', WIDTH / 2, HEIGHT / 2);
    
    } else if (gameState === PLAYING || gameState === LEVEL_COMPLETE) {
      // Draw grid
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          const rectX = GRID_OFFSET_X + x * TILE_SIZE;
          const rectY = GRID_OFFSET_Y + y * TILE_SIZE;
          
          // Draw gates/walls
          const cell = level[y][x];
          if (cell === 1) {  // Swap Gate
            ctx.fillStyle = PURPLE;
            ctx.fillRect(rectX, rectY, TILE_SIZE, TILE_SIZE);
          } else if (cell === 2) {  // Phase Gate
            ctx.fillStyle = GREEN;
            ctx.fillRect(rectX, rectY, TILE_SIZE, TILE_SIZE);
          } else if (cell === 3) {  // Wall
            ctx.fillStyle = GRAY;
            ctx.fillRect(rectX, rectY, TILE_SIZE, TILE_SIZE);
          }
          
          // Grid lines
          ctx.strokeStyle = '#323232';
          ctx.strokeRect(rectX, rectY, TILE_SIZE, TILE_SIZE);
        }
      }
      
      // Draw goals
      ctx.strokeStyle = RED;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(
        GRID_OFFSET_X + redGoal[0] * TILE_SIZE + TILE_SIZE/2,
        GRID_OFFSET_Y + redGoal[1] * TILE_SIZE + TILE_SIZE/2,
        TILE_SIZE/3,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      
      ctx.strokeStyle = BLUE;
      ctx.beginPath();
      ctx.arc(
        GRID_OFFSET_X + blueGoal[0] * TILE_SIZE + TILE_SIZE/2,
        GRID_OFFSET_Y + blueGoal[1] * TILE_SIZE + TILE_SIZE/2,
        TILE_SIZE/3,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      
      // Draw particles
      ctx.fillStyle = RED;
      ctx.beginPath();
      ctx.arc(
        GRID_OFFSET_X + redPos[0] * TILE_SIZE + TILE_SIZE/2,
        GRID_OFFSET_Y + redPos[1] * TILE_SIZE + TILE_SIZE/2,
        TILE_SIZE/3,
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      ctx.fillStyle = BLUE;
      ctx.beginPath();
      ctx.arc(
        GRID_OFFSET_X + bluePos[0] * TILE_SIZE + TILE_SIZE/2,
        GRID_OFFSET_Y + bluePos[1] * TILE_SIZE + TILE_SIZE/2,
        TILE_SIZE/3,
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      // Draw UI
      ctx.fillStyle = WHITE;
      ctx.font = '24px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(levelName, 20, 40);
      ctx.fillText(`Moves: ${moves}`, 20, 70);
      
      // Draw entanglement status
      ctx.fillText(`Entangled: ${entangled ? 'ON' : 'OFF'}`, 20, 100);
      
      if (gameState === LEVEL_COMPLETE) {
        // Draw level complete overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        
        ctx.fillStyle = GREEN;
        ctx.font = 'bold 72px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('LEVEL COMPLETE!', WIDTH / 2, HEIGHT / 2 - 50);
        
        ctx.fillStyle = WHITE;
        ctx.font = '36px Arial';
        ctx.fillText('Press SPACE to continue', WIDTH / 2, HEIGHT / 2 + 50);
      }
    }
  }, [gameState, level, redGoal, blueGoal, redPos, bluePos, moves, levelName, entangled]);

  // Game loop
  useEffect(() => {
    const gameLoop = () => {
      draw();
      requestAnimationFrame(gameLoop);
    };
    
    const animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [draw]);

  return (
    <div style={{ 
      position: 'relative', 
      width: WIDTH, 
      height: HEIGHT,
      backgroundColor: BLACK
    }}>
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        style={{ display: 'block' }}
      />
      
      {/* Instructions */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        width: '100%',
        textAlign: 'center',
        color: GREEN,
        fontSize: '16px',
        pointerEvents: 'none'
      }}>
        Use WASD to move (one tile at a time). Press E to toggle entanglement.
      </div>
    </div>
  );
};

export default QuantumGame;