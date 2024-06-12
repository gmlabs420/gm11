import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay, faRotateLeft, faWandMagicSparkles, faInfoCircle, faCircleXmark, faSun, faMoon, faClock, faStopwatch, faPencil, faCircleExclamation, faList, faMedal, faBroom } from '@fortawesome/free-solid-svg-icons';
import html2canvas from 'html2canvas';

const canvasWidth = 400;
const canvasHeight = 400;

const numberColors = {
  1: '#FFB6C1', // LightPink
  2: '#FFD700', // LightGoldenrodYellow
  3: '#98FB98', // PaleGreen
  4: '#87CEFA', // LightSkyBlue
  5: '#FF69B4', // HotPink
  6: '#FFA07A', // LightSalmon
  7: '#DA70D6', // Orchid
  8: '#40E0D0', // Turquoise
  9: '#FF8C00'  // DarkOrange
};

const generateCompleteBoard = () => {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));
  const isValid = (board, row, col, num) => {
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num || board[x][col] === num ||
        board[3 * Math.floor(row / 3) + Math.floor(x / 3)][3 * Math.floor(col / 3) + x % 3] === num) {
        return false;
      }
    }
    return true;
  };

  const solveBoard = (board) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (solveBoard(board)) {
                return true;
              } else {
                board[row][col] = 0;
              }
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  solveBoard(board);
  return board;
};

const createPlayableBoard = (completeBoard, difficulty) => {
  const playableBoard = completeBoard.map(row => row.slice());
  let squaresToRemove = Math.floor((81 * difficulty) / 100);
  while (squaresToRemove > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (playableBoard[row][col] !== 0) {
      playableBoard[row][col] = 0;
      squaresToRemove--;
    }
  }
  return playableBoard;
};

const calculateTimeInSeconds = (time) => {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const addTime = (currentTime, additionalSeconds) => {
  const currentSeconds = calculateTimeInSeconds(currentTime);
  const totalSeconds = currentSeconds + additionalSeconds;
  return formatTime(totalSeconds);
};

export default function SunriseSudoku() {
  const canvasRef = useRef(null);
  const [difficulty, setDifficulty] = useState(50);
  const [completeBoard, setCompleteBoard] = useState(generateCompleteBoard());
  const [initialBoard, setInitialBoard] = useState(createPlayableBoard(completeBoard, difficulty));
  const [board, setBoard] = useState(initialBoard);
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null });
  const [hoveredCell, setHoveredCell] = useState({ row: null, col: null });
  const [timer, setTimer] = useState(600);
  const [timerUp, setTimerUp] = useState(0);
  const [pausedDown, setPausedDown] = useState(true);
  const [pausedUp, setPausedUp] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [gameEnd, setGameEnd] = useState(false); // Added gameEnd state
  const [history, setHistory] = useState([initialBoard]);
  const [showInfo, setShowInfo] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [personalStats, setPersonalStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    points: 0,
    totalTimeSpentPlaying: '00:00:00',
    gamesCompletedWithoutHints: 0,
    fastestCompletionTime: 'N/A',
    totalHintsUsed: 0,
    gamesCompletedUnder5Minutes: 0,
    gamesCompletedUnder10Minutes: 0,
    gamesCompletedOver10Minutes: 0,
    totalMovesMade: 0,
    averageMovesPerGame: 0,
    longestWinningStreak: 0,
    currentWinningStreak: 0,
    perfectGames: 0,
    averagePointsPerGame: 0,
    averageCompletionTime: 'N/A'
  });
  const [activeModule, setActiveModule] = useState('attestation');
  const [darkMode, setDarkMode] = useState(false);
  const [showAttestationModal, setShowAttestationModal] = useState(false);
  const [currentAttestation, setCurrentAttestation] = useState(null);
  const [pencilMode, setPencilMode] = useState(false);
  const [notes, setNotes] = useState({});
  const [logs, setLogs] = useState([]);
  const cellSize = 40;
  const gridSize = cellSize * 9;
  const offsetX = (canvasWidth - gridSize) / 2;
  const offsetY = (canvasHeight - gridSize) / 2;

  const achievementsList = [
    { id: 1, description: "First Move", points: 10, icon: "🎉" },
    { id: 2, description: "First Row Completed", points: 50, icon: "✅" },
    { id: 3, description: "First Column Completed", points: 50, icon: "✅" },
    { id: 4, description: "First 3x3 Block Completed", points: 50, icon: "🟩" },
    { id: 5, description: "No Hints Used", points: 100, icon: "🙌" },
    { id: 6, description: "Fast Finish", points: 200, icon: "⏱️" },
    { id: 7, description: "Perfect Game", points: 500, icon: "🏆" },
    { id: 8, description: "Persistent Player", points: 150, icon: "📅" },
    { id: 9, description: "Master of Sudoku", points: 1000, icon: "🧠" },
    { id: 10, description: "Double Trouble", points: 300, icon: "🔄" }
  ];

  const unlockAchievement = (achievementId) => {
    const achievement = achievementsList.find(a => a.id === achievementId);
    if (achievement && !achievements.includes(achievement)) {
      setAchievements(prev => [...prev, achievement]);
      setPersonalStats(prev => ({ ...prev, points: prev.points + achievement.points }));
      flashAchievement(achievement);
    }
  };

  const flashAchievement = (achievement) => {
    toast.success(
      <>
        <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{achievement.description} {achievement.icon}</div>
        <div>+{achievement.points} points</div>
      </>,
      {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
  };

  const logAction = (action) => {
    const logEntry = {
      type: action,
      time: new Date().toLocaleString(),
      points: personalStats.points
    };
    setLogs((prev) => [...prev, logEntry]); // Update logs state
  };

  const updateStatsOnGameEnd = (isWin, completionTime, hintsUsed, movesMade) => {
    setPersonalStats(prev => {
      const newGamesPlayed = prev.gamesPlayed + 1;
      const newGamesWon = isWin ? prev.gamesWon + 1 : prev.gamesWon;
      const newGamesLost = isWin ? prev.gamesLost : prev.gamesLost + 1;
      const newTotalPoints = prev.totalPoints + calculatePoints(isWin, completionTime, hintsUsed);
      const newAveragePointsPerGame = newTotalPoints / newGamesPlayed;
      const newCurrentWinningStreak = isWin ? prev.currentWinningStreak + 1 : 0;
      const newLongestWinningStreak = Math.max(prev.longestWinningStreak, newCurrentWinningStreak);
      const newPerfectGames = (isWin && hintsUsed === 0 && movesMade === 81) ? prev.perfectGames + 1 : prev.perfectGames;
      const newGamesCompletedWithoutHints = (isWin && hintsUsed === 0) ? prev.gamesCompletedWithoutHints + 1 : prev.gamesCompletedWithoutHints;
      const newTotalHintsUsed = prev.totalHintsUsed + hintsUsed;
      const newGamesCompletedUnder5Minutes = (isWin && completionTime <= 300) ? prev.gamesCompletedUnder5Minutes + 1 : prev.gamesCompletedUnder5Minutes;
      const newGamesCompletedUnder10Minutes = (isWin && completionTime > 300 && completionTime <= 600) ? prev.gamesCompletedUnder10Minutes + 1 : prev.gamesCompletedUnder10Minutes;
      const newGamesCompletedOver10Minutes = (isWin && completionTime > 600) ? prev.gamesCompletedOver10Minutes + 1 : prev.gamesCompletedOver10Minutes;
      const newTotalTimeSpentPlaying = addTime(prev.totalTimeSpentPlaying, completionTime);
      const newAverageTimePerMove = calculateAverageTimePerMove(newTotalTimeSpentPlaying, prev.totalMovesMade + movesMade);
      const newTotalMovesMade = prev.totalMovesMade + movesMade;
      const newAverageMovesPerGame = newTotalMovesMade / newGamesPlayed;

      return {
        ...prev,
        gamesPlayed: newGamesPlayed,
        gamesWon: newGamesWon,
        gamesLost: newGamesLost,
        totalPoints: newTotalPoints,
        averagePointsPerGame: newAveragePointsPerGame,
        fastestCompletionTime: isWin && (prev.fastestCompletionTime === 'N/A' || completionTime < calculateTimeInSeconds(prev.fastestCompletionTime)) ? formatTime(completionTime) : prev.fastestCompletionTime,
        averageCompletionTime: calculateAverageCompletionTime(newTotalTimeSpentPlaying, newGamesPlayed),
        longestWinningStreak: newLongestWinningStreak,
        currentWinningStreak: newCurrentWinningStreak,
        perfectGames: newPerfectGames,
        gamesCompletedWithoutHints: newGamesCompletedWithoutHints,
        totalHintsUsed: newTotalHintsUsed,
        gamesCompletedUnder5Minutes: newGamesCompletedUnder5Minutes,
        gamesCompletedUnder10Minutes: newGamesCompletedUnder10Minutes,
        gamesCompletedOver10Minutes: newGamesCompletedOver10Minutes,
        totalTimeSpentPlaying: newTotalTimeSpentPlaying,
        averageTimePerMove: newAverageTimePerMove,
        totalMovesMade: newTotalMovesMade,
        averageMovesPerGame: newAverageMovesPerGame
      };
    });
  };

  const calculatePoints = (isWin, completionTime, hintsUsed) => {
    let points = isWin ? 1000 : 0;
    points -= hintsUsed * 10;
    points -= completionTime;
    return Math.max(points, 0);
  };

  const calculateAverageTimePerMove = (totalTimeSpentPlaying, totalMovesMade) => {
    const totalSeconds = calculateTimeInSeconds(totalTimeSpentPlaying);
    return formatTime(Math.floor(totalSeconds / totalMovesMade));
  };

  const calculateAverageCompletionTime = (totalTimeSpentPlaying, gamesPlayed) => {
    const totalSeconds = calculateTimeInSeconds(totalTimeSpentPlaying);
    return formatTime(Math.floor(totalSeconds / gamesPlayed));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      drawBoard(ctx);
    }
  }, [board, selectedCell, hoveredCell, notes]);

  useEffect(() => {
    let interval;
    if (!pausedDown) {
        interval = setInterval(() => {
            setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 0.01 : 0));
        }, 100); // Update every 10 milliseconds
    }
    return () => clearInterval(interval);
}, [pausedDown]);

useEffect(() => {
    let timerId;
    if (!pausedUp) {
        timerId = setInterval(() => {
            setTimerUp((prevTimerUp) => prevTimerUp + 1);
        }, 1000); // Update every 1 second
    }
    return () => clearInterval(timerId);
}, [pausedUp]);

useEffect(() => {
    if (gameOver) {
        setPausedUp(true);
        setPausedDown(true);
    }
}, [gameOver]);



  useEffect(() => {
    const progressElement = document.querySelector('.sunrise-progress-down');
    if (progressElement) {
      const totalSeconds = Math.floor(timer);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const milliseconds = Math.floor((timer - totalSeconds) * 100);

      // Choose which units to display
      const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const displaySeconds = seconds < 10 ? `0${seconds}` : seconds;
      const displayMilliseconds = milliseconds < 10 ? `0${milliseconds}` : milliseconds;

      progressElement.textContent = `${displayMinutes}:${displaySeconds}:${displayMilliseconds}`;
      progressElement.style.width = `${((600 - timer) / 600) * 100}%`;
    }
  }, [timer]);

  useEffect(() => {
    const progressElementUp = document.querySelector('.sunrise-progress-up');
    if (progressElementUp) {
      const totalSeconds = Math.floor(timerUp / 100);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);
      const remainingMinutes = totalMinutes % 60;
      const remainingSeconds = totalSeconds % 60;

      // Format and display the time
      const displayHours = String(totalHours).padStart(2, '0');
      const displayMinutes = String(remainingMinutes).padStart(2, '0');
      const displaySeconds = String(remainingSeconds).padStart(2, '0');

      progressElementUp.textContent = `${displayHours}:${displayMinutes}:${displaySeconds}`;
      progressElementUp.style.width = `${(timerUp / (60 * 60 * 100)) * 100}%`;
    }
  }, [timerUp]);

  const drawBoard = (ctx) => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = darkMode ? "#333" : "#fff";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.strokeStyle = darkMode ? "#fff" : "#333";
    ctx.lineWidth = 10;
    ctx.strokeRect(offsetX, offsetY, gridSize, gridSize);

    ctx.lineWidth = 3;
    for (let row = 0; row <= 9; row += 3) {
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY + row * cellSize);
      ctx.lineTo(offsetX + gridSize, offsetY + row * cellSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(offsetX + row * cellSize, offsetY);
      ctx.lineTo(offsetX + row * cellSize, offsetY + gridSize);
      ctx.stroke();
    }

    ctx.lineWidth = 1;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const x = col * cellSize + offsetX;
        const y = row * cellSize + offsetY;

        if ((row % 3 !== 0 || col % 3 !== 0) || row === 0 || col === 0) {
          ctx.strokeRect(x, y, cellSize, cellSize);
        }

        const value = board[row][col];
        if (value !== 0) {
          ctx.fillStyle = numberColors[value] || "#fff";
          ctx.fillRect(x, y, cellSize, cellSize);

          ctx.font = "20px Londrina";
          ctx.fillStyle = darkMode ? "#fff" : "#333";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(value, x + cellSize / 2, y + cellSize / 2);
        }
        if (hoveredCell.row === row && hoveredCell.col === col) {
          ctx.fillStyle = "rgba(255, 154, 75, 0.5)";
          ctx.fillRect(x, y, cellSize, cellSize);
        }
        if (selectedCell.row === row && selectedCell.col === col) {
          ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
          ctx.fillRect(x, y, cellSize, cellSize);
        }

        // Draw pencil notes
        if (notes[`${row}-${col}`]) {
          ctx.font = "10px Londrina";
          ctx.fillStyle = darkMode ? "#ccc" : "#666";
          ctx.textAlign = "left";
          ctx.textBaseline = "top";
          ctx.fillText(notes[`${row}-${col}`].join(','), x + 2, y + 2);
        }
      }
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor((x - offsetX) / cellSize);
    const row = Math.floor((y - offsetY) / cellSize);
    setHoveredCell({ row, col });
  };

  const handleMouseClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor((x - offsetX) / cellSize);
    const row = Math.floor((y - offsetY) / cellSize);
    setSelectedCell({ row, col });
    logAction(`Cell (${row}, ${col}) Selected`);
  };

  const handleKeyDown = (e) => {
    if (selectedCell.row !== null && selectedCell.col !== null) {
      const value = parseInt(e.key);
      const cellKey = `${selectedCell.row}-${selectedCell.col}`;
      if (value >= 1 && value <= 9) {
        logAction(`Number ${value} Entered in Cell (${selectedCell.row}, ${selectedCell.col})`);
        if (pencilMode) {
          setNotes((prevNotes) => {
            const newNotes = { ...prevNotes };
            if (!newNotes[cellKey]) {
              newNotes[cellKey] = [];
            }
            if (newNotes[cellKey].includes(value)) {
              newNotes[cellKey] = newNotes[cellKey].filter((note) => note !== value);
            } else {
              newNotes[cellKey].push(value);
            }
            return newNotes;
          });
        } else {
          setNotes((prevNotes) => {
            const newNotes = { ...prevNotes };
            delete newNotes[cellKey];
            return newNotes;
          });
          const newBoard = board.map((row, rIdx) => row.map((cell, cIdx) => {
            if (rIdx === selectedCell.row && cIdx === selectedCell.col) {
              if (initialBoard[rIdx][cIdx] === 0) {
                return value;
              }
            }
            return cell;
          }));
          setBoard(newBoard);
          setHistory((prevHistory) => [...prevHistory, newBoard]);
        }
      }
    }
  };

  const handlePauseDown = () => {
    if (pausedDown) {
        logAction('Down Timer Started');
    } else {
        logAction('Down Timer Paused');
    }

    setPausedDown(!pausedDown);
};

const handlePauseUp = () => {
    if (pausedUp) {
        logAction('Up Timer Started');
    } else {
        logAction('Up Timer Paused');
    }

    setPausedUp(!pausedUp);
};

  const handleReset = () => {
    if (!pausedDown || !pausedUp || userInteracted) {
      logAction('Game Reset');
      setGameEnd(true); // Show the game end screen
  
      setTimeout(() => {
        setGameEnd(false); // Hide the game end screen after 2 seconds
        setupNewBoard(); // Reset the board state
        setPausedDown(false); // Auto-start the down timer
        setPausedUp(false); // Auto-start the up timer
        setShowAttestationModal(true); // Show the attestation modal
        setCurrentAttestation({
          type: 'end',
          time: new Date().toLocaleString(),
          points: personalStats.points,
          difficulty,
          timer,
          timerUp,
          boardImage: null,
          minted: false
        });
      }, 2000);
    } else {
      // Logic if the game has not been started or no interactions were made
    }
  };


  const handleMagic = () => {
    if (history.length > 1) {
      logAction('Magic Wand Used (Undo)');
      setHistory((prevHistory) => {
        const newHistory = prevHistory.slice(0, -1);
        setBoard(newHistory[newHistory.length - 1]);
        return newHistory;
      });
    }
  };

  const captureGameBoard = async () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const canvasImage = await html2canvas(canvas);
      return canvasImage.toDataURL();
    }
    return null;
  };

  const setupNewBoard = () => {
    const newCompleteBoard = generateCompleteBoard();
    const newPlayableBoard = createPlayableBoard(newCompleteBoard, difficulty);
    setCompleteBoard(newCompleteBoard);
    setInitialBoard(newPlayableBoard);
    setBoard(newPlayableBoard);
    setSelectedCell({ row: null, col: null });
    setTimer(600);
    setTimerUp(0);
    setPausedDown(true);
    setPausedUp(true);
    setGameOver(false);
    setHistory([newPlayableBoard]);
    setNotes(Array.from({ length: 9 }, () => Array(9).fill([])));
  };

  const handleNewBoard = async () => {
    logAction('New Board Generated');
    const boardImage = await captureGameBoard();
    setShowAttestationModal(true);
    setCurrentAttestation({
      type: 'end',
      time: new Date().toLocaleString(),
      points: personalStats.points,
      difficulty,
      timer,
      timerUp,
      boardImage,
      minted: false
    });
  };

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
    logAction(`Difficulty Changed to ${e.target.value}`);
  };

  const handleInfoClose = () => {
    logAction('Info Screen Closed');
    setShowInfo(false);
  };

  const handleDarkModeToggle = () => {
    logAction('Dark Mode Toggled');
    setDarkMode(!darkMode);
  };

  const closeModal = () => {
    setShowAttestationModal(false);
    setCurrentAttestation(null);
  };

 
  const logAttestation = (attestation) => {
    logAction('Attestation Logged');
    setAchievements((prev) => [...prev, attestation]);
    setShowAttestationModal(false); // Close the modal
    setCurrentAttestation(null);
  };

  const togglePencilMode = () => {
    setPencilMode(!pencilMode);
    logAction(`Pencil Mode ${pencilMode ? 'Disabled' : 'Enabled'}`);
  };

  const clearLog = () => {
    setLogs([]);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCell, board, pencilMode]);

  return (





    <div className={`sundoku-game-module ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="sundoku-game-container">
        <div className="sundoku-game-left sundoku-machine">
          <div className="sundoku-game-top-container">
            <div className="sundoku-game-header-box">
              <h1>"SUNDOKU"</h1>
            </div>
            <div className="sundoku-game-info-icon-box">
              <div className="sundoku-game-info-icon" onClick={() => setShowInfo(true)}>
                <FontAwesomeIcon icon={faInfoCircle} />
              </div>
              <div className="sundoku-game-dark-mode-icon" onClick={handleDarkModeToggle}>
                <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
              </div>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            className="sundoku-game-canvas"
            width={canvasWidth}
            height={canvasHeight}
            onMouseMove={handleMouseMove}
            onClick={handleMouseClick}
          ></canvas>

          {gameOver && (
            <div className="sundoku-game-over-screen">
              <div className="sundoku-game-over-message">Game Over! Time's up!</div>
            </div>
          )}
          
          {gameEnd && (
            <div className="sundoku-game-end-screen">
              <div className="sundoku-game-end-message">Game Ended!</div>
            </div>
          )}
          
          {showAttestationModal && (
            <div className="attestation-modal">
              <div className="attestation-modal-content">
                <h2>Attestation</h2>
                <p>Type: {currentAttestation.type}</p>
                <p>Time: {currentAttestation.time}</p>
                <p>Points: {currentAttestation.points}</p>
                <p>Difficulty: {currentAttestation.difficulty}</p>
                <p>Timer: {currentAttestation.timer}</p>
                <p>Timer Up: {currentAttestation.timerUp}</p>
                <button onClick={() => logAttestation(currentAttestation)}>Log</button>
                <FontAwesomeIcon icon={faCircleXmark} className="close-modal-icon" onClick={() => {
                  setShowAttestationModal(false);
                  setCurrentAttestation(null);
                }} />
              </div>
            </div>
          )}

          <div className="sundoku-controls-row">
            <div className="sundoku-controls-container">
              <button onClick={handlePauseDown} className="pause-button">
                <FontAwesomeIcon icon={pausedDown ? faStopwatch : faPause} />
              </button>
              <div className="sunrise-timer">
                <div className="sunrise-progress-down">
                  <span>{`${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, "0")}`}</span>
                </div>
              </div>
            </div>

            <div className="sundoku-controls-container">
              <button onClick={handlePauseUp} className="pause-button">
                <FontAwesomeIcon icon={pausedUp ? faClock : faPause} />
              </button>
              <div className="sunrise-timer">
                <div className="sunrise-progress-up">
                  <span>{`${Math.floor(timerUp / 60)}:${String(timerUp % 60).padStart(2, "0")}`}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="sundoku-game-controls">
            <button onClick={togglePencilMode} className={`notes-button ${pencilMode ? 'active' : ''}`}>
              <FontAwesomeIcon icon={faPencil} />
            </button>
            <button onClick={handleMagic}>
              <FontAwesomeIcon icon={faWandMagicSparkles} />
            </button>

            <div className="sundoku-controls-container">
              <div className="sundoku-difficulty-box">
                <label>Easy</label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={difficulty}
                  className="difficulty-slider"
                  onChange={handleDifficultyChange}
                />
                <label>Hard</label>
              </div>
            </div>

            <button onClick={handleNewBoard} className="new-board-button">
              <FontAwesomeIcon icon={faRotateLeft} />
            </button>
          </div>

          {gameOver && (
            <div className="sundoku-game-over-screen">
              <div className="sundoku-game-over-message">Game Over! Time's up!</div>
              <button onClick={handleReset} className="play-again-button">
                Play Again
              </button>
            </div>
          )}
          {showInfo && (
            <div className="sundoku-game-info-screen show">
              <div className="sundoku-game-info-content">
                <FontAwesomeIcon icon={faCircleXmark} className="sundoku-game-info-close" onClick={handleInfoClose} />
                <h2>Information</h2>
                <p>This is the information screen for the Sunrise Sudoku game module.</p>
              </div>
            </div>
          )}
        </div>








        <div className="sundoku-game-right sundoku-machine2">
          <div className="sundoku-toggle-container">
            <label className="sundoku-toggle-switch">
              <input
                type="checkbox"
                checked={activeModule === 'leaderboard'}
                onChange={() => setActiveModule(activeModule === 'attestation' ? 'leaderboard' : 'attestation')}
              />
              <span className="sundoku-toggle-slider">
                <FontAwesomeIcon 
                  icon={activeModule === 'attestation' ? faCircleExclamation : faMedal} 
                  className="toggle-icon" 
                />
              </span>
            </label>
          </div>

          <div className="sundoku-game-module-content">
            {activeModule === 'attestation' ? (
              <div className="sundoku-attestation-module">
                <div className="sundoku-attestation-module-top">
                  <h3>Sundoku Attestation Mint Station</h3>
                </div>
                <div className="sundoku-attestation-module-cards">
                  {achievements.length === 0 ? (
                    <p>No attestations yet.</p>
                  ) : (
                    achievements.map((achievement, index) => (
                      <div key={index} className="sundoku-attestation-card">
                        <p>Type: {achievement.type}</p>
                        <p>Time: {achievement.time}</p>
                        <p>Points: {achievement.points}</p>
                        <p>Difficulty: {achievement.difficulty}</p>
                        <p>Timer: {achievement.timer}</p>
                        <p>Timer Up: {achievement.timerUp}</p>
                        {!achievement.minted && <button onClick={() => mintAttestation(achievement)}>Mint</button>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="sundoku-leaderboard">
                <div className="sundoku-attestation-module-top">
                  <h3>Leaderboard</h3>
                </div>
                {/* Add your leaderboard content here */}
              </div>
            )}
          </div>

          <div className="sundoku-log-container">
            <div className="sundoku-log-container-top">
            
              <h3>Log</h3>


              <button onClick={clearLog} className="log-mint-button">
                Mint
              </button>

              <button onClick={clearLog} className="broom-icon" >
              <FontAwesomeIcon icon={faBroom} />
              </button>


              


            </div>
            <div className="sundoku-game-log sundoku-recessed-field-log">
              <ul>
                {logs.length === 0 ? (
                  <li>No log entries yet.</li>
                ) : (
                  logs.slice().reverse().map((log, index) => (
                    <li key={index}>
                      {log.type} - {log.time} - Points: {log.points} - Difficulty: {log.difficulty} - 
                      Timer Down: {log.timerDown}s - Timer Up: {log.timerUp}s 
                      {log.row !== undefined && log.col !== undefined ? ` - Cell: (${log.row}, ${log.col})` : ''} 
                      {log.interaction ? ` - Interaction: ${log.interaction}` : ''} 
                      {log.gameStatus ? ` - Status: ${log.gameStatus}` : ''}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>








        </div>
        <div className="sundoku-game-right sundoku-machine3">
          {/* Content for the new third module */}
          <div className="sundoku-toggle-container">
            <label className="sundoku-toggle-switch">
              <input
                type="checkbox"
                checked={activeModule === 'newModule'}
                onChange={() => setActiveModule(activeModule === 'newModule' ? 'leaderboard' : 'newModule')}
              />
              <span className="sundoku-toggle-slider">
                <FontAwesomeIcon 
                  icon={activeModule === 'newModule' ? faList : faMedal} 
                  className="toggle-icon" 
                />
              </span>
            </label>
          </div>

          <div className="sundoku-game-module-content">
            {activeModule === 'newModule' ? (
              <div className="sundoku-new-module">
                <div className="sundoku-attestation-module-top">
                  <h3>New Module Content</h3>
                </div>
                <div className="sundoku-attestation-module-cards">
                  {/* Add new module content here */}
                </div>
              </div>
            ) : (
              <div className="sundoku-leaderboard">
                <div className="sundoku-attestation-module-top">
                  <h3>Leaderboard</h3>
                </div>
                {/* Add your leaderboard content here */}
              </div>
            )}
          </div>
          <div className="sundoku-game-stats-achievements">
            <div className="sundoku-game-stats sundoku-recessed-field">
              <div className="sundoku-recessed-field-content">
                <h3>Statistics</h3>
                <p>Games Played: {personalStats.gamesPlayed}</p>
                <p>Games Won: {personalStats.gamesWon}</p>
                <p>Points: {personalStats.points}</p>
                <p>Total Time Spent Playing: {personalStats.totalTimeSpentPlaying}</p>
                <p>Games Completed Without Hints: {personalStats.gamesCompletedWithoutHints}</p>
                <p>Fastest Completion Time: {personalStats.fastestCompletionTime}</p>
                <p>Total Hints Used: {personalStats.totalHintsUsed}</p>
                <p>Games Completed Under 5 Minutes: {personalStats.gamesCompletedUnder5Minutes}</p>
                <p>Games Completed Under 10 Minutes: {personalStats.gamesCompletedUnder10Minutes}</p>
                <p>Games Completed Over 10 Minutes: {personalStats.gamesCompletedOver10Minutes}</p>
                <p>Average Time Per Move: {personalStats.averageTimePerMove}</p>
                <p>Total Moves Made: {personalStats.totalMovesMade}</p>
                <p>Average Moves Per Game: {personalStats.averageMovesPerGame}</p>
                <p>Longest Winning Streak: {personalStats.longestWinningStreak}</p>
                <p>Current Winning Streak: {personalStats.currentWinningStreak}</p>
                <p>Perfect Games: {personalStats.perfectGames}</p>
                <p>Average Points Per Game: {personalStats.averagePointsPerGame}</p>
                <p>Average Completion Time: {personalStats.averageCompletionTime}</p>
              </div>
              <button className="pinned-button">Mint</button>
            </div>

            <div className="sundoku-game-achievements sundoku-recessed-field2">
              <div className="sundoku-recessed-field-content">
                <h3>Achievements</h3>
               
              </div>
              <button className="pinned-button">Mint</button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

