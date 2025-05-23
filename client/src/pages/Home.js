import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>🌙 Welcome to DreamNet</h1>
      <p>A social dream journal where you can record and share your dreams with others.</p>
      <p>
        <Link to="/register">Register</Link> or <Link to="/login">Login</Link> to get started.
      </p>
    </div>
  );
}