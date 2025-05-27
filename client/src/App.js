import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PublicProfile from './pages/PublicProfile';
import NewDream from './pages/NewDream';
import SearchBar from './components/SearchBar';
import EditProfile from './pages/EditProfile';
import api from './api';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Router>
      <AppInner loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
    </Router>
  );
}

function AppInner({ loggedIn, setLoggedIn }) {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoggedIn(!!token); // sets true if token exists

    if (token) {
      api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setCurrentUser(res.data))
        .catch(err => {
          console.error('Failed to fetch current user:', err);
          localStorage.removeItem('token');
          setLoggedIn(false);
        });
    }
  }, [setLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    setCurrentUser(null);
    if (location.pathname === '/dashboard') {
      navigate('/');
    }
  };

  return (
    <>
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Link to="/">Home</Link>{' '}
            {!loggedIn && <Link to="/login">Login</Link>}{' '}
            {!loggedIn && <Link to="/register">Register</Link>}{' '}
            {loggedIn && <Link to="/dashboard">Dashboard</Link>}{' '}
            {loggedIn && <button onClick={handleLogout}>Logout</button>}
          </div>
          <SearchBar />
        </nav>

        <Routes>
          <Route path="/" element={<Home loggedIn={loggedIn} />} />
          <Route path="/login" element={<Login onLogin={() => setLoggedIn(true)} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-dream" element={<NewDream />} />
          <Route path="/users/:username" element={<PublicProfile loggedIn={loggedIn} currentUser={currentUser} />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Routes>
    </>
  );
}

export default App;
