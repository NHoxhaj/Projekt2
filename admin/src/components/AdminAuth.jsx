import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import blu from '../../../server/public/assets/blu.png';
import '../App.css';
import { apiUrl } from '../config/api';

const AdminAuth = ({ setAdminLoggedIn, setAdmin }) => {
  const [isAdminLogin, setIsAdminLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isAdminLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const url = isAdminLogin ? apiUrl('/api/admin/login') : apiUrl('/api/admin/register');
    const data = isAdminLogin ? { email: formData.email, password: formData.password } : formData;

    try {
      const response = await axios.post(url, data, { withCredentials: true });
      if (response.status === 200 || response.status === 201) {
        setAdminLoggedIn(true);
        setAdmin(response.data.admin);
        navigate('/admin/orders');
      } else {
        setError(`${isAdminLogin ? 'Login' : 'Registration'} failed`);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className={`auth-formA ${isAdminLogin ? 'login-active' : 'register-active'}`}>
          <h2 className="auth-title">{isAdminLogin ? 'Login' : 'Register'}</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit} className="form-content">
            {!isAdminLogin && (
              <>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </>
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="input-field"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="input-field"
            />
            {!isAdminLogin && (
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleChange}
                required
                className="input-field"
              />
            )}
            <button type="submit" className="submit-buttonA">
              {isAdminLogin ? 'Logohu' : 'Rregjistrohu'}
            </button>
          </form>
        </div>
        <div className={`auth-toggle-containerA ${isAdminLogin ? 'toggle-left' : 'toggle-right'}`}>
        <div><img src={blu} alt="logo" className="logoblu" /> </div>
        
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
