"use client";
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay, faRotateLeft, faInfoCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

// URLs for sound effects
const castSoundUrl = 'https://example.com/cast.mp3';  // Replace with an actual URL from a free sound library
const catchSoundUrl = 'https://example.com/catch.mp3';  // Replace with an actual URL from a free sound library

// Fish and GM data including bonuses and info
const fishArray = [
    { name: 'Small GM', symbol: '🐟', points: 5, info: 'A small but energetic GM.', size: 'small' },
    { name: 'Medium GM', symbol: '🐠', points: 10, info: 'A medium-sized GM, quite common.', size: 'medium' },
    { name: 'Large GM', symbol: '🐡', points: 20, info: 'A large GM, hard to catch!', size: 'large' },
    { name: 'Rare GM', symbol: '🐬', points: 50, info: 'A rare GM, lucky catch!', size: 'medium' },
    { name: 'Bonus GM', symbol: '🦈', points: 100, info: 'A bonus GM, gives extra points!', size: 'large' },
    { name: 'GM Circle', symbol: '🔵', points: 15, info: 'A GM Circle, worth moderate points.', size: 'small' }
];

export default function GMFishing() {
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60); // 1 minute game duration
    const [paused, setPaused] = useState(true); // Game starts paused
    const [fish, setFish] = useState(null);
    const [ripple, setRipple] = useState(false);
    const [achievements, setAchievements] = useState([]);
    const [highlightedAchievement, setHighlightedAchievement] = useState(null);
    const [fishElements, setFishElements] = useState([]);
    const [showInfo, setShowInfo] = useState(false); // Info screen state
    const fishIntervalRef = useRef(null);
    const timerIntervalRef = useRef(null);

    useEffect(() => {
        if (!gameOver && !paused) {
            timerIntervalRef.current = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime > 0) {
                        return prevTime - 1;
                    }
                    setGameOver(true);
                    return 60;
                });
            }, 1000);
        } else {
            clearInterval(timerIntervalRef.current);
        }
        return () => clearInterval(timerIntervalRef.current);
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
        if (!paused && !gameOver) {
            fishIntervalRef.current = setInterval(() => {
                const newFish = {
                    id: Math.random().toString().replace('.', ''), // Ensure the ID is valid for CSS class names
                    x: 200,
                    y: Math.random() * 80, // Ensure fish stay within the board area
                    type: fishArray[Math.floor(Math.random() * fishArray.length)]
                };
                setFishElements(prev => [...prev, newFish]);
            }, 2000);
        } else {
            clearInterval(fishIntervalRef.current);
        }
        return () => clearInterval(fishIntervalRef.current);
    }, [paused, gameOver]);

    const handlePause = () => {
        setPaused(!paused);
    };

    const handleReset = () => {
        setScore(0);
        setGameOver(false);
        setTimeLeft(60);
        setPaused(true);
        setFish(null);
        setAchievements([]);
        setRipple(false);
        setHighlightedAchievement(null);
        setFishElements([]);
    };

    const catchFish = (fishElement) => {
        const caughtFish = fishElement.type;
        setFish(caughtFish);
        setScore(prevScore => {
            const newScore = prevScore + caughtFish.points;
            checkAchievements(newScore);
            return newScore;
        });

        // Play catch sound
        const audio = new Audio(catchSoundUrl);
        audio.play();
        
        // Hide fish info after 2 seconds with swim out effect
        setTimeout(() => {
            setFish(null);
        }, 2000);
    };

    const handleCast = () => {
        // Play cast sound
        const audio = new Audio(castSoundUrl);
        audio.play();

        setRipple(true);
        setTimeout(() => {
            const rippleBounds = document.querySelector('.hit-area').getBoundingClientRect();
            const hitElements = fishElements.filter(fishElement => {
                const elementBounds = document.querySelector(`.fish-${fishElement.id}`).getBoundingClientRect();
                return (
                    elementBounds.left < rippleBounds.right &&
                    elementBounds.right > rippleBounds.left &&
                    elementBounds.top < rippleBounds.bottom &&
                    elementBounds.bottom > rippleBounds.top
                );
            });
            hitElements.forEach(hitElement => catchFish(hitElement));
            setFishElements(prev => prev.filter(fishElement => !hitElements.includes(fishElement)));
            setRipple(false);
        }, 1000);
    };

    const checkAchievements = (newScore) => {
        const newAchievements = [];
        if (newScore >= 50 && !achievements.includes('First 50 Points')) {
            newAchievements.push('First 50 Points');
            setHighlightedAchievement('First 50 Points');
        }
        if (newScore >= 100 && !achievements.includes('Century Club')) {
            newAchievements.push('Century Club');
            setHighlightedAchievement('Century Club');
        }
        setAchievements([...achievements, ...newAchievements]);
        setTimeout(() => {
            setHighlightedAchievement(null);
        }, 2000);
    };

    const handleInfoClose = () => {
        setShowInfo(false);
    };

    return (
        <div className="fishing-game-container">
            <div className="fishing-game-top-container">
                <div className="fishing-game-header-box">
                    <h1>GM FISHIN'</h1>
                </div>
                <div className="fishing-game-info-icon-box">
                    <div className="fishing-game-info-icon" onClick={() => setShowInfo(true)}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                    </div>
                </div>
            </div>
            {!gameOver && (
                <h2 className="fishing-game-instructions">Cast and catch a GM!</h2>
            )}
            {gameOver && (
                <div className="fishing-game-over-screen">
                    <div className="fishing-game-over-message">
                        Game Over!
                    </div>
                    <div className="fishing-game-final-score">
                        {`Score: ${score}`}
                    </div>
                </div>
            )}
            <div className="fishing-game-board">
                <div className="waves-container">
                    <div className={`wave ${paused ? 'paused' : ''}`}></div>
                    <div className={`wave ${paused ? 'paused' : ''}`}></div>
                    <div className={`wave ${paused ? 'paused' : ''}`}></div>
                </div>
                {ripple && (
                    <div className="ripple-container">
                        <div className="ripple"></div>
                        <div className="ripple"></div>
                        <div className="ripple"></div>
                    </div>
                )}
                <div className="hit-area"></div>
                {fish && !ripple && (
                    <div className="caught-fish animated">
                        {fish.symbol} - {fish.name}
                        <p className="fish-info animated-fish-info">{fish.info}</p>
                    </div>
                )}
                {fishElements.map(fishElement => (
                    <div
                        key={fishElement.id}
                        className={`random-fish fish-${fishElement.id} ${paused ? 'paused' : ''}`}
                        style={{ top: `${fishElement.y}%`, right: `${fishElement.x}%`, fontSize: `${fishElement.type.size === 'small' ? '20px' : fishElement.type.size === 'medium' ? '30px' : '40px'}` }}
                    >
                        {fishElement.type.symbol}
                    </div>
                ))}
                {highlightedAchievement && (
                    <div className="achievement-popup">
                        <h3>Achievement Unlocked!</h3>
                        <p>{highlightedAchievement}</p>
                    </div>
                )}
            </div>
            <div className="fishing-game-controls">
                <button className="control-button" onClick={handlePause}>
                    <FontAwesomeIcon icon={paused ? faPlay : faPause} />
                </button>
                <button className="cast-control-button" onClick={handleCast} disabled={ripple}>
                🧨 Blast
                </button>
                <button className="control-button" onClick={handleReset}>
                    <FontAwesomeIcon icon={faRotateLeft} />
                </button>
            </div>
            <div className="fishing-game-status-container">
                <div className="fishing-game-status-box">
                    <p className="fishing-game-status-label">Score</p>
                    <p>{score}</p>
                </div>
                <div className="fishing-game-status-box">
                    <p className="fishing-game-status-label">Time</p>
                    <p>{timeLeft}</p>
                </div>
            </div>
            {showInfo && (
                <div className="game-info-popup">
                    <div className="popup-content">
                        <button className="control-button" onClick={handleInfoClose}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                        <h2>Information</h2>
                        <p>This is the information screen for the GM Fishin' game module.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
