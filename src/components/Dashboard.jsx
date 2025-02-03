import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location = '/login';
  };

  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/appointments', {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        console.log("Fetched Appointments:", response.data); // Логируем данные
        setAppointments(response.data);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
      }
    };
    fetchAppointments();
  }, []);

const [newAppointment, setNewAppointment] = useState({
    doctor_id: '',
    appointment_date: '',
    reason: ''
  });
  
  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/appointments', newAppointment, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Обновить список записей
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Welcome to Dashboard</h2>
      {user && (
        <div>
          <p>Name: {user.first_name} {user.surname}</p>
          <p>Email: {user.email}</p>
        </div>
      )}
      {appointments.map(app => (
  <div key={app.appointment_id}>
    <p>Doctor: {app.first_name} {app.surname}</p>
    <p>Date: {new Date(app.appointment_date).toLocaleString()}</p>
    <p>Reason: {app.reason}</p>
  </div>
))}
      <button onClick={handleLogout}>Logout</button>
      <p>Here you can find some cool games to play in the future!</p>
      <div>
      <Link to="/games">Go to Games</Link>
      </div>
    </div>
    
    
  );
}