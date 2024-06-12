"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

export default function GmsRedeem() {
    const [burnQuantity, setBurnQuantity] = useState(1);
    const [redeemQuantity, setRedeemQuantity] = useState(1);
    const [expectedClubTokens, setExpectedClubTokens] = useState(0);
    const [showInfo, setShowInfo] = useState(false);

    const incBurnQty = () => {
        setBurnQuantity(burnQuantity + 1);
    };

    const decBurnQty = () => {
        if (burnQuantity > 1) setBurnQuantity(burnQuantity - 1);
    };

    const incRedeemQty = () => {
        setRedeemQuantity(redeemQuantity + 1);
    };

    const decRedeemQty = () => {
        if (redeemQuantity > 1) setRedeemQuantity(redeemQuantity - 1);
    };

    const closeInfo = () => {
        setShowInfo(false);
    };

    useEffect(() => {
        setExpectedClubTokens(burnQuantity * 3);
    }, [burnQuantity]);

    return (
        <section className="burn-redeem">
            <div className="burn-redeem-top-container">
                <div className="burn-redeem-header-box">
                    <h1>CLUB</h1>
                </div>
                <div className="burn-redeem-info-icon-box">
                    <div className="burn-redeem-info-icon" onClick={() => setShowInfo(true)}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                    </div>
                </div>
            </div>

            <div className="burn-redeem-container">
                <div className="burn-redeem-box">
                    <h3>My GMs</h3>
                    <div className="recessed-field">
                        <h3>15</h3>
                    </div>
                </div>

                <div className="burn-redeem-box">
                    <h3>Club Tokens</h3>
                    <div className="recessed-field">
                        <h3>3</h3>
                    </div>
                </div>
            </div>

            <div className="exchange-burn-redeem-box">
                <h2>Exchange</h2>
                <h3>1 GM = 3 Club Tokens</h3>
                <div className="expected-tokens">
                    <h4>Expected Club Tokens</h4>
                    <input
                        type="number"
                        id="expectedClubTokens"
                        className="nft-quantity-input"
                        value={expectedClubTokens}
                        readOnly
                    />
                </div>

                <div className="burn-mint-options">
                    <button onClick={decBurnQty} id="decreaseQuantity" className="quantity-adjust">-</button>
                    <input
                        type="number"
                        id="burnQuantity"
                        className="burn-quantity-input"
                        value={burnQuantity}
                        onChange={(e) => setBurnQuantity(parseInt(e.target.value))}
                        min="1"
                    />
                    <button onClick={incBurnQty} id="increaseQuantity" className="quantity-adjust">+</button>
                </div>

                <div className="burn-button-container">
                    <button id="redeemButton" className="action-button">Club</button>
                    <button id="burnButton" className="action-button">Exchange</button>
                    <button id="shopButton" className="action-button">Shop</button>
                </div>
            </div>

            {showInfo && (
                <div className="burn-redeem-info-screen show">
                    <div className="burn-redeem-info-content">
                        <FontAwesomeIcon icon={faCircleXmark} className="burn-redeem-info-close" onClick={closeInfo} />
                        <h2>Information</h2>
                        <p>This is the information screen for the GMs Redeem module.</p>
                    </div>
                </div>
            )}
        </section>
    );
}

