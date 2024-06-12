"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft, faInfoCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

export default function CryptoPriceModule() {
  const [ethPrice, setEthPrice] = useState(null);
  const [ethAmount, setEthAmount] = useState('');
  const [usdAmount, setUsdAmount] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  const fetchEthPrice = async () => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
        params: {
          ids: 'ethereum',
          vs_currencies: 'usd',
        },
      });
      setEthPrice(response.data.ethereum.usd);
    } catch (err) {
      console.error('Failed to fetch Ethereum price:', err);
    }
  };

  useEffect(() => {
    fetchEthPrice();
  }, []);

  const handleReset = () => {
    setEthAmount('');
    setUsdAmount('');
  };

  const handleEthWheel = (e) => {
    e.preventDefault();
    const delta = Math.sign(e.deltaY) * 0.1;
    const newEthAmount = (parseFloat(ethAmount) || 0) + delta;
    setEthAmount(newEthAmount.toFixed(2));
    if (ethPrice) {
      setUsdAmount((newEthAmount * ethPrice).toFixed(2));
    }
  };

  const handleUsdWheel = (e) => {
    e.preventDefault();
    const delta = Math.sign(e.deltaY);
    const newUsdAmount = (parseFloat(usdAmount) || 0) + delta;
    setUsdAmount(newUsdAmount.toFixed(2));
    if (ethPrice) {
      setEthAmount((newUsdAmount / ethPrice).toFixed(2));
    }
  };

  const handleInfoClick = () => {
    setShowInfo(!showInfo);
  };

  const handleInfoClose = () => {
    setShowInfo(false);
  };

  const handleEthChange = (e) => {
    const value = e.target.value;
    setEthAmount(value);
    if (ethPrice) {
      setUsdAmount((parseFloat(value) * ethPrice).toFixed(2));
    }
  };

  const handleUsdChange = (e) => {
    const value = e.target.value;
    setUsdAmount(value);
    if (ethPrice) {
      setEthAmount((parseFloat(value) / ethPrice).toFixed(2));
    }
  };

  useEffect(() => {
    const ethContainer = document.querySelector('.eth-container');
    const usdContainer = document.querySelector('.usd-container');

    if (ethContainer) {
      ethContainer.addEventListener('wheel', handleEthWheel, { passive: false });
    }

    if (usdContainer) {
      usdContainer.addEventListener('wheel', handleUsdWheel, { passive: false });
    }

    return () => {
      if (ethContainer) {
        ethContainer.removeEventListener('wheel', handleEthWheel);
      }

      if (usdContainer) {
        usdContainer.removeEventListener('wheel', handleUsdWheel);
      }
    };
  }, [ethAmount, usdAmount]);

  const formatNumber = (num) => {
    return num.toLocaleString('en-US');
  };

  return (
    <div className="converter-container">
      <div className="converter-top-container">
        <div className="converter-header-box">
          <h1>ETH =</h1>
        </div>
        <div className="converter-info-icon-box">
          <div className="converter-info-icon" onClick={handleInfoClick}>
            <FontAwesomeIcon icon={faInfoCircle} />
          </div>
        </div>
      </div>
      <h3>Current Ethereum Price: ${ethPrice}</h3>
      {showInfo && (
        <div className="converter-info-screen show">
          <div className="converter-info-content">
            <FontAwesomeIcon icon={faCircleXmark} className="converter-info-close" onClick={handleInfoClose} />
            <h2>Information</h2>
            <p>This is the information screen for the module.</p>
          </div>
        </div>
      )}
      {ethPrice !== null ? (
        <div className="scroll-container">
          <div className="input-container eth-container">
            <div>
              <label htmlFor="ethAmount">ETH:</label>
              <input
                type="text"
                id="ethAmount"
                value={ethAmount}
                onChange={handleEthChange}
                placeholder="Enter amount in ETH"
              />
            </div>
            <div className="inputs-controls-container">
              <div className="scroll-wheel" onWheel={handleEthWheel}>
                <span className="scroll-text">↕</span>
              </div>
            </div>
          </div>

          <div className="input-container usd-container">
            <div>
              <label htmlFor="usdAmount">USD:</label>
              <input
                type="text"
                id="usdAmount"
                value={usdAmount}
                onChange={handleUsdChange}
                placeholder="Enter amount in USD"
              />
            </div>
            <div className="inputs-controls-container">
              <div className="scroll-wheel" onWheel={handleUsdWheel}>
                <span className="scroll-text">↕</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading Ethereum price...</p>
      )}

      <button className="converter-reset-button" onClick={handleReset}>
        <FontAwesomeIcon icon={faRotateLeft} />
      </button>
    </div>
  );
}
