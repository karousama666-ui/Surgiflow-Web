import React, { useState } from 'react';
import { User, Building, ShieldCheck, CreditCard, Stethoscope, Award, Save, Check } from "lucide-react";
import "./Configuracoes.css";

// ==========================================
// COMPONENTE CUSTOMIZADO: CHECKBOX PREMIUM
// ==========================================
const CustomCheckbox = ({ label, name, checked, onChange }) => {
    return (
        <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", marginBottom: "16px", userSelect: "none" }}>
            <input 
                type="checkbox" 
                name={name} 
                checked={checked} 
                onChange={onChange} 
                style={{ display: "none" }} 
            />
            <div style={{
                width: "22px", height: "22px", borderRadius: "6px",
                background: checked ? "#6C63FF" : "#ffffff",
                border: checked ? "1px solid #6C63FF" : "1px solid #cbd5e1",
                display: "flex", justifyContent: "center", alignItems: "center",
                transition: "all 0.2s ease",
                boxShadow: checked ? "0 2px 8px rgba(108, 99, 255, 0.25)" : "none"
            }}>
                {checked && <Check size={16} color="white" strokeWidth={3} />}
            </div>
            <span style={{ color: "#334155", fontSize: "0.95rem", fontWeight: "600" }}>
                {label}
            </span>
        </label>
    );
};

// ==========================================
// TELA PRINCIPAL DE CONFIGURAÇÕES
// ==========================================
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
    console.log("Dados salvos:", form); 
  }

  const sectionStyle = {
    background: "#fff", padding: "30px", borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)", border: "1px solid #e2e8f0",
    marginBottom: "25px", fontFamily: "'Montserrat', 'Inter', sans-serif"
  };

  const headerStyle = {
    display: "flex", alignItems: "center", gap: "10px", 
    color: "#1e293b", fontSize: "1.2rem", fontWeight: "700",
    marginBottom: "20px", paddingBottom: "15px", borderBottom: "1px solid #f1f5f9"
  };

  const inputStyle = { 
      width: "100%", padding: "12px", border: "1px solid #cbd5e1", 
      borderRadius: "8px", marginTop: "6px", outline: "none", 
      boxSizing: "border-box", fontSize: "0.95rem", color: "#1e293b", fontFamily: "inherit"
  };

  return (
    <div className="configuracoes-container" style={{ paddingBottom: "40px", maxWidth: "950px", margin: "0 auto", fontFamily: "'Montserrat', 'Inter', sans-serif" }}>
      
      {/* Cabeçalho */}
      <div className="configuracoes-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", color: "#0f172a", margin: "0 0 4px 0", fontWeight: "800" }}>
            Configurações do Sistema
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.95rem", margin: 0, fontWeight: "500" }}>
            Gerencie seu perfil, parâmetros de qualidade e assinatura.
          </p>
        </div>
        <button 
          onClick={handleSave}
          style={{ background: "#6C63FF", color: "white", border: "none", borderRadius: "10px", padding: "14px 24px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "0.2s", boxShadow: "0 4px 14px rgba(108, 99, 255, 0.3)", fontFamily: "inherit" }}
          onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
          <Save size={20} /> Salvar Alterações
        </button>
      </div>

      <form onSubmit={handleSave}>
        
        {/* Seção de Perfil */}
        <div className="config-section" style={sectionStyle}>
          <div style={headerStyle}>
            <User size={22} color="#6C63FF" /> Perfil Profissional
          </div>
          <div className="config-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
            <div className="config-field">
              <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Nome Completo</label>
              <input type="text" name="nome" value={form.nome} onChange={handleChange} style={inputStyle} />
            </div>
            <div className="config-field">
              <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Cargo / Especialidade</label>
              <input type="text" name="cargo" value={form.cargo} onChange={handleChange} style={inputStyle} />
            </div>
            <div className="config-field">
              <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Registro (Conselho)</label>
              <input type="text" name="registro" value={form.registro} onChange={handleChange} style={inputStyle} />
            </div>
            <div className="config-field">
              <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>E-mail de Acesso</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} style={inputStyle} />
            </div>
            <div className="config-field">
              <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Telefone / WhatsApp</label>
              <input type="text" name="telefone" value={form.telefone} onChange={handleChange} style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Seção de Empresa / Organização */}
        <div className="config-section" style={sectionStyle}>
          <div style={headerStyle}>
            <Building size={22} color="#10b981" /> Dados da Organização
          </div>
          <div className="config-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
            <div className="config-field">
              <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Nome da Organização / Marca</label>
              <input type="text" name="empresa" value={form.empresa} onChange={handleChange} style={inputStyle} />
            </div>
            <div className="config-field">
              <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>CNPJ</label>
              <input type="text" name="cnpj" value={form.cnpj} onChange={handleChange} style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Seção de Compliance */}
        <div className="config-section" style={sectionStyle}>
          <div style={headerStyle}>
            <Award size={22} color="#f59e0b" /> Qualidade e Compliance
          </div>
          <p style={{ fontSize: "0.95rem", color: "#64748b", marginBottom: "25px", fontWeight: "500" }}>
            Ative as resoluções sanitárias aplicáveis para vincular a rastreabilidade automaticamente aos pedidos de OPME.
          </p>
          
          <div style={{ display: "flex", flexDirection: "column" }}>
            <CustomCheckbox 
                label="Habilitar protocolos da RDC 665/2022 (Boas Práticas de Fabricação e Uso)"
                name="rdc665" checked={form.rdc665} onChange={handleChange}
            />
            <CustomCheckbox 
                label="Monitoramento rígido RDC 16/2013 (Foco em OPME)"
                name="rdc16" checked={form.rdc16} onChange={handleChange}
            />
            <CustomCheckbox 
                label="Exigir fornecedor e rastreabilidade para liberação de Auditoria"
                name="auditoriaOpme" checked={form.auditoriaOpme} onChange={handleChange}
            />
          </div>
        </div>

        {/* Seção de Segurança e Notificações */}
        <div className="config-section" style={sectionStyle}>
          <div style={headerStyle}>
            <ShieldCheck size={22} color="#6C63FF" /> Segurança e Notificações
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <CustomCheckbox 
                label="Receber relatórios e alertas de OPME pendentes por e-mail"
                name="notificacoesEmail" checked={form.notificacoesEmail} onChange={handleChange}
            />
            <CustomCheckbox 
                label="Exibir notificações visuais de agendamento no Dashboard"
                name="notificacoesSistema" checked={form.notificacoesSistema} onChange={handleChange}
            />
          </div>
        </div>

        {/* Seção de Planos e Pagamentos (Aprimorada e Ligada ao Asaas) */}
        <div className="config-section" style={sectionStyle}>
          <div style={headerStyle}>
            <CreditCard size={22} color="#6C63FF" /> Assinatura e Pagamentos
          </div>
          <div className="plan-card-container" style={{ 
              background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "14px", 
              padding: "25px", display: "flex", justifyContent: "space-between", 
              alignItems: "center", flexWrap: "wrap", gap: "20px" 
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <h3 style={{ fontWeight: "700", fontSize: "1.15rem", color: "#0f172a", margin: 0 }}>
                    Plano Corporate SurgiFlow
                </h3>
                <span style={{ background: "#dcfce7", color: "#166534", fontSize: "0.75rem", padding: "4px 10px", borderRadius: "20px", fontWeight: "800", letterSpacing: "0.5px" }}>
                    ATIVO
                </span>
              </div>
              <p style={{ margin: 0, color: "#64748b", fontSize: "0.95rem", fontWeight: "500" }}>
                  Acesso ilimitado a cirurgias, OPME auditável e relatórios avançados de compliance.
              </p>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px", fontSize: "1.6rem", fontWeight: "800", color: "#6C63FF" }}>
                R$ 149,90 <span style={{ fontSize: "0.95rem", color: "#94a3b8", fontWeight: "600" }}>/mês</span>
              </div>
              
              {/* BOTÃO MÁGICO COM O SEU LINK DO ASAAS */}
              <button 
                  type="button" 
                  onClick={() => window.open("https://www.asaas.com/c/h7ut97drf19arp9a", "_blank")} 
                  style={{ 
                      background: "white", color: "#6C63FF", border: "1px solid #6C63FF", 
                      padding: "10px 20px", borderRadius: "8px", fontWeight: "700", 
                      cursor: "pointer", fontSize: "0.95rem", transition: "0.2s", fontFamily: "inherit"
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = "#f5f3ff"; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = "white"; }}
              >
                Assinar / Gerenciar Cartão
              </button>

            </div>
          </div>
        </div>

      </form>
    </div>
  );
}

export default Configuracoes;