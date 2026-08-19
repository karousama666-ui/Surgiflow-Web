import React, { useState } from 'react';
import { User, Building, ShieldCheck, CreditCard, Stethoscope, Award, Save } from "lucide-react";
import "./Configuracoes.css";

function Configuracoes() {
  const [form, setForm] = useState({
    nome: "Carolina Ramos",
    cargo: "Biomédica / Consultora Regulatória",
    registro: "CRBM 12345",
    email: "contato@sanora.com.br",
    telefone: "(11) 99999-9999",
    empresa: "Sanora – Compliance & Regulação Sanitária",
    cnpj: "00.000.000/0001-00",
    notificacoesEmail: true,
    notificacoesSistema: true,
    rdc16: true,
    rdc665: true,
    auditoriaOpme: true
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
    alert("Configurações atualizadas e salvas com sucesso!");
  }

  // Estilos de apoio para garantir que fique elegante mesmo sem o CSS completo
  const sectionStyle = {
    background: "#fff", padding: "25px", borderRadius: "16px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.02)", border: "1px solid #f1f5f9",
    marginBottom: "20px"
  };

  const headerStyle = {
    display: "flex", alignItems: "center", gap: "10px", 
    color: "#1e293b", fontSize: "1.1rem", fontWeight: "600",
    marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid #e2e8f0"
  };

  return (
    <div className="configuracoes-container" style={{ paddingBottom: "40px", maxWidth: "950px", margin: "0 auto" }}>
      
      {/* Cabeçalho */}
      <div className="configuracoes-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", color: "#1e293b", margin: "0 0 4px 0", fontWeight: "700" }}>
            Configurações do Sistema
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.95rem", margin: 0 }}>
            Gerencie seu perfil, parâmetros de qualidade e assinatura.
          </p>
        </div>
        <button 
          onClick={handleSave}
          style={{ background: "#6C63FF", color: "white", border: "none", borderRadius: "10px", padding: "12px 24px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "0.2s" }}
        >
          <Save size={18} /> Salvar Alterações
        </button>
      </div>

      <form onSubmit={handleSave}>
        
        {/* Seção de Perfil */}
        <div className="config-section" style={sectionStyle}>
          <div style={headerStyle}>
            <User size={20} color="#6C63FF" /> Perfil Profissional
          </div>
          <div className="config-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
            <div className="config-field">
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#475569" }}>Nome Completo</label>
              <input type="text" name="nome" value={form.nome} onChange={handleChange} className="config-input" style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", marginTop: "5px", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div className="config-field">
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#475569" }}>Cargo / Especialidade</label>
              <input type="text" name="cargo" value={form.cargo} onChange={handleChange} className="config-input" style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", marginTop: "5px", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div className="config-field">
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#475569" }}>Registro (Conselho)</label>
              <input type="text" name="registro" value={form.registro} onChange={handleChange} className="config-input" style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", marginTop: "5px", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div className="config-field">
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#475569" }}>E-mail de Acesso</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="config-input" style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", marginTop: "5px", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div className="config-field">
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#475569" }}>Telefone / WhatsApp</label>
              <input type="text" name="telefone" value={form.telefone} onChange={handleChange} className="config-input" style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", marginTop: "5px", outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>
        </div>

        {/* Seção de Empresa / Organização */}
        <div className="config-section" style={sectionStyle}>
          <div style={headerStyle}>
            <Building size={20} color="#10b981" /> Dados da Organização
          </div>
          <div className="config-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
            <div className="config-field">
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#475569" }}>Nome da Organização / Marca</label>
              <input type="text" name="empresa" value={form.empresa} onChange={handleChange} className="config-input" style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", marginTop: "5px", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div className="config-field">
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#475569" }}>CNPJ</label>
              <input type="text" name="cnpj" value={form.cnpj} onChange={handleChange} className="config-input" style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", marginTop: "5px", outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>
        </div>

        {/* NOVA: Seção de Compliance (O Pulo do Gato!) */}
        <div className="config-section" style={sectionStyle}>
          <div style={headerStyle}>
            <Award size={20} color="#f59e0b" /> Qualidade e Compliance
          </div>
          <p style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: "20px" }}>Ative as resoluções sanitárias aplicáveis para vincular a rastreabilidade automaticamente aos pedidos de OPME.</p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.95rem", color: "#334155", cursor: "pointer", fontWeight: "500" }}>
              <input type="checkbox" name="rdc665" checked={form.rdc665} onChange={handleChange} style={{ width: "18px", height: "18px", accentColor: "#6C63FF" }} />
              Habilitar protocolos da RDC 665/2022 (Boas Práticas de Fabricação e Uso)
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.95rem", color: "#334155", cursor: "pointer", fontWeight: "500" }}>
              <input type="checkbox" name="rdc16" checked={form.rdc16} onChange={handleChange} style={{ width: "18px", height: "18px", accentColor: "#6C63FF" }} />
              Monitoramento rígido RDC 16/2013 (Foco em OPME)
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.95rem", color: "#334155", cursor: "pointer", fontWeight: "500" }}>
              <input type="checkbox" name="auditoriaOpme" checked={form.auditoriaOpme} onChange={handleChange} style={{ width: "18px", height: "18px", accentColor: "#6C63FF" }} />
              Exigir fornecedor e rastreabilidade para liberação de Auditoria
            </label>
          </div>
        </div>

        {/* Seção de Segurança e Notificações */}
        <div className="config-section" style={sectionStyle}>
          <div style={headerStyle}>
            <ShieldCheck size={20} color="#6C63FF" /> Segurança e Notificações
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.95rem", color: "#334155", cursor: "pointer", fontWeight: "500" }}>
              <input type="checkbox" name="notificacoesEmail" checked={form.notificacoesEmail} onChange={handleChange} style={{ width: "18px", height: "18px", accentColor: "#6C63FF" }} />
              Receber relatórios e alertas de OPME pendentes por e-mail
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.95rem", color: "#334155", cursor: "pointer", fontWeight: "500" }}>
              <input type="checkbox" name="notificacoesSistema" checked={form.notificacoesSistema} onChange={handleChange} style={{ width: "18px", height: "18px", accentColor: "#6C63FF" }} />
              Exibir notificações visuais de agendamento no Dashboard
            </label>
          </div>
        </div>

        {/* Seção de Planos e Pagamentos (Aprimorada) */}
        <div className="config-section" style={sectionStyle}>
          <div style={headerStyle}>
            <CreditCard size={20} color="#6C63FF" /> Assinatura e Pagamentos
          </div>
          <div className="plan-card-container" style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span style={{ fontWeight: "700", fontSize: "1.1rem", color: "#1e293b" }}>Plano Corporate SurgiFlow</span>
                <span style={{ background: "#dcfce7", color: "#15803d", fontSize: "0.75rem", padding: "4px 10px", borderRadius: "20px", fontWeight: "700", border: "1px solid #bbf7d0" }}>ATIVO</span>
              </div>
              <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>Acesso ilimitado a cirurgias, OPME auditável e relatórios avançados de compliance.</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ display: "block", fontSize: "1.25rem", fontWeight: "700", color: "#6C63FF" }}>
                R$ 149,90 <small style={{ fontSize: "0.8rem", color: "#64748b" }}>/mês</small>
              </span>
              <button type="button" onClick={() => alert("Gerenciamento financeiro em breve!")} style={{ marginTop: "10px", background: "white", color: "#6C63FF", border: "1px solid #6C63FF", padding: "8px 16px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem", transition: "0.2s" }}>
                Gerenciar Cartão
              </button>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}

export default Configuracoes;