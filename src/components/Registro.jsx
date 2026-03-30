import React, { useState } from 'react';
import './Registro.css';

const Registro = ({ onClose, onRegister, onLogin, usuario }) => {
  const [mode, setMode] = useState('register');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'register') {
      onRegister({ nombre, email, password, role });
    } else {
      onLogin({ email, password });
    }
  };

  return (
    <div className="registro-overlay" onClick={onClose}>
      <div className="registro-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{mode === 'register' ? 'Crear cuenta' : 'Ingresar'}</h2>
        <form onSubmit={handleSubmit} className="registro-form">
          {mode === 'register' && (
            <input
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {mode === 'register' && (
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          )}
          <button type="submit">{mode === 'register' ? 'Crear cuenta' : 'Ingresar'}</button>
        </form>
        <div className="registro-footer">
          <span onClick={() => setMode(mode === 'register' ? 'login' : 'register')} className="link">
            {mode === 'register' ? 'Ya tienes cuenta? Ingresar' : 'Crear cuenta nueva'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Registro;