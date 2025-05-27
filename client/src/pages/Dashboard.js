// import React, { useEffect, useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import api from '../api';

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState('');

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }

//     // Example protected route to fetch user info
//     api.get('/auth/me', {
//       headers: { Authorization: `Bearer ${token}` }
//     })
//     .then(res => setUsername(res.data.username))
//     .catch(() => {
//       localStorage.removeItem('token');
//       navigate('/login');
//     });
//   }, [navigate]);

//   return (
//     <div>
//       <div style={{ padding: '2rem' }}>
//         <h2>Welcome back, {username} 🌌</h2>
//         <p>Here's your dream journal dashboard. You can view or add new dreams.</p>
//       </div>
//       <Link to="/new-dream">
//         <button>Add New Dream</button>
//       </Link>
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import api from '../api';
import DreamEntry from '../components/DreamEntry';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [dreams, setDreams] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchData = async () => {
      try {
        const userRes = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsername(userRes.data.username);

        const dreamRes = await api.get('/dreams', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDreams(dreamRes.data);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{username}'s Dream Journal 🌙</h2>

      {/* ✅ Add New Dream Button */}
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/new-dream">
          <button>Add New Dream</button>
        </Link>
      </div>

      {/* List of dreams */}
      {dreams.map((dream) => (
        <DreamEntry key={dream.id} dream={dream} />
      ))}
    </div>

  );
}
