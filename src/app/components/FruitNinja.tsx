"use client";
import React, { useState, useEffect, useRef } from "react";

const canvasWidth = 500;
const canvasHeight = 500;
const basketWidth = 100;
const basketHeight = 50;
const fruitSize = 50;
const trackHeight = 55; // Height of the track

type Fruit = {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
  points: number;
};

type FlashPoint = {
  id: number;
  x: number;
  y: number;
  points: number;
};

export default function FruitNinja() {
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const basketRef = useRef<HTMLDivElement>(null);
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [flashPoints, setFlashPoints] = useState<FlashPoint[]>([]);
  const [score, setScore] = useState(0);
  const [basketPosition, setBasketPosition] = useState(canvasWidth / 2 - basketWidth / 2);
  const [activeBasket, setActiveBasket] = useState<boolean>(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = gameAreaRef.current?.getBoundingClientRect();
      if (!rect) return;

      if (activeBasket) {
        const x = e.clientX - rect.left - basketWidth / 2;
        setBasketPosition(Math.max(0, Math.min(x, canvasWidth - basketWidth)));
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [activeBasket]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFruits((prevFruits) => {
        return prevFruits
          .map((fruit) => ({
            ...fruit,
            x: fruit.x + fruit.dx,
            y: fruit.y + fruit.dy,
          }))
          .filter((fruit) => {
            if (fruit.x <= 0 || fruit.x >= canvasWidth - fruitSize) fruit.dx = -fruit.dx;
            if (fruit.y <= 0 || fruit.y >= canvasHeight - trackHeight - fruitSize) fruit.dy = -fruit.dy;
            return true;
          });
      });
    }, 50);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newFruit: Fruit = {
        id: Date.now(),
        x: Math.random() * (canvasWidth - fruitSize),
        y: 0,
        dx: (Math.random() - 0.5) * 4,
        dy: Math.random() * 4 + 2,
        color: getRandomColor(),
        points: Math.floor(Math.random() * 10) + 1,
      };
      setFruits((prevFruits) => [...prevFruits, newFruit]);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleMouseLeave = () => {
    setActiveBasket(false);
  };

  const getRandomColor = () => {
    const colors = ["red", "green", "blue", "yellow", "purple", "orange"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFruits((prevFruits) =>
        prevFruits.filter((fruit) => {
          const basketRect = basketRef.current?.getBoundingClientRect();
          const fruitRect = {
            left: fruit.x,
            top: fruit.y,
            right: fruit.x + fruitSize,
            bottom: fruit.y + fruitSize,
          };

          const basketCollision =
            basketRect &&
            fruitRect.bottom >= basketRect.top &&
            fruitRect.top <= basketRect.bottom &&
            fruitRect.left <= basketRect.right &&
            fruitRect.right >= basketRect.left;

          if (basketCollision) {
            setScore((prevScore) => prevScore + fruit.points);
            setFlashPoints((prevFlashPoints) => [
              ...prevFlashPoints,
              {
                id: Date.now(),
                x: basketRect.left + basketRect.width / 2, // Position points at the center of the basket
                y: basketRect.top,
                points: fruit.points,
              },
            ]);
            return false;
          }
          return true;
        })
      );
    }, 50);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (flashPoints.length > 0) {
      const timerId = setTimeout(() => {
        setFlashPoints((prevFlashPoints) => prevFlashPoints.slice(1));
      }, 300); // Flash points disappear quickly
      return () => clearTimeout(timerId);
    }
  }, [flashPoints]);

  return (
    <div className="fruit-ninja-module">
      <h1>Fruit Ninja</h1>
      <div className="fruit-ninja-game" ref={gameAreaRef} onMouseLeave={handleMouseLeave}>
        <div
          className="fruit-ninja-track"
          style={{ top: canvasHeight - trackHeight }}
        ></div>
        <div
          className="fruit-ninja-basket"
          ref={basketRef}
          style={{ left: basketPosition }}
          onMouseOver={() => setActiveBasket(true)}
        ></div>
        {fruits.map((fruit) => (
          <div
            key={fruit.id}
            className="fruit-ninja-fruit"
            style={{
              left: fruit.x,
              top: fruit.y,
              backgroundColor: fruit.color,
            }}
          >
            {fruit.points}
          </div>
        ))}
        {flashPoints.map((flash) => (
          <div
            key={flash.id}
            className="flash-points"
            style={{
              left: flash.x,
              top: flash.y,
            }}
          >
            +{flash.points}
          </div>
        ))}
      </div>
      <div className="fruit-ninja-info">
        <p>Score: {score}</p>
      </div>
    </div>
  );
}
