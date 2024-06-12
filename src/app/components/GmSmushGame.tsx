"use client";
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay, faRotateLeft } from '@fortawesome/free-solid-svg-icons';

// Tile data including bonuses and info
const tileArray = [
    { name: 'Small GM', symbol: '🔵' },
    { name: 'Medium GM', symbol: '🟢' },
    { name: 'Large GM', symbol: '🟡' },
    { name: 'Rare GM', symbol: '🔴' },
    { name: 'Bonus GM', symbol: '🟣' },
    { name: 'Power GM', symbol: 'GM' }
];

const generateRandomTile = () => {
    return tileArray[Math.floor(Math.random() * tileArray.length)];
};

const initialBoard = () => {
    const board = [];
    for (let i = 0; i < 36; i++) {
        board.push(generateRandomTile());
    }
    return board;
};

const getAdjacentIndices = (index) => {
    const adjacent = [];
    if (index % 6 !== 0) adjacent.push(index - 1); // Left
    if (index % 6 !== 5) adjacent.push(index + 1); // Right
    if (index > 5) adjacent.push(index - 6); // Up
    if (index < 30) adjacent.push(index + 6); // Down
    return adjacent;
};

const swapTiles = (board, index1, index2) => {
    const newBoard = [...board];
    [newBoard[index1], newBoard[index2]] = [newBoard[index2], newBoard[index1]];
    return newBoard;
};

const findMatches = (board) => {
    const matches = [];
    for (let i = 0; i < board.length; i++) {
        const horizontalMatch = [i];
        const verticalMatch = [i];
        for (let j = 1; j < 3; j++) {
            if (board[i + j] && board[i + j].symbol === board[i].symbol && (i % 6) + j < 6) {
                horizontalMatch.push(i + j);
            }
            if (board[i + j * 6] && board[i + j * 6].symbol === board[i].symbol && i + j * 6 < 36) {
                verticalMatch.push(i + j * 6);
            }
        }
        if (horizontalMatch.length >= 3) matches.push(horizontalMatch);
        if (verticalMatch.length >= 3) matches.push(verticalMatch);
    }
    return matches;
};

const removeMatches = (board, matches) => {
    matches.forEach(match => {
        match.forEach(index => {
            board[index] = { ...board[index], matching: true };
        });
    });
    return board;
};

const clearMatches = (board) => {
    board.forEach((tile, index) => {
        if (tile && tile.matching) {
            board[index] = null;
        }
    });
    return board;
};

const dropTiles = (board) => {
    for (let i = 35; i >= 0; i--) {
        if (board[i] === null) {
            for (let j = i - 6; j >= 0; j -= 6) {
                if (board[j] !== null) {
                    board[i] = board[j];
                    board[j] = null;
                    break;
                }
            }
        }
    }
    for (let i = 0; i < 36; i++) {
        if (board[i] === null) {
            board[i] = generateRandomTile();
        }
    }
    return board;
};

export default function GMSmushGame() {
    const [board, setBoard] = useState(initialBoard());
    const [matchCount, setMatchCount] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60); // 1 minute game duration
    const [paused, setPaused] = useState(true); // Game starts paused
    const [draggedTile, setDraggedTile] = useState(null);

    useEffect(() => {
        if (!paused && !gameOver) {
            const timerId = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime > 0) return prevTime - 1;
                    setGameOver(true);
                    return 60;
                });
            }, 1000);
            return () => clearInterval(timerId);
        }
    }, [paused, gameOver]);

    useEffect(() => {
        if (gameOver) {
            const timer = setTimeout(() => {
                handleReset();
                setPaused(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [gameOver]);

    useEffect(() => {
        if (!paused && !gameOver) {
            const matches = findMatches(board);
            if (matches.length > 0) {
                setMatchCount(prevMatchCount => prevMatchCount + matches.length);
                setBoard(prevBoard => {
                    const newBoard = removeMatches([...prevBoard], matches);
                    setTimeout(() => {
                        setBoard(prevBoard => {
                            const clearedBoard = clearMatches([...prevBoard]);
                            return dropTiles(clearedBoard);
                        });
                    }, 600); // Delay to allow for animation
                    return newBoard;
                });
            }
        }
    }, [board, paused, gameOver]);

    const handlePause = () => {
        setPaused(!paused);
    };

    const handleReset = () => {
        setBoard(initialBoard());
        setMatchCount(0);
        setGameOver(false);
        setTimeLeft(60);
        setPaused(true);
        setDraggedTile(null);
    };

    const handleDragStart = (event, index) => {
        setDraggedTile(index);
    };

    const handleDrop = (event, index) => {
        event.preventDefault();
        const validMoves = getAdjacentIndices(draggedTile);
        if (draggedTile !== null && draggedTile !== index && validMoves.includes(index)) {
            const newBoard = swapTiles(board, draggedTile, index);
            const matches = findMatches(newBoard);
            if (matches.length > 0) {
                setBoard(newBoard);
            }
            setDraggedTile(null);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    return (
        <div className="smush-game-container">
            <h1>GM Smush</h1>
            {!gameOver && (
                <h2 className="smush-game-instructions">Match the tiles!</h2>
            )}
            {gameOver && (
                <div className="smush-game-over-screen">
                    <div className="smush-game-over-message">
                        Game Over!
                    </div>
                    <div className="smush-game-final-score">
                        {`Matches: ${matchCount}`}
                    </div>
                </div>
            )}
            <div className="smush-game-board">
                {board.map((tile, index) => (
                    <div
                        key={index}
                        className={`smush-game-tile ${tile && tile.matching ? 'match' : ''}`}
                        draggable={!paused}
                        onDragStart={(event) => handleDragStart(event, index)}
                        onDragOver={handleDragOver}
                        onDrop={(event) => handleDrop(event, index)}
                    >
                        {tile && (
                            <div className="smush-game-tile-content">
                                <div className="smush-game-tile-text">{tile.symbol}</div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="smush-game-controls">
                <button className="smush-game-control-button" onClick={handlePause}>
                    <FontAwesomeIcon icon={paused ? faPlay : faPause} />
                </button>
                <button className="smush-game-control-button" onClick={handleReset}>
                    <FontAwesomeIcon icon={faRotateLeft} />
                </button>
            </div>
            <div className="smush-game-status-container">
                <div className="smush-game-status-box">
                    <p className="smush-game-status-label">Matches</p>
                    <p>{matchCount}</p>
                </div>
                <div className="smush-game-status-box">
                    <p className="smush-game-status-label">Time</p>
                    <p>{timeLeft}</p>
                </div>
            </div>
        </div>
    );
}
