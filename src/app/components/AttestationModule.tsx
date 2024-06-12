"use client"

// src/app/components/AttestationModule.tsx
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faInfoCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

export default function AttestationModule() {
  const [avatar, setAvatar] = useState('');
  const [attestation, setAttestation] = useState('');
  const [prefix, setPrefix] = useState('Good Morning');
  const [attestations, setAttestations] = useState([]);
  const [today, setToday] = useState(new Date());
  const [showInfo, setShowInfo] = useState(false);
  const [showAttestations, setShowAttestations] = useState(false);
  const [gmLevel, setGmLevel] = useState(50); // GM Level state
  const [isClient, setIsClient] = useState(false);

  const languages = {
    "GM": "GM",
    "Good Morning": "Good Morning",
    "Mandarin Chinese GM": "早上好 (Zǎo shàng hǎo)",
    "Spanish GM": "Buenos días",
    "Hindi GM": "सुप्रभात (Suprabhat)",
    "Arabic GM": "صباح الخير (Sabah al-khair)",
    "Bengali GM": "সুপ্রভাত (Suprabhat)",
    "Portuguese GM": "Bom dia",
    "Russian GM": "Доброе утро (Dobroye utro)",
    "Japanese GM": "おはようございます (Ohayō gozaimasu)",
    "Western Punjabi GM": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ (Sat Sri Akal)",
    "Marathi GM": "शुभ प्रभात (Shubh prabhat)",
    "Telugu GM": "శుభోదయం (Śubhōdayaṁ)",
    "Turkish GM": "Günaydın",
    "Korean GM": "좋은 아침 (Joh-eun achim)",
    "French GM": "Bonjour",
    "German GM": "Guten Morgen",
    "Vietnamese GM": "Chào buổi sáng",
    "Tamil GM": "காலை வணக்கம் (Kālai vaṇakkam)",
    "Urdu GM": "صبح بخیر (Subah bakhair)",
    "Italian GM": "Buongiorno"
  };

  useEffect(() => {
    setIsClient(true); // Set to true once the component is mounted on the client
    const interval = setInterval(() => {
      setToday(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const slider = document.getElementById('gmLevel');
      if (slider) {
        slider.style.background = getSliderBackground(gmLevel);
      }
    }
  }, [gmLevel]);

  const handleAvatarChange = (e) => setAvatar(e.target.value);
  const handleAttestationChange = (e) => setAttestation(e.target.value);
  const handlePrefixChange = (e) => setPrefix(e.target.value);

  const handleUndo = (field) => {
    if (field === 'avatar') setAvatar('');
    if (field === 'attestation') setAttestation('');
    if (field === 'prefix') setPrefix('GM');
  };

  const handleAttest = () => {
    if (avatar && prefix) {
      const newAttestation = { avatar, attestation, prefix, gmLevel, date: new Date() }; // Include GM Level
      setAttestations([newAttestation, ...attestations]);
      alert('Attestation created successfully!');
    } else {
      alert('Avatar and GM are required to attest.');
    }
  };

  const closeInfo = () => {
    setShowInfo(false);
  };

  const openAttestations = () => {
    setShowAttestations(true);
  };

  const closeAttestations = () => {
    setShowAttestations(false);
  };

  const getSliderBackground = (value) => {
    const darkBlue = { r: 1, g: 93, b: 130 }; // #015D82
    const lightBlue = { r: 177, g: 199, b: 218 }; // #B1C7DA
    const Orange = { r: 255, g: 165, b: 0 }; // #F0BF8C

    const mixColor = (start, end, percentage) => {
      const r = start.r + percentage * (end.r - start.r);
      const g = start.g + percentage * (end.g - start.g);
      const b = start.b + percentage * (end.b - start.b);
      return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    };

    const percentage = value / 100;

    const startColor = mixColor(darkBlue, lightBlue, percentage);
    const endColor = mixColor(lightBlue, Orange, percentage);

    return `linear-gradient(90deg, ${startColor} 0%, ${endColor} 100%)`;
  };

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value);
    setGmLevel(value);
    updateSliderTextPosition(value);
  };

  const updateSliderTextPosition = (value) => {
    const slider = document.getElementById('gmLevel');
    const text = document.getElementById('sliderText');
    if (slider && text) {
      const percentage = (value - 1) / (slider.max - slider.min);
      const sliderWidth = slider.offsetWidth - 25; // Adjust for thumb width
      const offset = percentage * sliderWidth;
      text.style.left = `${offset}px`;
    }
  };

  useEffect(() => {
    updateSliderTextPosition(gmLevel);
  }, [gmLevel]);

  return (
    <div className="attestation-module-container">
      <div className="attestation-module-top-container">
        <div className="attestation-module-header-box">
          <h1 className="attestation-module-header">ATTEST</h1>
        </div>
        <div className="attestation-module-info-icon-box">
          <div className="attestation-module-info-icon" onClick={() => setShowInfo(true)}>
            <FontAwesomeIcon icon={faInfoCircle} />
          </div>
        </div>
      </div>
      <div className="attestation-module-input-container">
        <div className="attestation-module-input-wrapper">
          <select className="attestation-module-dropdown" value={prefix} onChange={handlePrefixChange}>
            {Object.entries(languages).map(([language, translation]) => (
              <option key={language} value={translation}>{language} - {translation}</option>
            ))}
          </select>
          <button className="attestation-module-undo-button" onClick={() => handleUndo('prefix')}>
            <FontAwesomeIcon icon={faUndo} className="fa-icon" />
          </button>
        </div>
        <div className="attestation-module-input-wrapper">
          <input 
            type="text" 
            className="attestation-module-input" 
            placeholder="Avatar" 
            value={avatar} 
            onChange={handleAvatarChange}
          />
          <button className="attestation-module-undo-button" onClick={() => handleUndo('avatar')}>
            <FontAwesomeIcon icon={faUndo} className="fa-icon" />
          </button>
        </div>
        <div className="attestation-module-input-wrapper">
          <textarea 
            className="attestation-module-textarea" 
            placeholder="Attestation" 
            value={attestation} 
            onChange={handleAttestationChange}
          />
          <button className="attestation-module-undo-button" onClick={() => handleUndo('attestation')}>
            <FontAwesomeIcon icon={faUndo} className="fa-icon" />
          </button>
        </div>
        <div className="attestation-module-slider-container">
          <input 
            type="range" 
            id="gmLevel" 
            name="gmLevel" 
            min="1" 
            max="100" 
            value={gmLevel} 
            onChange={handleSliderChange} 
            className="attestation-module-slider"
          />
          <div className="attestation-module-slider-text" id="sliderText">GM</div>
       
          <label htmlFor="gmLevel" className="attestation-module-slider-label">GM Level: {gmLevel}/100</label>

        </div>
      </div>
      <div className="attestation-module-attestation-preview">
        <p>⌐◨-◨ GM: {prefix}</p>
        <p>Avatar: {avatar || 'Avatar'}</p>
        <p>GM Level: {gmLevel}</p>
        <p className="attestation-preview-text">Attestation: {attestation || 'Your attestation here...'}</p>
        <p>{isClient && today.toLocaleString()}</p>
      </div>
      <div className="attestation-module-button-container">
        <button className="attestation-module-button attestation-module-attest-button" onClick={handleAttest}>
          Attest
        </button>
        <button className="attestation-module-button" onClick={openAttestations}>
          Attestations
        </button>
      </div>
      <p>$1.00 Platform Support Fee + L2 Gas / Per Attestation ⌐♥-♥</p>

      {showInfo && (
        <div className="attestation-module-info-screen show">
          <div className="attestation-module-info-content">
            <FontAwesomeIcon icon={faCircleXmark} className="attestation-module-info-close" onClick={closeInfo} />
            <h2>Information</h2>
            <p>This is the information screen for the attestation module.</p>
          </div>
        </div>
      )}
      {showAttestations && (
        <div className="attestation-module-attestations-screen show">
          <div className="attestation-module-attestations-content">
            <FontAwesomeIcon icon={faCircleXmark} className="attestation-module-attestations-close" onClick={closeAttestations} />
            <div className="attestation-module-attestations-container">
              {attestations.map((att, index) => (
                <div key={index} className="attestation-module-attestation-card">
                  <p>⌐◨-◨ GM: {att.prefix}</p>
                  <p>Avatar: {att.avatar}</p>
                  <p>GM Level: {att.gmLevel}</p>
                  <p>Attestation: {att.attestation}</p>
                  <p>Date: {att.date.toLocaleString()}</p>
                </div>
              ))}
            </div>
            <button className="attestation-module-scroll-button" onClick={() => {
              const container = document.querySelector('.attestation-module-attestations-container');
              container.scrollTo({ left: 0, behavior: 'smooth' });
            }}>
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

