"use client";
import React, { useState, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/16/solid";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

export default function GmSendStation() {
    const [gmQuantity, setGMQuantity] = useState(1);
    const [showInfo, setShowInfo] = useState(false);

    const incQty = async () => {
        setGMQuantity(gmQuantity + 1);
    }

    const decQty = () => {
        if (gmQuantity > 1) setGMQuantity(gmQuantity - 1);
    }

    const closeInfo = () => {
        setShowInfo(false);
    };

    return (
        <section className="gm-send">
            <div className="gm-send-top-container">
                <div className="gm-send-header-box">
                    <h1>GIFT</h1>
                </div>
                <div className="gm-send-info-icon-box">
                    <div className="gm-send-info-icon" onClick={() => setShowInfo(true)}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                    </div>
                </div>
            </div>
            <div className="gm-send-container">
                <div className="gm-send-box">
                    <h3>My GMs</h3>
                    <div className="recessed-field">
                        <h3>15</h3>
                    </div>
                </div>
                <div className="gm-send-box">
                    <h3>Gift Address</h3>
                    <div className="recessed-field">
                        <h4>0xD00530a4530471B11f0337C8138ECA5Ef5e2ed48</h4>
                    </div>
                </div>
            </div>
            <div className="gm-gift-send-box">
                <h2>Gift Amount</h2>
                <div className="mint-options">
                    <button onClick={decQty} id="decreaseQuantity" className="quantity-adjust">-</button>
                    <input type="number" id="nftQuantity" className="nft-quantity-input" value={gmQuantity} onChange={(e) => setGMQuantity(Number(e.target.value))} min="1" />
                    <button onClick={incQty} id="increaseQuantity" className="quantity-adjust">+</button>
                </div>
                <div className="send-button-container">
                    <button id="stakeButton" className="action-button">Gift My GMs</button>
                    <div className="send-button-container">
                    <button id="stakeButton" className="action-button">Gift New GMs</button>
                </div>
                </div>
            </div>
            {showInfo && (
                <div className="gm-send-info-screen show">
                    <div className="gm-send-info-content">
                        <FontAwesomeIcon icon={faCircleXmark} className="gm-send-info-close" onClick={closeInfo} />
                        <h2>Information</h2>
                        <p>This is the information screen for the GM Send Station module.</p>
                    </div>
                </div>
            )}
        </section>
    );
}
