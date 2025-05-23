import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import { Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        
        <nav>
          <Link to="/">Home</Link> |{' '}
          <Link to="/login">Login</Link> |{' '}
          <Link to="/register">Register</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>

      </div>
    </Router>
  );
}



export default App;
