"use client";
import { useState } from "react";

const DropdownMenu = ({ isOpen }) => {
  return (
    <div className={`dropdown-content ${isOpen ? 'open' : ''}`}>
      <div className="dropdown-section">
        <h3>GM Options</h3>
        <a href="hellogreen.html" className="nav-link">
          <div className="gm-drop-circle">GM</div>
        </a>
        <a href="hellopurple.html" className="nav-link">
          <div className="gn-drop-circle">GN</div>
        </a>
      </div>
      <div className="dropdown-section">
        <h3>More Options</h3>
        <a href="#link1" className="nav-link">
          Link 1
        </a>
        <a href="#link2" className="nav-link">
          Link 2
        </a>
        <a href="#link3" className="nav-link">
          Link 3
        </a>
      </div>
    </div>
  );
};

export default DropdownMenu;
