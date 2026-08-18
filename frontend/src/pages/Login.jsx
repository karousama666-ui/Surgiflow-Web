import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

// Importando a imagem e o vídeo diretamente da pasta assets
import logoSurgiflow from '../assets/logo_surgiflowdark.png';
import bgVideo from '../assets/surgiflowbackground.mp4';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Agora, ao clicar no botão, ele te leva direto para o Dashboard!
    navigate('/dashboard'); 
  };

  return (
    <div className="login-container">
      {/* Vídeo de Fundo */}
      <video autoPlay loop muted playsInline className="background-video">
        <source src={bgVideo} type="video/mp4" />
        Seu navegador não suporta vídeos.
      </video>

      {/* Camada de sobreposição para escurecer o vídeo e dar destaque ao login */}
      <div className="overlay"></div>

      {/* Card de Login */}
      <div className="login-card">
        <div className="login-header">
          {/* A sua logo oficial renderizada aqui */}
          <img 
            src={logoSurgiflow} 
            alt="Logo SurgiFlow" 
            style={{ width: '200px', margin: '0 auto 0.5rem auto', display: 'block' }} 
          />
          <p>Acesse sua conta para continuar</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="email">E-mail Corporativo</label>
            <input
              type="email"
              id="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;