"use client";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay, faInfoCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

const canvasWidth = 400;
const canvasHeight = 400;
const playerDiameter = 50;
const obstacleWidth = 50;
const obstacleHeight = 50;
const floorHeight = 50;
const jumpHeight = 200; // Increase jump height for more pronounced action
const gravity = 5;
const speed = 5;
const initialTime = 30;
const pauseDuration = 5000; // 5 seconds pause between levels

const levels = [
  { level: 1, obstacles: [800, 1600, 2400] },
  { level: 2, obstacles: [600, 1200, 1800, 2400, 3000, 3600] },
  { level: 3, obstacles: [400, 800, 1200, 1600, 2000, 2400, 2800, 3200, 3600] },
];

const decorations = [
  { x: 500, y: 50 },
  { x: 1500, y: 100 },
  { x: 2500, y: 50 },
];

export default function RunnerGame() {
  const canvasRef = useRef(null);
  const [playerY, setPlayerY] = useState(canvasHeight - playerDiameter - floorHeight);
  const [jumping, setJumping] = useState(false);
  const [obstacles, setObstacles] = useState([]);
  const [decorationsPositions, setDecorationsPositions] = useState(decorations);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [level, setLevel] = useState(1);
  const [win, setWin] = useState(false);
  const [showLevelMessage, setShowLevelMessage] = useState(true);
  const [paused, setPaused] = useState(true); // Game starts paused
  const [countdown, setCountdown] = useState(5);
  const [holes, setHoles] = useState([]);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const intervalId = setInterval(() => {
        if (!paused && !showLevelMessage) {
          updateGame(ctx);
        }
      }, 20);

      return () => clearInterval(intervalId);
    }
  }, [playerY, obstacles, gameOver, win, paused, showLevelMessage]);

  useEffect(() => {
    if (!gameOver && !win && !paused && !showLevelMessage) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime > 0) return prevTime - 1;
          setGameOver(true);
          return initialTime;
        });
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [gameOver, win, paused, showLevelMessage]);

  useEffect(() => {
    if (gameOver) {
      const timer = setTimeout(() => {
        handleReset();
        setPaused(false); // Auto start after game over
      }, pauseDuration); // Reset after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [gameOver]);

  useEffect(() => {
    if (showLevelMessage) {
      setCountdown(5); // Start countdown from 5
      const countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown > 1) return prevCountdown - 1;
          clearInterval(countdownInterval);
          return 0;
        });
      }, 1000);

      const timer = setTimeout(() => {
        setShowLevelMessage(false);
        setObstacles(generateObstacles(level));
        setHoles(generateHoles());
        setTimeLeft(initialTime);
      }, pauseDuration);

      return () => {
        clearInterval(countdownInterval);
        clearTimeout(timer);
      };
    }
  }, [showLevelMessage]);

  const generateObstacles = (level) => {
    const levelData = levels.find((l) => l.level === level);
    const newObstacles = [];
    levelData.obstacles.forEach((distance, index) => {
      const heightMultiplier = Math.floor(Math.random() * 2) + 1; // 1 or 2 blocks high
      newObstacles.push({
        x: canvasWidth + distance * (index + 1),
        y: canvasHeight - floorHeight - obstacleHeight * heightMultiplier,
        height: obstacleHeight * heightMultiplier,
      });
    });
    return newObstacles;
  };

  const generateHoles = () => {
    const newHoles = [];
    for (let i = 0; i < 10; i++) {
      newHoles.push({
        x: Math.random() * canvasWidth * 4 + canvasWidth,
        width: Math.random() * 20 + 30,
      });
    }
    return newHoles;
  };

  const updateGame = (ctx) => {
    if (gameOver || win || showLevelMessage) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw floor with holes
    ctx.fillStyle = '#333';
    ctx.fillRect(0, canvasHeight - floorHeight, canvasWidth, floorHeight);

    ctx.fillStyle = '#00f';
    holes.forEach((hole) => {
      ctx.fillRect(hole.x, canvasHeight - floorHeight, hole.width, floorHeight);
    });

    // Draw player
    ctx.fillStyle = 'rgb(255, 225, 0)';
    ctx.beginPath();
    ctx.arc(100 + playerDiameter / 2, playerY + playerDiameter / 2, playerDiameter / 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw GM text on player
    ctx.fillStyle = '#333';
    ctx.font = '30px Londrina Solid, Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.fillText('GM', 100 + playerDiameter / 2, playerY + playerDiameter / 2);

    // Update player position
    if (jumping) {
      setPlayerY((prevY) => Math.max(prevY - gravity * 2, canvasHeight - playerDiameter - floorHeight - jumpHeight));
    } else {
      setPlayerY((prevY) => Math.min(prevY + gravity, canvasHeight - playerDiameter - floorHeight));
    }

    // Update obstacles
    setObstacles((prevObstacles) => {
      const newObstacles = prevObstacles.map((obstacle) => ({ ...obstacle, x: obstacle.x - speed }));
      return newObstacles.filter((obstacle) => obstacle.x + obstacleWidth > 0);
    });

    // Update holes
    setHoles((prevHoles) => {
      return prevHoles.map((hole) => ({ ...hole, x: hole.x - speed }));
    });

    // Draw obstacles on top of the floor
    ctx.fillStyle = '#00f';
    obstacles.forEach((obstacle) => {
      ctx.fillRect(obstacle.x, obstacle.y, obstacleWidth, obstacle.height);
    });

    // Draw decorations and check for collision
    ctx.fillStyle = '#008000';
    setDecorationsPositions((prevDecorations) => {
      const newDecorations = prevDecorations.map((decoration) => ({ ...decoration, x: decoration.x - speed }));
      newDecorations.forEach((decoration) => {
        ctx.fillRect(decoration.x, decoration.y, 20, 40); // Simple tree representation
        if (
          100 < decoration.x + 20 && // Width of the tree
          100 + playerDiameter > decoration.x &&
          playerY < decoration.y + 40 && // Height of the tree
          playerY + playerDiameter > decoration.y
        ) {
          setGameOver(true);
        }
      });
      return newDecorations.filter((decoration) => decoration.x + 20 > 0); // Width of the tree
    });

    // Check for collisions with obstacles
    obstacles.forEach((obstacle) => {
      if (
        100 < obstacle.x + obstacleWidth &&
        100 + playerDiameter > obstacle.x &&
        playerY < obstacle.y + obstacle.height &&
        playerY + playerDiameter > obstacle.y
      ) {
        setGameOver(true);
      }
    });

    // Check for collisions with holes
    holes.forEach((hole) => {
      if (
        100 + playerDiameter > hole.x &&
        100 < hole.x + hole.width &&
        playerY + playerDiameter >= canvasHeight - floorHeight
      ) {
        setGameOver(true);
      }
    });

    // Update score
    setScore((prevScore) => prevScore + 1);

    // Check for win condition
    if (timeLeft === 0) {
      if (level < levels.length) {
        setLevel((prevLevel) => prevLevel + 1);
        setTimeLeft(initialTime);
        setObstacles([]);
        setHoles([]);
        setDecorationsPositions(decorations);
        setPlayerY(canvasHeight - playerDiameter - floorHeight);
        setShowLevelMessage(true);
      } else {
        setWin(true);
      }
    }
  };

  const handleJump = () => {
    if (!jumping) {
      setJumping(true);
      setTimeout(() => {
        setJumping(false);
      }, 300);
    }
  };

  const handlePause = () => {
    setPaused(!paused);
  };

  const handleReset = () => {
    setPlayerY(canvasHeight - playerDiameter - floorHeight);
    setObstacles([]);
    setScore(0);
    setGameOver(false);
    setTimeLeft(initialTime);
    setLevel(1);
    setWin(false);
    setShowLevelMessage(true);
    setDecorationsPositions(decorations);
    setHoles([]);
    setPaused(true); // Game starts paused
  };

  useEffect(() => {
    if (gameOver || win) {
      const timer = setTimeout(() => {
        handleReset();
        setPaused(false); // Auto start after game over
      }, 3000); // Reset after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [gameOver, win]);

  const handleInfoClick = () => {
    setShowInfo(true);
  };

  const handleInfoClose = () => {
    setShowInfo(false);
  };

  return (
    <div className="runner-game">
      <div className="runner-game-module">
        <div className="runner-game-top-container">
          <div className="runner-game-header-box">
            <h1>"MORNING RUN"</h1>
          </div>
          <div className="runner-game-info-icon-box">
            <div className="runner-game-info-icon" onClick={() => setShowInfo(true)}>
              <FontAwesomeIcon icon={faInfoCircle} />
            </div>
          </div>
        </div>

        <div className="status-container">
          <div className="status-box">
            <p className="status-label">Score</p>
            <p>{score}</p>
          </div>
          <div className="status-box">
            <p className="status-label">Level</p>
            <p>{level}/{levels.length}</p>
          </div>
          <div className="status-box">
            <p className="status-label">Time Left</p>
            <p>{timeLeft} seconds</p>
          </div>
        </div>

        {showLevelMessage ? (
          <div className="level-message">
            {win ? "You Won!" : `Level ${level}`}
            <div className="countdown">{countdown}</div>
          </div>
        ) : (
          <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight}></canvas>
        )}

        {!gameOver && !win && !showLevelMessage && (
          <div className="runner-game-controls">
            <button onClick={handleJump} disabled={gameOver || win || showLevelMessage}>Jump</button>
            <button onClick={handlePause}>
              <FontAwesomeIcon icon={paused ? faPlay : faPause} />
            </button>
          </div>
        )}

        {gameOver && <p className="game-over-message">Game Over! Resetting...</p>}
        {win && <p className="win-message">Congratulations! You won the game!</p>}
        
        {showInfo && (
          <div className="runner-game-info-screen show">
            <div className="runner-game-info-content">
              <FontAwesomeIcon icon={faCircleXmark} className="runner-game-info-close" onClick={handleInfoClose} />
              <h2>Information</h2>
              <p>This is the information screen for the Morning Run game module.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

