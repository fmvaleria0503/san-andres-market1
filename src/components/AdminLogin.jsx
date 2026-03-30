import React, { useState } from 'react';
import { FiLock, FiMail, FiEye, FiEyeOff } from 'react-icons/fi';
import './AdminLogin.css';

const AdminLogin = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        // Guardar token en localStorage
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.usuario));

        onLoginSuccess(data.usuario);
      } else {
        setError(data.mensaje || 'Error en el login');
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError('Error de conexión. Verifica que el servidor esté corriendo.');
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="login-header">
          <div className="admin-icon">
            <FiLock />
          </div>
          <h1>Panel de Administración</h1>
          <p>MarketPin - Acceso Restringido</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">
              <FiMail /> Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@marketpin.com"
              required
              disabled={cargando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <FiLock /> Contraseña
            </label>
            <div className="password-input-container">
              <input
                type={mostrarPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={cargando}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                disabled={cargando}
              >
                {mostrarPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={cargando}
          >
            {cargando ? 'Iniciando sesión...' : 'Acceder al Panel'}
          </button>
        </form>

        <div className="login-footer">
          <p>Acceso exclusivo para administradores de MarketPin</p>
          <div className="security-notice">
            🔒 Esta sesión es monitoreada y registrada
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;