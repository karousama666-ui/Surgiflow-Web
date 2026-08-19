import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import './Login.css'; 

import logoSurgiflow from '../assets/logo_surgiflowdark.png';
import bgVideo from '../assets/surgiflowbackground.mp4';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null); // Novo estado para mensagem de sucesso
  
  const navigate = useNavigate();

  // Função original de ENTRAR
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    setSucesso(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErro("E-mail ou senha incorretos. Tente novamente.");
    } else {
      navigate("/dashboard"); // Redireciona para o Dashboard após login bem-sucedido
    }
  };

  // NOVA Função de CADASTRAR (Plano B)
  const handleSignUp = async () => {
    if (!email || password.length < 6) {
      setErro("Preencha o e-mail e use uma senha de no mínimo 6 caracteres.");
      return;
    }
    setLoading(true);
    setErro(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErro("Erro ao criar conta: " + error.message);
    } else {
      setSucesso("Conta criada com sucesso! Você já pode clicar em Entrar.");
    }
  };

  return (
    <div className="login-container">
      <video autoPlay loop muted playsInline className="background-video">
        <source src={bgVideo} type="video/mp4" />
      </video>

      <div className="overlay"></div>

      <div className="login-card">
        <div className="login-header">
          <img 
            src={logoSurgiflow} 
            alt="Logo SurgiFlow" 
            style={{ width: '200px', margin: '0 auto 0.5rem auto', display: 'block' }} 
          />
          <p>Acesse sua conta para continuar</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {erro && (
            <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "10px", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "15px", textAlign: "center", fontWeight: "600" }}>
              {erro}
            </div>
          )}
          
          {sucesso && (
            <div style={{ background: "#dcfce7", color: "#166534", padding: "10px", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "15px", textAlign: "center", fontWeight: "600" }}>
              {sucesso}
            </div>
          )}

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
            <label htmlFor="password">Senha (mín. 6 caracteres)</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button type="submit" className="login-button" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Aguarde...' : 'Entrar'}
            </button>
            
            {/* NOVO BOTÃO DE CADASTRAR */}
            <button type="button" onClick={handleSignUp} className="login-button" disabled={loading} style={{ flex: 1, background: "#475569" }}>
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;