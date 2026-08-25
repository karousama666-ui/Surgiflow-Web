import React, { useState, useEffect } from 'react';
import "./Sidebar.css";
import Logo from "./Logo"; 
import { NavLink, useLocation } from "react-router-dom"; // 👈 NOVO: Importamos o useLocation

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
  MessageSquareText
} from "lucide-react";

function Sidebar({ isOpen, onClose }) {
  const location = useLocation(); // Sabe em qual tela você está
  
  // 🌟 NOVO: Estado para guardar o número de notificações não lidas
  const [mensagensNaoLidas, setMensagensNaoLidas] = useState(0);

  // 1. Zera a bolinha vermelha assim que você entra na tela do Chat
  useEffect(() => {
    if (location.pathname === '/chat') {
      setMensagensNaoLidas(0);
    }
  }, [location.pathname]);

  // 2. Fica ouvindo o "Grito" do Notificador Global
  useEffect(() => {
    const handleNovaMensagem = () => {
      // Só soma na bolinha se você NÃO estiver com a aba do chat aberta
      if (window.location.pathname !== '/chat') {
        setMensagensNaoLidas(prev => prev + 1);
      }
    };
    
    window.addEventListener('novaMensagemChat', handleNovaMensagem);
    
    return () => {
      window.removeEventListener('novaMensagemChat', handleNovaMensagem);
    };
  }, []);

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
    color: isActive ? "#6C63FF" : "#64748b",
    background: isActive ? "#eff6ff" : "transparent",
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
          width: '260px', /* Trava a largura no PC para não ser esmagado */
          background: '#fff',
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

          {/* 🌟 BOTÃO DE COMUNICAÇÃO COM CONTADOR 🌟 */}
          <NavLink 
            to="/chat" 
            onClick={() => { onClose(); setMensagensNaoLidas(0); }} 
            style={navLinkStyle}
          >
            <MessageSquareText size={20} />
            Comunicação
            
            {/* A Bolinha Vermelha só aparece se tiver mais que 0 mensagens */}
            {mensagensNaoLidas > 0 && (
              <span style={{
                marginLeft: 'auto', /* Empurra a bolinha toda para a direita */
                background: '#ef4444',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '12px',
                boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
              }}>
                {mensagensNaoLidas > 99 ? '99+' : mensagensNaoLidas}
              </span>
            )}
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
      </aside>
    </>
  )
}

export default Sidebar;