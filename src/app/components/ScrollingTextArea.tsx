"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

// Dynamically import the emoji picker component
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function ScrollingTextArea() {
  const initialMessages = [
    "Good Morning!",
    "Have a great day!",
    "Stay positive and happy!",
    "Success is not final, failure is not fatal.",
    "Keep pushing forward! 🚀",
  ];

  const [messages, setMessages] = useState<string[]>(initialMessages);
  const [newMessage, setNewMessage] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (messages.length > 0) {
        setMessages((prevMessages) => [...prevMessages.slice(1), prevMessages[0]]);
      }
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(intervalId);
  }, [messages]);

  const handleAddMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setNewMessage("");
    }
  };

  const handleResetMessages = () => {
    setMessages([]);
  };

  const onEmojiClick = (event, emojiObject) => {
    setNewMessage((newMessage) => newMessage + emojiObject.emoji);
  };

  const handleGenerateMessage = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: 'Generate a positive and motivational message:', type: 'text' }),
      });

      const data = await response.json();
      if (response.ok) {
        setNewMessage(data.choices[0].text.trim());
      } else {
        console.error('Error generating message:', data.message);
      }
    } catch (error) {
      console.error('Error generating message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scrolling-text-area">
      <div className="scrolling-text-top-container">
        <div className="scrolling-text-header-box">
          <h1>MESSAGES</h1>
        </div>
        <div className="scrolling-text-info-icon-box">
          <div className="scrolling-text-info-icon" onClick={() => setShowInfo(true)}>
            <FontAwesomeIcon icon={faInfoCircle} />
          </div>
        </div>
      </div>
      <div className="scrolling-text-container">
        <div className="scrolling-text">
          {messages.map((message, index) => (
            <span key={index}>{message}</span>
          ))}
        </div>
      </div>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enter your message"
        />
      </div>
      <div className="message-input">
        <button onClick={handleAddMessage}>Add</button>
        <button onClick={handleResetMessages}>Reset</button>
        <button onClick={handleGenerateMessage} disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {showInfo && (
        <div className="scrolling-text-info-screen show">
          <div className="scrolling-text-info-content">
            <FontAwesomeIcon icon={faCircleXmark} className="scrolling-text-info-close" onClick={() => setShowInfo(false)} />
            <h2>Information</h2>
            <p>This is the information screen for the Scrolling Text Area module.</p>
          </div>
        </div>
      )}
    </div>
  );
}
