"use client";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay, faInfoCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

const canvasWidth = 375;
const canvasHeight = 375;
const playerDiameter = 50;
const bulletSize = 20; // Size of the GM circle bullets
const playerSpeed = 10;
const bulletSpeed = 5;
const obstacleSpeed = 2;
const gameDuration = 30; // 30 seconds game duration
const pauseDuration = 3000; // 3 seconds pause between levels

type Bullet = {
  x: number;
  y: number;
  size: number;
};

type Obstacle = {
  x: number;
  y: number;
  width: number;
  height: number;
  points: number;
  hit: boolean; // New property to track if obstacle is hit
};

type PlayerPosition = {
  x: number;
  y: number;
};

export default function SpaceInvadersGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerPosition, setPlayerPosition] = useState<PlayerPosition>({ x: canvasWidth / 2 - playerDiameter / 2, y: canvasHeight - playerDiameter });
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(gameDuration);
  const [paused, setPaused] = useState(true); // Game starts paused
  const [showInfo, setShowInfo] = useState(false); // Info screen state

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const intervalId = setInterval(() => {
        if (!paused) {
          updateGame(ctx);
        }
      }, 20);

      return () => clearInterval(intervalId);
    }
  }, [playerPosition, bullets, obstacles, gameOver, paused]);

  useEffect(() => {
    if (!gameOver && !paused) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime > 0) return prevTime - 1;
          setGameOver(true);
          return gameDuration;
        });
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [gameOver, paused]);

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
    generateObstacles(); // Ensure obstacles are generated on the first load
  }, []);

  const generateObstacles = () => {
    const newObstacles = [];
    const obstacleCount = 50; // 50 obstacles
    for (let i = 0; i < obstacleCount; i++) {
      newObstacles.push({
        x: Math.random() * (canvasWidth - playerDiameter),
        y: -Math.random() * canvasHeight * 2,
        width: playerDiameter,
        height: playerDiameter,
        points: Math.floor(Math.random() * 10) + 1,
        hit: false, // Initially not hit
      });
    }
    setObstacles(newObstacles);
  };

  const updateGame = (ctx: CanvasRenderingContext2D | null) => {
    if (gameOver || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw player as a circle
    ctx.fillStyle = 'rgb(255, 225, 0)';
    ctx.beginPath();
    ctx.arc(playerPosition.x + playerDiameter / 2, playerPosition.y + playerDiameter / 2, playerDiameter / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw GM text on player
    ctx.fillStyle = '#333';
    ctx.font = '20px Londrina';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GM', playerPosition.x + playerDiameter / 2, playerPosition.y + playerDiameter / 2);

    // Draw bullets
    ctx.fillStyle = 'yellow';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    setBullets((prevBullets) => {
      const newBullets = prevBullets.map((bullet) => ({
        ...bullet,
        y: bullet.y - bulletSpeed,
      })).filter(bullet => bullet.y > 0);

      newBullets.forEach((bullet) => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'black'; // Change the GM text color to black
        ctx.font = '10px Londrina';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('GM', bullet.x, bullet.y);
      });

      return newBullets;
    });

    // Update obstacles
    const updatedObstacles = obstacles.map((obstacle) => ({
      ...obstacle,
      y: obstacle.y + obstacleSpeed,
    }));

    // Draw obstacles
    updatedObstacles.forEach((obstacle) => {
      if (!obstacle.hit) {
        ctx.fillStyle = 'red';
      } else {
        ctx.fillStyle = 'green';
      }
      ctx.beginPath();
      ctx.arc(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2, obstacle.width / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'black';
      ctx.font = '14px Londrina';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('FUD', obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2);
    });

    setObstacles(updatedObstacles.filter(obstacle => obstacle.y < canvasHeight && !obstacle.hit)); // Remove hit obstacles

    // Check for bullet-obstacle collisions
    setBullets((prevBullets) => {
      const remainingBullets = prevBullets.filter((bullet) => {
        let hit = false;
        setObstacles((prevObstacles) => {
          const remainingObstacles = prevObstacles.map((obstacle) => {
            if (
              bullet.x - bullet.size / 2 < obstacle.x + obstacle.width &&
              bullet.x + bullet.size / 2 > obstacle.x &&
              bullet.y - bullet.size / 2 < obstacle.y + obstacle.height &&
              bullet.y + bullet.size / 2 > obstacle.y
            ) {
              hit = true;
              setScore((prevScore) => prevScore + obstacle.points);
              return { ...obstacle, hit: true }; // Mark obstacle as hit
            }
            return obstacle;
          });
          return remainingObstacles;
        });
        return !hit;
      });
      return remainingBullets;
    });

    // Check for player-obstacle collisions
    obstacles.forEach((obstacle) => {
      if (
        playerPosition.x < obstacle.x + obstacle.width &&
        playerPosition.x + playerDiameter > obstacle.x &&
        playerPosition.y < obstacle.y + obstacle.height &&
        playerPosition.y + playerDiameter > obstacle.y &&
        !obstacle.hit
      ) {
        setGameOver(true);
      }
    });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === "ArrowLeft" && playerPosition.x > 0) {
      setPlayerPosition((prevPosition) => ({
        ...prevPosition,
        x: prevPosition.x - playerSpeed,
      }));
    } else if (e.code === "ArrowRight" && playerPosition.x < canvasWidth - playerDiameter) {
      setPlayerPosition((prevPosition) => ({
        ...prevPosition,
        x: prevPosition.x + playerSpeed,
      }));
    } else if (e.code === "Space") {
      e.preventDefault(); // Prevent scrolling when space is pressed
      shoot();
    }
  };

  const shoot = () => {
    setBullets((prevBullets) => [
      ...prevBullets,
      {
        x: playerPosition.x + playerDiameter / 2,
        y: playerPosition.y,
        size: bulletSize,
      },
    ]);
  };

  const handlePause = () => {
    setPaused(!paused);
  };

  const handleReset = () => {
    setPlayerPosition({ x: canvasWidth / 2 - playerDiameter / 2, y: canvasHeight - playerDiameter });
    setBullets([]);
    setObstacles([]);
    setScore(0);
    setGameOver(false);
    setTimeLeft(gameDuration);
    setPaused(true); // Game starts paused
    generateObstacles();
  };

  useEffect(() => {
    window.addEventListener   
    ("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [playerPosition]);

  useEffect(() => {
    // Generate obstacles throughout the game duration
    if (!paused) {
      const obstacleInterval = setInterval(() => {
        setObstacles((prevObstacles) => [
          ...prevObstacles,
          {
            x: Math.random() * (canvasWidth - playerDiameter),
            y: -Math.random() * canvasHeight,
            width: playerDiameter,
            height: playerDiameter,
            points: Math.floor(Math.random() * 10) + 1,
            hit: false,
          },
        ]);
      }, 1000); // Adjust the interval as needed

      return () => clearInterval(obstacleInterval);
    }
  }, [paused]);

  const handleInfoClose = () => {
    setShowInfo(false);
  };

  return (
    <div className="shooting-game">
      <div className="shooting-game-module">
        <div className="shooting-game-top-container">
          <div className="shooting-game-header-box">
            <h1>"FUD INVADERS"</h1>
          </div>
          <div className="shooting-game-info-icon-box">
            <div className="shooting-game-info-icon" onClick={() => setShowInfo(true)}>
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
            <p className="status-label">Time Left</p>
            <p>{timeLeft} seconds</p>
          </div>
        </div>

        {gameOver && (
          <div className="game-over-screen">
            <div className="game-over-message">
              Game Over!
            </div>
            <div className="final-score">
              {`Score: ${score}`}
            </div>
          </div>
        )}
        <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight}></canvas>
        {!gameOver && (
          <h4 className="instructions">Arrows move. Spacebar shoots. </h4>
        )}
        {!gameOver && (
          <div className="shooting-game-controls">
            <button onClick={handlePause}>
              <FontAwesomeIcon icon={paused ? faPlay : faPause} />
            </button>
          </div>
        )}
        
        {showInfo && (
          <div className="shooting-game-info-screen show">
            <div className="shooting-game-info-content">
              <FontAwesomeIcon icon={faCircleXmark} className="shooting-game-info-close" onClick={handleInfoClose} />
              <h2>Information</h2>
              <p>This is the information screen for the FUD Invaders game module.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}