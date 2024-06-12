"use client"; // Ensure this component is treated as a client component
import { useState, useEffect } from "react";
import ShareModal from './ShareModal'; // Adjust the path as necessary
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

export default function AIImageGenerator() {
  const [complexityLevel, setComplexityLevel] = useState(50);
  const [imageSize, setImageSize] = useState(1080); // default to 1080
  const [result, setResult] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleGenerate = async () => {
    const prompt = `Generate an image with complexity level ${complexityLevel} and size ${imageSize}x${imageSize}`;
    
    const response = await fetch('/api/openai-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, complexityLevel, imageSize }),
    });

    const data = await response.json();
    setResult(data.imageUrl);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    alert('Image URL copied to clipboard!');
  };

  const handleShare = () => {
    setIsModalOpen(true);
  };

  const getSliderBackground = (value: number) => {
    const darkBlue = { r: 1, g: 93, b: 130 }; // #015D82
    const lightBlue = { r: 177, g: 199, b: 218 }; // #B1C7DA
    const lightOrange = { r: 240, g: 191, b: 140 }; // #F0BF8C

    const mixColor = (start, end, percentage) => {
      const r = start.r + percentage * (end.r - start.r);
      const g = start.g + percentage * (end.g - start.g);
      const b = start.b + percentage * (end.b - start.b);
      return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    };

    const percentage = value / 100;

    const startColor = mixColor(darkBlue, lightBlue, percentage);
    const endColor = mixColor(lightBlue, lightOrange, percentage);

    return `linear-gradient(90deg, ${startColor} 0%, ${endColor} 100%)`;
  };

  const updateSliderTextPosition = (sliderId, value) => {
    const slider = document.getElementById(sliderId);
    const text = document.getElementById(`${sliderId}Text`);
    if (slider && text) {
      const percentage = (value - slider.min) / (slider.max - slider.min);
      const sliderWidth = slider.offsetWidth - 25; // Adjust for thumb width
      const offset = percentage * sliderWidth;
      text.style.left = `${offset}px`;
    }
  };

  const handleSliderChange = (e, setValue, sliderId) => {
    const value = parseInt(e.target.value);
    setValue(value);
    updateSliderTextPosition(sliderId, value);
  };

  useEffect(() => {
    const complexitySlider = document.getElementById('complexityLevel');
    if (complexitySlider) {
      const background = getSliderBackground(complexityLevel);
      complexitySlider.style.background = background;
      updateSliderTextPosition('complexityLevel', complexityLevel);
    }
  }, [complexityLevel]);

  useEffect(() => {
    const sizeSlider = document.getElementById('imageSize');
    if (sizeSlider) {
      const background = getSliderBackground(imageSize / 20); // Adjust scale for size slider
      sizeSlider.style.background = background;
      updateSliderTextPosition('imageSize', imageSize);
    }
  }, [imageSize]);

  return (
    <div className="machine">
      <div className="machine-top-container">
        <div className="machine-header-box">
          <h1>IMAGE</h1>
        </div>
        <div className="machine-info-icon-box">
          <div className="machine-info-icon" onClick={() => setShowInfo(true)}>
            <FontAwesomeIcon icon={faInfoCircle} />
          </div>
        </div>
      </div>
      <span><h2>AI GM Image Generator</h2></span>
      <div>
        <p>Generate AI images! Adjust the complexity and size with the sliders.</p>
        <div className="sliders-wrapper">
          <div className="slider-container">
            <input 
              type="range" 
              id="complexityLevel" 
              name="complexityLevel" 
              min="0" 
              max="100" 
              value={complexityLevel} 
              onChange={(e) => handleSliderChange(e, setComplexityLevel, 'complexityLevel')} 
            />
            <div className="slider-text" id="complexityLevelText">GM</div>
            <label htmlFor="complexityLevel">Complexity Level: {complexityLevel}</label>
          </div>
          <div className="slider-container">
            <input 
              type="range" 
              id="imageSize" 
              name="imageSize" 
              min="512" 
              max="2048" 
              step="128" 
              value={imageSize} 
              onChange={(e) => handleSliderChange(e, setImageSize, 'imageSize')} 
            />
            <div className="slider-text" id="imageSizeText">GM</div>
            <label htmlFor="imageSize">Image Size: {imageSize}x{imageSize}</label>
          </div>
        </div>
      </div>
      <div className="recessed-field3">
        {result ? <img src={result} alt="Generated AI" id="aiGeneratedImage" /> : <p>Your generated image will appear here...</p>}
      </div>
      <div className="image-button-container">
        <button onClick={handleGenerate} className="image-action-button">
          Generate
        </button>
        <button onClick={handleCopy} className="image-action-button">
          Copy
        </button>
        <button onClick={handleShare} className="image-action-button">
          Share
        </button>
      </div>
      {showInfo && (
        <div className="machine-info-screen show">
          <div className="machine-info-content">
            <FontAwesomeIcon icon={faCircleXmark} className="machine-info-close" onClick={() => setShowInfo(false)} />
            <h2>Information</h2>
            <p>This is the information screen for the AI Image Generator module.</p>
          </div>
        </div>
      )}
      <ShareModal 
        isOpen={isModalOpen} 
        onRequestClose={() => setIsModalOpen(false)} 
        url={typeof window !== 'undefined' ? window.location.href : ''} 
        text={result} 
      />
    </div>
  );
}

