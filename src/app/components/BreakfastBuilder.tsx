"use client";
import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft, faStepBackward, faInfoCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import html2canvas from 'html2canvas';

const foodItems = [
  { id: 1, name: 'Scrambled Eggs', icon: '🍳', calories: 140 },
  { id: 2, name: 'Pancakes', icon: '🥞', calories: 350 },
  { id: 3, name: 'Waffles', icon: '🧇', calories: 370 },
  { id: 4, name: 'French Toast', icon: '🍞', calories: 380 },
  { id: 5, name: 'Oatmeal', icon: '🥣', calories: 150 },
  { id: 6, name: 'Greek Yogurt', icon: '🥛', calories: 150 },
  { id: 7, name: 'Smoothie', icon: '🥤', calories: 200 },
  { id: 8, name: 'Bagel with Cream Cheese', icon: '🥯', calories: 300 },
  { id: 9, name: 'Breakfast Burrito', icon: '🌯', calories: 450 },
  { id: 10, name: 'English Muffin with Butter', icon: '🍞', calories: 180 },
  { id: 11, name: 'Granola', icon: '🥣', calories: 200 },
  { id: 12, name: 'Cereal with Milk', icon: '🥛', calories: 200 },
  { id: 13, name: 'Avocado Toast', icon: '🥑', calories: 250 },
  { id: 14, name: 'Fruit Salad', icon: '🍇', calories: 100 },
  { id: 15, name: 'Bacon', icon: '🥓', calories: 130 },
  { id: 16, name: 'Sausage Links', icon: '🌭', calories: 180 },
  { id: 17, name: 'Hash Browns', icon: '🥔', calories: 210 },
  { id: 18, name: 'Breakfast Sandwich', icon: '🥪', calories: 400 },
  { id: 19, name: 'Muffin', icon: '🧁', calories: 350 },
  { id: 20, name: 'Croissant', icon: '🥐', calories: 240 },
  { id: 21, name: 'Danish Pastry', icon: '🍰', calories: 260 },
  { id: 22, name: 'Scones', icon: '🍪', calories: 250 },
  { id: 23, name: 'Breakfast Quiche', icon: '🥧', calories: 300 },
  { id: 24, name: 'Cottage Cheese', icon: '🧀', calories: 200 },
  { id: 25, name: 'Breakfast Casserole', icon: '🥘', calories: 350 },
  { id: 26, name: 'Eggs Benedict', icon: '🍽️', calories: 500 },
  { id: 27, name: 'Protein Bar', icon: '🍫', calories: 200 },
  { id: 28, name: 'Chia Pudding', icon: '🍧', calories: 200 },
  { id: 29, name: 'Acai Bowl', icon: '🥄', calories: 250 },
  { id: 30, name: 'Breakfast Pizza', icon: '🍕', calories: 350 },
  { id: 31, name: 'Smoked Salmon', icon: '🐟', calories: 100 },
  { id: 32, name: 'Toast with Jam', icon: '🍓', calories: 150 },
  { id: 33, name: 'Frittata', icon: '🍳', calories: 300 },
  { id: 34, name: 'Ham and Cheese Croissant', icon: '🥐', calories: 350 },
  { id: 35, name: 'Breakfast Tacos', icon: '🌮', calories: 300 },
  { id: 36, name: 'Egg Muffin', icon: '🧁', calories: 300 },
  { id: 37, name: 'Breakfast Sausage Gravy and Biscuits', icon: '🥖', calories: 450 },
  { id: 38, name: 'Rice Porridge', icon: '🍚', calories: 180 },
  { id: 39, name: 'Congee', icon: '🍲', calories: 150 },
  { id: 40, name: 'Lox Bagel', icon: '🥯', calories: 450 },
  { id: 41, name: 'Breakfast Burrito Bowl', icon: '🍲', calories: 400 },
  { id: 42, name: 'Cinnamon Roll', icon: '🍩', calories: 300 },
  { id: 43, name: 'Doughnut', icon: '🍩', calories: 250 },
  { id: 44, name: 'Pop-Tarts', icon: '🥧', calories: 400 },
  { id: 45, name: 'Breakfast Quesadilla', icon: '🌮', calories: 450 },
  { id: 46, name: 'Baked Beans', icon: '🥫', calories: 240 },
  { id: 47, name: 'Muesli', icon: '🥣', calories: 220 },
  { id: 48, name: 'Breakfast Parfait', icon: '🍨', calories: 250 },
  { id: 49, name: 'Grilled Cheese Sandwich', icon: '🥪', calories: 400 },
  { id: 50, name: 'Peanut Butter Toast', icon: '🍞', calories: 300 },
];

const plateOptions = [
  { id: 1, name: 'White Plate', className: 'plate-white' },
  { id: 2, name: 'Metallic Plate', className: 'plate-metallic' },
  { id: 3, name: 'Wooden Plate', className: 'plate-wooden' },
  { id: 4, name: 'Paper Plate', className: 'plate-paper' },
];

const generateUniqueId = () => {
  return Math.floor(Math.random() * Date.now());
};

export default function BreakfastBuilder() {
  const [plate, setPlate] = useState([]);
  const [calories, setCalories] = useState(0);
  const [history, setHistory] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [showMint, setShowMint] = useState(false);
  const [mintImage, setMintImage] = useState('');
  const [selectedPlate, setSelectedPlate] = useState(plateOptions[0]);
  const plateRef = useRef(null);
  const plateWrapperRef = useRef(null);

  const handleDrop = (foodItem, offsetX, offsetY) => {
    const uniqueItem = { ...foodItem, uniqueId: generateUniqueId(), offsetX, offsetY };
    setHistory([...history, plate]);
    setPlate([...plate, uniqueItem]);
    setCalories(calories + foodItem.calories);
  };

  const handleRemove = (uniqueId, foodItem) => {
    const updatedPlate = plate.filter(item => item.uniqueId !== uniqueId);
    if (calories - foodItem.calories >= 0) {
      setHistory([...history, plate]);
      setPlate(updatedPlate);
      setCalories(calories - foodItem.calories);
    }
  };

  const handleDragStart = (e, foodItem, uniqueId = null) => {
    const item = uniqueId ? { ...foodItem, uniqueId } : foodItem;
    e.dataTransfer.setData("foodItem", JSON.stringify(item));

    // Create a custom drag image
    const dragIcon = document.createElement('div');
    dragIcon.className = 'drag-icon';
    dragIcon.textContent = item.icon;
    document.body.appendChild(dragIcon);
    e.dataTransfer.setDragImage(dragIcon, 0, 0);

    // Hide the drag icon after setting the drag image
    setTimeout(() => document.body.removeChild(dragIcon), 0);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropOnPlate = (e) => {
    e.preventDefault();
    const foodItem = JSON.parse(e.dataTransfer.getData("foodItem"));
    const plateRect = plateRef.current.getBoundingClientRect();
    const offsetX = e.clientX - plateRect.left;
    const offsetY = e.clientY - plateRect.top;
    const radius = plateRect.width / 2;
    const distance = Math.sqrt(Math.pow(offsetX - radius, 2) + Math.pow(offsetY - radius, 2));

    if (distance <= radius) {
      handleDrop(foodItem, offsetX, offsetY);
    }
  };

  const handleDropOffPlate = (e) => {
    e.preventDefault();
    const { uniqueId, ...foodItem } = JSON.parse(e.dataTransfer.getData("foodItem"));
    handleRemove(uniqueId, foodItem);
  };

  const handleReset = () => {
    setPlate([]);
    setCalories(0);
    setHistory([]);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const previousPlate = history.pop();
      const previousCalories = previousPlate.reduce((acc, item) => acc + item.calories, 0);
      setPlate(previousPlate);
      setCalories(previousCalories);
      setHistory(history);
    }
  };

  const handleInfoClick = () => {
    setShowInfo(!showInfo);
  };

  const handleInfoClose = () => {
    setShowInfo(false);
  };

  const handleMint = () => {
    if (plateWrapperRef.current) {
      html2canvas(plateWrapperRef.current, { backgroundColor: '#ffffff', useCORS: true }).then(canvas => {
        const image = canvas.toDataURL('image/png');
        setMintImage(image);
        setShowMint(true);
      });
    }
  };

  const mintNFT = () => {
    alert('Mint function called!'); // Placeholder for mint function
  };

  return (
    <div className="breakfast-builder-container">
      <div className="header-container">
        <h1>"Breeky Builder"</h1>
        <div className="info-icon" onClick={handleInfoClick}>
          <FontAwesomeIcon icon={faInfoCircle} />
        </div>
      </div>
      {showInfo && (
        <div className="info-screen">
          <div className="info-content">
            <FontAwesomeIcon icon={faCircleXmark} className="info-close" onClick={handleInfoClose} />
            <h2>Information</h2>
            <p>This is the information screen for the game module.</p>
          </div>
        </div>
      )}
      <div className="calories-display">
        Total Calories: {calories}
      </div>
      <div className="plate-options">
        {plateOptions.map(option => (
          <button
            key={option.id}
            className={`plate-option ${option.className} ${selectedPlate.id === option.id ? 'selected' : ''}`}
            onClick={() => setSelectedPlate(option)}
          >
            {option.name}
          </button>
        ))}
      </div>
      <div
        className={`plate-wrapper ${selectedPlate.className}`}
        ref={plateWrapperRef}
      >
        <div
          className="plate-container"
          onDrop={handleDropOnPlate}
          onDragOver={handleDragOver}
          ref={plateRef}
        >
          <div className="plate">
            {plate.map(item => (
              <div
                key={item.uniqueId}
                className="food-item"
                style={{ position: 'absolute', left: item.offsetX, top: item.offsetY }}
                draggable
                onDragStart={(e) => handleDragStart(e, item, item.uniqueId)}
              >
                {item.icon}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className="food-items-container"
        onDrop={handleDropOffPlate}
        onDragOver={handleDragOver}
      >
        {foodItems.map(item => (
          <div
            key={item.id}
            className="food-item"
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
          >
            {item.icon}
            <div className="item-details">
              <div className="food-name">{item.name}</div>
              <div className="calorie-count">{item.calories} kcal</div>
            </div>
          </div>
        ))}
      </div>
      <div className="button-container">
        <button className="plate-reset-button" onClick={handleReset}>
          <FontAwesomeIcon icon={faRotateLeft} />
        </button>
        <button className="plate-reset-button" onClick={handleUndo}>
          <FontAwesomeIcon icon={faStepBackward} />
        </button>
        <button className="plate-reset-button" onClick={handleMint}>
          Mint
        </button>
      </div>
      {showMint && (
        <div className="mint-screen">
          <div className="mint-content">
            <FontAwesomeIcon icon={faCircleXmark} className="info-close" onClick={() => setShowMint(false)} />
            <h2>Mint Your Breakfast</h2>
            <div className="mint-image-container">
              <img src={mintImage} alt="Minted Breakfast" className="mint-image" />
            </div>
            <div className="mint-metadata-container">
              <div className="mint-metadata">
                <h3>Metadata</h3>
                <p>Total Calories: {calories}</p>
                <p>Plate: {selectedPlate.name}</p>
                <ul>
                  {plate.map(item => (
                    <li key={item.uniqueId}>{item.name}: {item.calories} kcal</li>
                  ))}
                </ul>
              </div>
            </div>
            <button className="mint-button" onClick={mintNFT}>
              Mint
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

