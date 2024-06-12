"use client";
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

export default function QuantityPriceModule() {
  const [gmQuantity, setGMQuantity] = useState(1);
  const [gmPrice, setGMPrice] = useState(0.1);
  const [gmTotal, setGMTotal] = useState(300);
  const [showInfo, setShowInfo] = useState(false);

  const incQty = () => setGMQuantity(gmQuantity + 1);
  const decQty = () => setGMQuantity(gmQuantity > 1 ? gmQuantity - 1 : 1);

  const handleGMButtonClick = () => {
    // Add your GM minting logic here
    alert('Minting GM!');
  };

  const closeInfo = () => {
    setShowInfo(false);
  };

  useEffect(() => {
    setGMTotal(gmQuantity * gmPrice * 3000); // Assuming ETH price is $3000
  }, [gmQuantity, gmPrice]);

  return (
    <div className="quantity-price-module">
      <div className="quantity-price-top-container">
        <div className="quantity-price-header-box">
          <h1>CLAIM</h1>
        </div>
        <div className="quantity-price-info-icon-box">
          <div className="quantity-price-info-icon" onClick={() => setShowInfo(true)}>
            <FontAwesomeIcon icon={faInfoCircle} />
          </div>
        </div>
      </div>
      <button id="mintGmButton" onClick={handleGMButtonClick}>GM</button>
      <div className="mint-options">
        <button onClick={decQty} id="decreaseQuantity" className="quantity-adjust">-</button>
        <input type="number" id="nftQuantity" className="nft-quantity-input" value={gmQuantity} onChange={(e) => setGMQuantity(Number(e.target.value))} min="1" />
        <button onClick={incQty} id="increaseQuantity" className="quantity-adjust">+</button>
      </div>
      <div className="quantity-container">
        <div className="recessed-field">
          <h3>Total Price: <span id="totalPriceEth">{gmTotal} ETH</span></h3>
        </div>
        <div className="recessed-field">
          <h3>USD: <span id="totalPriceUsd">${gmTotal.toFixed(2)} USD</span></h3>
        </div>
        <div className="recessed-field">
          <h3>Connected Wallet Balance</h3>
        </div>
      </div>
     
      {showInfo && (
        <div className="quantity-price-info-screen show">
          <div className="quantity-price-info-content">
            <FontAwesomeIcon icon={faCircleXmark} className="quantity-price-info-close" onClick={closeInfo} />
            <h2>Information</h2>
            <p>This is the information screen for the quantity price module.</p>
          </div>
        </div>
      )}
    </div>
  );
}
