import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Router>
      <AppInner loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
    </Router>
  );
}

function AppInner({ loggedIn, setLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Check for token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoggedIn(!!token); // sets true if token exists
  }, [setLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    if (location.pathname === '/dashboard') {
      navigate('/');
    }
  };

  return (
    <>
        <nav>
          <Link to="/">Home</Link> |{' '}
          {!loggedIn && <Link to="/login">Login</Link>} |{' '}
          {!loggedIn && <Link to="/register">Register</Link>} |{' '}
          {loggedIn && <Link to="/dashboard">Dashboard</Link>} |{' '}
          {loggedIn && <button onClick={handleLogout}>Logout</button>}
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={() => setLoggedIn(true)} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    </>
  );
}

export default App;
