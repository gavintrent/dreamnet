import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PublicProfile from './pages/PublicProfile';
import NewDream from './pages/NewDream';
import EditProfile from './pages/EditProfile';
import api from './api';
import Navbar from './components/Navbar';
//import PageFooter from './components/PageFooter';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    
    <div className="min-h-screen bg-[#332e4e] text-white pb-4">
      <Router>
        <AppInner loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      </Router>
    </div>
  );
}

function AppInner({ loggedIn, setLoggedIn }) {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const hideNavbar = ['/login', '/register'].includes(location.pathname)

  // on mount just set loggedIn from token once
  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoggedIn(!!token);
  }, [setLoggedIn]);

  // whenever loggedIn becomes true, fetch the current user
  useEffect(() => {
    if (!loggedIn) {
      setCurrentUser(null);
      return;
    }

    const token = localStorage.getItem('token');
    api
      .get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        const userData = res.data;
        const profileRes = await api.get(`/users/${userData.username}/profile`);
        setCurrentUser({ ...userData, profile: profileRes.data });
      })
      .catch((err) => {
        console.error('Failed to fetch current user:', err);
        localStorage.removeItem('token');
        setLoggedIn(false);
      });
  }, [loggedIn, setLoggedIn]);

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
      <div className="min-h-screen flex flex-col">
        {!hideNavbar && (
          <Navbar loggedIn={loggedIn} onLogout={handleLogout} currentUser={currentUser} />
        )}
        <main className="flex-grow pt-4">
          <Routes>
            <Route path="/" 
              element={ loggedIn 
                ? <Home loggedIn={loggedIn} />
                : <Navigate to="/login" replace />
              } />
            <Route path="/login" element={ loggedIn
              ? <Navigate to="/" replace />
              : <Login onLogin={() => setLoggedIn(true)} />
            } />
            <Route path="/register" element={ loggedIn
              ? <Navigate to="/" replace />
              : <Register />
            } />
            <Route path="/dashboard" 
              element={ loggedIn
                ? <Dashboard />
                : <Navigate to="/login" replace />
              } />
            <Route path="/new-dream" 
              element={ loggedIn
                ? <NewDream />
                : <Navigate to="/login" replace />
              } />
            <Route path="/users/:username" 
              element= {<PublicProfile loggedIn={loggedIn} currentUser={currentUser} />}
                />
            <Route path="/edit-profile" 
              element={ loggedIn
                ? <EditProfile />
                : <Navigate to="/login" replace />
              } />
          </Routes>
        </main>
        {/* {!hideNavbar && (<PageFooter ></PageFooter>)} */}

      </div>
    </>
  );
}

export default App;
