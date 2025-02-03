import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export function Games() {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchUser();
    }, []);
  
    return (
      <div>
        <h2>Welcome to Games Page</h2>
        {user && (
          <div>
            <p>Name: {user.first_name} {user.surname}</p>
            <p>Email: {user.email}</p>
          </div>
        )}
        <p>Here you can find some cool games to play in the future!</p>
        <div>
          <Link to="/dashboard">Back to Dashboard</Link>
        </div>
      </div>
    );
  }