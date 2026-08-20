import React from 'react';
import "./Sidebar.css";
import Logo from "./Logo"; 
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  CalendarDays,
  Calendar,
  Users,
  ClipboardList,
  FileText,
  Settings,
  LifeBuoy // 👈 Ícone novo para o card de suporte!
} from "lucide-react";

function Sidebar() {
  // Estilo elegante para os títulos separadores do menu
  const categoryStyle = {
    fontSize: "0.7rem",
    fontWeight: "800",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    marginTop: "25px",
    marginBottom: "10px",
    paddingLeft: "15px", 
    display: "block"
  };

  // Estilo do novo card de suporte 
  const supportCardStyle = {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "16px",
    margin: "auto 15px 20px 15px", // O 'auto' empurra ele delicadamente para o fundo
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02)"
  };

  return (
    <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Logo />

      {/* flex: 1 faz o menu ocupar o espaço disponível e empurrar o suporte pro fim */}
      <nav style={{ flex: 1, overflowY: 'auto' }}>
        
        <span style={categoryStyle}>Gerenciamento</span>
        <NavLink to="/dashboard" end>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink to="/agenda">
          <CalendarDays size={20} />
          Agenda
        </NavLink>

        <NavLink to="/calendario">
          <Calendar size={20} />
          Calendário
        </NavLink>

        <span style={categoryStyle}>Rede</span>
        <NavLink to="/medicos">
          <Users size={20} />
          Médicos
        </NavLink>

        <NavLink to="/pedidos">
          <ClipboardList size={20} />
          Pedidos
        </NavLink>

        <span style={categoryStyle}>Sistema</span>
        <NavLink to="/relatorios">
          <FileText size={20} />
          Relatórios
        </NavLink>

        <NavLink to="/configuracoes">
          <Settings size={20} />
          Configurações
        </NavLink>
      </nav>

      {/* NOVO: CARD DE SUPORTE (Substituindo o perfil hardcoded) */}
      <div style={supportCardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6C63FF", fontWeight: "800", fontSize: "0.9rem" }}>
          <LifeBuoy size={18} strokeWidth={2.5} />
          <span>Precisa de Ajuda?</span>
        </div>
        <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b", lineHeight: "1.4", fontWeight: "500" }}>
          Fale com nosso suporte técnico ou acesse os guias da plataforma.
        </p>
        <button style={{
          marginTop: "4px", background: "white", border: "1px solid #cbd5e1", 
          color: "#475569", borderRadius: "8px", padding: "8px", fontSize: "0.8rem", 
          fontWeight: "700", cursor: "pointer", transition: "0.2s", fontFamily: "inherit"
        }}
        onMouseOver={(e) => {
            e.currentTarget.style.borderColor = "#6C63FF";
            e.currentTarget.style.color = "#6C63FF";
        }}
        onMouseOut={(e) => {
            e.currentTarget.style.borderColor = "#cbd5e1";
            e.currentTarget.style.color = "#475569";
        }}
        >
          Falar com Suporte
        </button>
      </div>

    </aside>
  )
}

export default Sidebar;