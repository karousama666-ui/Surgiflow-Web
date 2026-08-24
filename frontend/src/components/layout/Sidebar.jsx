import React from 'react';
import "./Sidebar.css";
import Logo from "./Logo"; 
import { NavLink } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext"; // 👈 NOVO: Puxa o cérebro do tema

import {
  LayoutDashboard,
  CalendarDays,
  Calendar,
  Users,
  ClipboardList,
  FileText,
  Settings,
  Contact,
  X,
  Moon, // 👈 Ícone de Lua
  Sun   // 👈 Ícone de Sol
} from "lucide-react";

function Sidebar({ isOpen, onClose }) {
  
  // Puxa o estado atual (dark/light) e a função de trocar
  const { theme, toggleTheme } = useTheme();

  // Estilo elegante para os títulos separadores do menu
  const categoryStyle = {
    fontSize: "0.75rem",
    fontWeight: "800",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    marginTop: "25px",
    marginBottom: "10px",
    paddingLeft: "25px", 
    display: "block"
  };

  const navLinkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 20px",
    margin: "0 15px 5px 15px",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "0.95rem",
    transition: "all 0.2s ease",
    // 👇 Ajusta as cores do link dependendo do tema ativo 👇
    color: isActive ? "#6C63FF" : (theme === 'dark' ? "#94a3b8" : "#64748b"),
    background: isActive ? (theme === 'dark' ? "#1e1b4b" : "#eff6ff") : "transparent",
  });

  return (
    <>
      {/* TELA ESCURA DE FUNDO NO MOBILE */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      {/* A CLASSE DINÂMICA 'open' FAZ ELE DESLIZAR NO CELULAR */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100vh',
          width: '260px', 
          background: '#fff', // A classe CSS do App.jsx vai forçar o cinza chumbo se estiver dark
          borderRight: '1px solid #e2e8f0',
          flexShrink: 0
      }}>
        
        {/* Botão de Fechar Exclusivo do Celular */}
        <button className="close-sidebar-btn" onClick={onClose}>
            <X size={24} />
        </button>

        <div style={{ padding: "20px 0 10px 0" }}>
            <Logo />
        </div>

        <nav style={{ flex: 1, overflowY: 'auto', paddingBottom: '20px' }}>
          
          <span style={categoryStyle}>Gerenciamento</span>
          
          <NavLink to="/dashboard" end onClick={onClose} style={navLinkStyle}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          <NavLink to="/agenda" onClick={onClose} style={navLinkStyle}>
            <CalendarDays size={20} />
            Agenda
          </NavLink>

          <NavLink to="/calendario" onClick={onClose} style={navLinkStyle}>
            <Calendar size={20} />
            Calendário
          </NavLink>

          <span style={categoryStyle}>Rede</span>
          
          <NavLink to="/pacientes" onClick={onClose} style={navLinkStyle}>
            <Contact size={20} />
            Fichas de Pacientes
          </NavLink>

          <NavLink to="/medicos" onClick={onClose} style={navLinkStyle}>
            <Users size={20} />
            Médicos
          </NavLink>

          <NavLink to="/pedidos" onClick={onClose} style={navLinkStyle}>
            <ClipboardList size={20} />
            Pedidos
          </NavLink>

          <span style={categoryStyle}>Sistema</span>
          
          <NavLink to="/relatorios" onClick={onClose} style={navLinkStyle}>
            <FileText size={20} />
            Relatórios
          </NavLink>

          <NavLink to="/configuracoes" onClick={onClose} style={navLinkStyle}>
            <Settings size={20} />
            Configurações
          </NavLink>
        </nav>

        {/* 👇 BOTÃO DE MODO ESCURO FIXO NO RODAPÉ DA SIDEBAR 👇 */}
        <div style={{ padding: "15px", borderTop: "1px solid #e2e8f0", borderColor: theme === 'dark' ? "#334155" : "#e2e8f0" }}>
          <button 
            onClick={toggleTheme}
            style={{
              width: "100%",
              background: theme === 'dark' ? "#0f172a" : "#f1f5f9",
              border: "none",
              color: theme === 'dark' ? "#e2e8f0" : "#475569",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "12px",
              borderRadius: "10px",
              transition: "0.2s",
              fontWeight: "700",
              fontSize: "0.9rem"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            {theme === 'dark' ? (
              <><Sun size={18} color="#facc15" /> Modo Claro</>
            ) : (
              <><Moon size={18} color="#6C63FF" /> Modo Escuro</>
            )}
          </button>
        </div>

      </aside>
    </>
  )
}

export default Sidebar;