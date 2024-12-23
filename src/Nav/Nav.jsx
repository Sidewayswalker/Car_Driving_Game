import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from '../App/App.jsx';
import Game from '../Game/Game.jsx';
import './Nav.css';

function Nav() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      
      <Route path="/game" element={<Game />} />
      
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
}

export default Nav;
