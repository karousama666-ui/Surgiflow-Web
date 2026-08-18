import React, { useState } from 'react';
import { User, Building, ShieldCheck, CreditCard } from "lucide-react";
import "./Configuracoes.css";

function Configuracoes() {
  const [form, setForm] = useState({
    nome: "Carolina Ramos",
    cargo: "Biomédica",
    email: "carolina@surgiflow.com",
    telefone: "(11) 99999-9999",
    empresa: "SurgiFlow – Plataforma de Agendamento e Controle Cirúrgico",
    notificacoesEmail: true,
    notificacoesSistema: true
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  }

  function handleSave(e) {
    e.preventDefault();
    alert("Configurações salvas com sucesso!");
  }

  return (
    <div className="configuracoes-container">
      <div className="configuracoes-header">
        <h1>Configurações do Sistema</h1>
        <p>Gerencie as informações da sua conta, preferências e assinatura.</p>
      </div>

      <form onSubmit={handleSave}>
        {/* Seção de Perfil */}
        <div className="config-section">
          <h3>
            <User size={20} color="#6C63FF" />
            Perfil do Usuário
          </h3>
          <div className="config-grid">
            <div className="config-field">
              <label>Nome Completo</label>
              <input 
                type="text" 
                name="nome" 
                value={form.nome} 
                onChange={handleChange} 
                className="config-input" 
              />
            </div>

            <div className="config-field">
              <label>Cargo / Profissão</label>
              <input 
                type="text" 
                name="cargo" 
                value={form.cargo} 
                onChange={handleChange} 
                className="config-input" 
              />
            </div>

            <div className="config-field">
              <label>E-mail de Acesso</label>
              <input 
                type="email" 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                className="config-input" 
              />
            </div>

            <div className="config-field">
              <label>Telefone / WhatsApp</label>
              <input 
                type="text" 
                name="telefone" 
                value={form.telefone} 
                onChange={handleChange} 
                className="config-input" 
              />
            </div>
          </div>
        </div>

        {/* Seção de Empresa / Consultoria */}
        <div className="config-section">
          <h3>
            <Building size={20} color="#6C63FF" />
            Dados da Organização
          </h3>
          <div className="config-grid">
            <div className="config-field full-width">
              <label>Nome da Organização / Projeto</label>
              <input 
                type="text" 
                name="empresa" 
                value={form.empresa} 
                onChange={handleChange} 
                className="config-input" 
              />
            </div>
          </div>
        </div>

        {/* Seção de Planos e Pagamentos */}
        <div className="config-section">
          <h3>
            <CreditCard size={20} color="#6C63FF" />
            Planos e Pagamentos
          </h3>
          <div className="plan-card-container" style={{ 
            background: "#f8fafc", 
            border: "1px solid #e2e8f0", 
            borderRadius: "14px", 
            padding: "20px", 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px"
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span style={{ fontWeight: "700", fontSize: "1.1rem", color: "#1e293b" }}>Plano Profissional SurgiFlow</span>
                <span style={{ background: "#dcfce7", color: "#15803d", fontSize: "0.75rem", padding: "2px 8px", borderRadius: "20px", fontWeight: "600" }}>Ativo</span>
              </div>
              <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>Acesso ilimitado a cirurgias, controle de médicos e relatórios avançados.</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ display: "block", fontSize: "1.25rem", fontWeight: "700", color: "#6C63FF" }}>R$ 149,90 <small style={{ fontSize: "0.8rem", color: "#64748b" }}>/mês</small></span>
              <button 
                type="button" 
                onClick={() => alert("Gerenciamento de cartão de crédito em breve!")}
                style={{ 
                  marginTop: "8px", 
                  background: "transparent", 
                  color: "#6C63FF", 
                  border: "1px solid #6C63FF", 
                  padding: "6px 14px", 
                  borderRadius: "8px", 
                  fontWeight: "600", 
                  cursor: "pointer",
                  fontSize: "0.85rem"
                }}
              >
                Gerenciar Cartão
              </button>
            </div>
          </div>
        </div>

        {/* Seção de Segurança e Notificações */}
        <div className="config-section">
          <h3>
            <ShieldCheck size={20} color="#6C63FF" />
            Preferências e Notificações
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.95rem", color: "#334155", cursor: "pointer" }}>
              <input 
                type="checkbox" 
                name="notificacoesEmail" 
                checked={form.notificacoesEmail} 
                onChange={handleChange} 
                style={{ width: "18px", height: "18px", accentColor: "#6C63FF" }}
              />
              Receber alertas de cirurgias pendentes por e-mail
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.95rem", color: "#334155", cursor: "pointer" }}>
              <input 
                type="checkbox" 
                name="notificacoesSistema" 
                checked={form.notificacoesSistema} 
                onChange={handleChange} 
                style={{ width: "18px", height: "18px", accentColor: "#6C63FF" }}
              />
              Exibir notificações visuais no painel do Dashboard
            </label>
          </div>
        </div>

        <div className="config-actions">
          <button type="submit" className="btn-salver-config">
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
}

export default Configuracoes;