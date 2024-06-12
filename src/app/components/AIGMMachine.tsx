"use client"; // Ensure this component is treated as a client component
import { useState, useEffect } from "react";
import ShareModal from './ShareModal'; // Adjust the path as necessary
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faInfoCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons'; // Import the specific icons

export default function AIGMMachine() {
  const [prefix, setPrefix] = useState('Good Morning');
  const [selectedTags, setSelectedTags] = useState([]);
  const [numCharacters, setNumCharacters] = useState(280); // default to 280 characters
  const [result, setResult] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false); // State for showing info

  const tags = ['Inspiration', 'Motivation', 'Wisdom', 'Happiness', 'Love', 'Friendship', 'Success', 'Life', 'Hope'];

  const handleTagClick = (tag) => {
    setSelectedTags(prevSelectedTags => 
      prevSelectedTags.includes(tag) 
        ? prevSelectedTags.filter(t => t !== tag) 
        : [...prevSelectedTags, tag]
    );
  };

  const handleGenerate = async () => {
    const prompt = `${prefix} ${selectedTags.length > 0 ? selectedTags.join(', ') + ' ' : ''}quote`;
    
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, type: 'text', numCharacters }),
    });

    const data = await response.json();
    setResult(data.choices[0].text);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    alert('Text copied to clipboard!');
  };

  const handleShare = () => {
    setIsModalOpen(true);
  };

  const getSliderBackground = (value) => {
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

    const startColor = mixColor(darkBlue, lightBlue, percentage * 0.5); // More subtle range
    const endColor = mixColor(lightBlue, lightOrange, percentage * 0.5);

    return `linear-gradient(90deg, ${startColor} 0%, ${endColor} 100%)`;
  };

  useEffect(() => {
    if (typeof document !== 'undefined') { // Check if document is defined
      const numCharactersSlider = document.getElementById('numCharacters');
      if (numCharactersSlider) {
        const background = getSliderBackground(numCharacters);
        numCharactersSlider.style.background = background;
      }
    }
  }, [numCharacters]);

  return (
    <div className="text-machine">
      <div className="text-machine-top-container">
        <div className="text-machine-header-box">
          <h1>TEXT</h1>
        </div>
        <div className="text-machine-info-icon-box">
          <div className="text-machine-info-icon" onClick={() => setShowInfo(true)}>
            <FontAwesomeIcon icon={faInfoCircle} />
          </div>
        </div>
      </div>
      <span><h2>AI GM Quote Generator</h2></span>
      <div>
        <p>AI generated GM quotes! Add a tag or generate randomly.</p>
        <div className="text-tags-container-wrapper">
          <div className="text-tags-container">
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`text-action-button2 ${selectedTags.includes(tag) ? 'selected' : ''}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="text-sliders-row">
        <div className="text-gm-slider-container">
          <input 
            type="range" 
            id="numCharacters" 
            name="numCharacters" 
            className="text-gm-slider"
            min="10" 
            max="1000" 
            step="10" 
            value={numCharacters} 
            onChange={(e) => setNumCharacters(e.target.value)} 
          />
          <label htmlFor="numCharacters" className="text-gm-slider-label">Number of Characters: {numCharacters}/1000</label>
        </div>
      </div>
      <div className="text-recessed-field2">
        <h4 id="aiGeneratedText">
          {result || 'GM! As the sun rises, casting a warm golden glow upon the world, let us embrace this new day with love, hope, and happiness. Each morning brings a fresh opportunity to pursue our dreams, to spread kindness, and to cherish the moments that make life beautiful. GM! 🌞 Love is the foundation upon which we build our lives, the force that connects us to one another, and the energy that fuels our passion. In every GM, let love guide our actions, fill our hearts, and inspire us to create a world where everyone feels valued and cherished. 💖 Hope is the light that shines in the darkness, the promise of a better tomorrow, and the courage to face challenges with a positive outlook. With each GM, let hope uplift our spirits, remind us of our potential, and motivate us to keep moving forward, no matter the obstacles. 🌟 Happiness is the joy we find in simple pleasures, the laughter we share with friends, and the gratitude we feel for the blessings in our lives. Every GM is a chance to cultivate happiness, to appreciate the beauty around us, and to spread positivity wherever we go. 😊'}
        </h4>
      </div>
      <div className="text-button-container">
        <button
          onClick={handleGenerate}
          className={`text-action-button ${selectedTags.length > 0 ? 'selected-generate' : ''}`}
        >
          Generate
        </button>
        <button onClick={handleCopy} className="text-action-button">
          Copy
        </button>
        <button onClick={handleShare} className="text-action-button">
          Share
        </button>
      </div>
      {showInfo && (
        <div className="text-info-screen">
          <div className="text-info-content">
            <FontAwesomeIcon icon={faCircleXmark} className="text-info-close" onClick={() => setShowInfo(false)} />
            <h2>Information</h2>
            <p>This is an AI-powered GM quote generator. Adjust the settings and tags to customize your quote.</p>
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
