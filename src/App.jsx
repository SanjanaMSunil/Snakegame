import React, { useState, useEffect } from 'react';
import './App.css';

const ROWS = 20;
const COLS = 20;
const CELL_SIZE = 25;
const INITIAL_SPEED = 150;

function App() {
  // Game state
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState(randomPosition());
  const [direction, setDirection] = useState('RIGHT');
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [gameOver, setGameOver] = useState(false);

  // Initialize game
  useEffect(() => {
    const interval = setInterval(moveSnake, speed);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [snake, direction, speed]);

  // Handle key press events
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowUp':
        setDirection('UP');
        break;
      case 'ArrowDown':
        setDirection('DOWN');
        break;
      case 'ArrowLeft':
        setDirection('LEFT');
        break;
      case 'ArrowRight':
        setDirection('RIGHT');
        break;
      default:
        break;
    }
  };

  // Move the snake
  const moveSnake = () => {
    if (gameOver) return;

    const newSnake = [...snake];
    let newHead = { ...newSnake[0] };

    switch (direction) {
      case 'UP':
        newHead.y -= 1;
        break;
      case 'DOWN':
        newHead.y += 1;
        break;
      case 'LEFT':
        newHead.x -= 1;
        break;
      case 'RIGHT':
        newHead.x += 1;
        break;
      default:
        break;
    }

    newSnake.unshift(newHead);

    if (newHead.x === food.x && newHead.y === food.y) {
      setFood(randomPosition());
      setSpeed(speed - 4); // Increase speed when food is eaten
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  // Generate random position for food
  function randomPosition() {
    return {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  }

  // Check for collisions
  useEffect(() => {
    if (checkCollision()) {
      setGameOver(true);
    }
  }, [snake]);

  function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
      return true; // Collision with walls
    }
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true; // Collision with self
      }
    }
    return false;
  }

  return (
      <div className="App">
        <h1>Snake Game</h1>
        <div className="board" style={{ width: COLS * CELL_SIZE, height: ROWS * CELL_SIZE }}>
          {snake.map((segment, index) => (
            <div
              key={index}
              className="snake-segment"
              style={{ left: segment.x * CELL_SIZE, top: segment.y * CELL_SIZE }}
            />
          ))}
          <div
            className="food"
            style={{ left: food.x * CELL_SIZE, top: food.y * CELL_SIZE, width: CELL_SIZE, height: CELL_SIZE }}
          />
          {gameOver && <div className="game-over">Game Over</div>}
        </div>
      </div>
  );
}

export default App;
