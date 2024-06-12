"use client";
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay, faRotateLeft, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const cardsArray = [
    { name: 'GM', symbol: 'GM' },
    { name: 'GM', symbol: 'GM' },
    { name: 'V1', symbol: 'V1' },
    { name: 'V1', symbol: 'V1' },
    { name: 'Mint', symbol: '🪙' },
    { name: 'Mint', symbol: '🪙' },
    { name: 'NFT', symbol: '🎨' },
    { name: 'NFT', symbol: '🎨' },
    { name: 'Recipe', symbol: '📜' },
    { name: 'Recipe', symbol: '📜' },
    { name: 'Base', symbol: '🔗' },
    { name: 'Base', symbol: '🔗' },
    { name: 'Token', symbol: '💰' },
    { name: 'Token', symbol: '💰' },
    { name: 'Thirdweb', symbol: '🌐' },
    { name: 'Thirdweb', symbol: '🌐' }
];

export default function MemoryGame() {
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60); // 1 minute game duration
    const [paused, setPaused] = useState(true); // Game starts paused
    const [win, setWin] = useState(false);
    const [gradient, setGradient] = useState('linear-gradient(to bottom, #68cbfc80, #68cbfc80)');
    const [showInfo, setShowInfo] = useState(false); // Info screen state
    

    useEffect(() => {
        shuffleAndSetup();
    }, []);

    useEffect(() => {
        if (!gameOver && !paused) {
            const timerId = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime > 0) {
                        updateGradient(prevTime - 1);
                        return prevTime - 1;
                    }
                    setGameOver(true);
                    return 60;
                });
            }, 1000);
            return () => clearInterval(timerId);
        }
    }, [gameOver, paused]);

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
        if (win) {
            const timer = setTimeout(() => {
                handleReset();
                setPaused(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [win]);

    const shuffleAndSetup = () => {
        const shuffledCards = shuffleArray([...cardsArray]);
        setCards(shuffledCards);
        setFlippedCards([]);
        setMatchedCards([]);
        setScore(0);
        setGameOver(false);
        setWin(false);
        setGradient('linear-gradient(to bottom, #68cbfc80, #68cbfc80)');
    };

    const shuffleArray = array => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const handleCardClick = index => {
        if (flippedCards.length === 2 || matchedCards.includes(index) || flippedCards.includes(index)) return;

        const newFlippedCards = [...flippedCards, index];
        setFlippedCards(newFlippedCards);

        if (newFlippedCards.length === 2) {
            const [firstIndex, secondIndex] = newFlippedCards;
            if (cards[firstIndex].name === cards[secondIndex].name) {
                const newMatchedCards = [...matchedCards, firstIndex, secondIndex];
                setMatchedCards(newMatchedCards);
                setScore(prevScore => prevScore + 10);
                setFlippedCards([]);
                if (newMatchedCards.length === cards.length) {
                    setWin(true);
                }
            } else {
                setTimeout(() => {
                    setFlippedCards([]);
                }, 1000);
            }
        }
    };

    const handlePause = () => {
        setPaused(!paused);
    };

    const handleReset = () => {
        shuffleAndSetup();
        setGameOver(false);
        setTimeLeft(60);
        setPaused(true);
    };

    const updateGradient = (time) => {
        const percentage = (time / 60) * 100;
        const newGradient = `linear-gradient(to bottom, #68cbfc80 ${percentage}%, #ff8c00)`;
        setGradient(newGradient);
    };

    const handleInfoClose = () => {
        setShowInfo(false);
    };

    return (
        <div className="memory-card-game-container" style={{ background: gradient }}>
            <div className="memory-card-top-container">
                <div className="memory-card-header-box">
                    <h1>"GMEMORY"</h1>
                </div>
                <div className="memory-card-info-icon-box">
                    <div className="memory-card-info-icon" onClick={() => setShowInfo(true)}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                    </div>
                </div>
            </div>
            
            {gameOver && (
                <div className="memory-card-game-over-screen">
                    <div className="memory-card-game-over-message">
                        Game Over!
                    </div>
                    <div className="memory-card-final-score">
                        {`Score: ${score}`}
                    </div>
                </div>
            )}
            {win && (
                <div className="memory-card-win-screen">
                    <div className="memory-card-win-message">
                        You Win!
                    </div>
                    <div className="memory-card-final-score">
                        {`Score: ${score}`}
                    </div>
                </div>
            )}
            <div id="memory-card-game-board">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className={`memory-card ${flippedCards.includes(index) || matchedCards.includes(index) ? 'flip' : ''}`}
                        onClick={() => handleCardClick(index)}
                    >
                        <div className="memory-card-inner">
                            <div className="memory-card-back"></div>
                            <div className="memory-card-front">{card.symbol}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="memory-card-game-controls">
                <button className="control-button" onClick={handlePause}>
                    <FontAwesomeIcon icon={paused ? faPlay : faPause} />
                </button>
                <button className="control-button" onClick={handleReset}>
                    <FontAwesomeIcon icon={faRotateLeft} />
                </button>
            </div>
            <div className="memory-card-status-container">
                <div className="memory-card-status-box">
                    <p className="memory-card-status-label">Score:</p>
                    <p>{score}</p>
                </div>
                <div className="memory-card-status-box">
                    <p className="memory-card-status-label">Time:</p>
                    <p>{timeLeft}</p>
                </div>
            </div>
            {showInfo && (
                <div className="memory-card-info-screen show">
                    <div className="memory-card-info-content">
                        <FontAwesomeIcon icon={faInfoCircle} className="memory-card-info-close" onClick={handleInfoClose} />
                        <h2>Information</h2>
                        <p>This is the information screen for the GMemory game module.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
