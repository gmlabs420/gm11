"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

export default function RecentGMs() {
  const [recentGMs, setRecentGMs] = useState([]);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const fetchRecentGMs = async () => {
      try {
        // Placeholder data for testing
        const data = [
          {
            timestamp: "2024-05-23T12:00:00Z",
            blockId: "0xabc1234",
            walletAddress: "0x1234abcd",
            avatarUrl: "https://via.placeholder.com/50",
            gmsMinted: 5,
            txUrl: "https://basescan.io/tx/0xabc1234",
          },
          {
            timestamp: "2024-05-23T12:10:00Z",
            blockId: "0xdef5678",
            walletAddress: "0x2345bcde",
            avatarUrl: "https://via.placeholder.com/50",
            gmsMinted: 10,
            txUrl: "https://basescan.io/tx/0xdef5678",
          },
          {
            timestamp: "2024-05-23T12:15:00Z",
            blockId: "0xghi9101",
            walletAddress: "0x3456cdef",
            avatarUrl: "https://via.placeholder.com/50",
            gmsMinted: 11,
            txUrl: "https://basescan.io/tx/0xghi9101",
          },
          {
            timestamp: "2024-05-23T12:20:00Z",
            blockId: "0xjkl1121",
            walletAddress: "0x4567def0",
            avatarUrl: "https://via.placeholder.com/50",
            gmsMinted: 2,
            txUrl: "https://basescan.io/tx/0xjkl1121",
          },
          {
            timestamp: "2024-05-23T12:25:00Z",
            blockId: "0xjkl1122",
            walletAddress: "0x4567def1",
            avatarUrl: "https://via.placeholder.com/50",
            gmsMinted: 3,
            txUrl: "https://basescan.io/tx/0xjkl1122",
          },
          {
            timestamp: "2024-05-23T12:30:00Z",
            blockId: "0xjkl1123",
            walletAddress: "0x4567def2",
            avatarUrl: "https://via.placeholder.com/50",
            gmsMinted: 4,
            txUrl: "https://basescan.io/tx/0xjkl1123",
          },
          {
            timestamp: "2024-05-23T12:35:00Z",
            blockId: "0xjkl1124",
            walletAddress: "0x4567def3",
            avatarUrl: "https://via.placeholder.com/50",
            gmsMinted: 6,
            txUrl: "https://basescan.io/tx/0xjkl1124",
          },
          {
            timestamp: "2024-05-23T12:40:00Z",
            blockId: "0xjkl1125",
            walletAddress: "0x4567def4",
            avatarUrl: "https://via.placeholder.com/50",
            gmsMinted: 7,
            txUrl: "https://basescan.io/tx/0xjkl1125",
          },
          {
            timestamp: "2024-05-23T12:45:00Z",
            blockId: "0xjkl1126",
            walletAddress: "0x4567def5",
            avatarUrl: "https://via.placeholder.com/50",
            gmsMinted: 8,
            txUrl: "https://basescan.io/tx/0xjkl1126",
          },
          {
            timestamp: "2024-05-23T12:50:00Z",
            blockId: "0xjkl1127",
            walletAddress: "0x4567def6",
            avatarUrl: "https://via.placeholder.com/50",
            gmsMinted: 9,
            txUrl: "https://basescan.io/tx/0xjkl1127",
          },
        ];
        setRecentGMs(data);
      } catch (error) {
        console.error("Error fetching recent GMs data:", error);
      }
    };

    fetchRecentGMs();
  }, []);

  const truncate = (str, startLength, endLength) => {
    return str.length > startLength + endLength
      ? `${str.substring(0, startLength)}...${str.substring(str.length - endLength)}`
      : str;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <section className="recent-gms-section">
      <div className="recent-gms-top-container">
        <div className="recent-gms-header-box">
          <h1>LIVE</h1>
        </div>
        <div className="recent-gms-info-icon-box">
          <div className="recent-gms-info-icon" onClick={() => setShowInfo(true)}>
            <FontAwesomeIcon icon={faInfoCircle} />
          </div>
        </div>
      </div>

      <div className="recent-gms-cards-container">
        {recentGMs.length === 0 ? (
          <p>No data available.</p>
        ) : (
          recentGMs.map((gm, index) => (
            <a
              key={index}
              href={gm.txUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="recent-gm-card"
            >
              <div className="gm-card-avatar">
                <img src={gm.avatarUrl} alt={`${gm.walletAddress}'s avatar`} />
              </div>
              <p>Date: {formatDate(gm.timestamp)}</p>
              <p>Time: {formatTime(gm.timestamp)}</p>
              <p>Wallet: {truncate(gm.walletAddress, 6, 4)}</p>
              <p>GMs Claimed:</p>
              <h2 className="gm-mints">{gm.gmsMinted}</h2>
            </a>
          ))
        )}
      </div>

      {showInfo && (
        <div className="recent-gms-info-screen show">
          <div className="recent-gms-info-content">
            <FontAwesomeIcon icon={faCircleXmark} className="recent-gms-info-close" onClick={() => setShowInfo(false)} />
            <h2>Information</h2>
            <p>This is the information screen for the Recent GMs module.</p>
          </div>
        </div>
      )}

      <div className="gms-minted-contract-info">
        <div className="gms-minted-recessed-field">
          <h4>Contract: 0xD00530a4530471B11f0337C8138ECA5Ef5e2ed48</h4>
        </div>
        <button className="gms-minted-action-button" onClick={() => window.open('https://etherscan.io/address/0xD00530a4530471B11f0337C8138ECA5Ef5e2ed48', '_blank')}>
          View on Etherscan
        </button>
      </div>
    </section>
  );
}
