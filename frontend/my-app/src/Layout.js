import React, { useState } from 'react';
import './css/Layout.css';
import ErrorBoundary from './js/errorhandling'; // Import the ErrorBoundary component

const Layout = ({ children }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const openNav = () => {
    setIsNavOpen(true);
  }

  const closeNav = () => {
    setIsNavOpen(false);
  }

  return (
      <div className="layout">
        <div id="myNav" className={`overlay ${isNavOpen ? 'open' : ''}`}>
          <button className="closebtn" onClick={closeNav}>&times;</button>
          <div className="overlay-content">
            <a href="/">About</a>
            <a href="app">Calculator</a>
            <a href="pong">Game</a>
          </div>
        </div>
        <button className = "Menu" onClick={openNav}>-Menu-</button>
        <main className="layout-content">
        <ErrorBoundary>
          {children}
          </ErrorBoundary>
        </main>
      </div>
  );
}

export default Layout;
