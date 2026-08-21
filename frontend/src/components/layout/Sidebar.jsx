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
  Contact,
  X // 👈 Importamos o X para fechar no mobile
} from "lucide-react";

// 👇 Recebemos as propriedades de controle do Mobile
function Sidebar({ isOpen, onClose }) {
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

  return (
    <>
      {/* 👇 TELA ESCURA DE FUNDO NO MOBILE 👇 */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      {/* 👇 A CLASSE DINÂMICA 'open' FAZ ELE DESLIZAR 👇 */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`} style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        
        {/* Botão de Fechar Exclusivo do Celular */}
        <button className="close-sidebar-btn" onClick={onClose}>
            <X size={24} />
        </button>

        <Logo />

        <nav style={{ flex: 1, overflowY: 'auto' }}>
          
          <span style={categoryStyle}>Gerenciamento</span>
          <NavLink to="/dashboard" end onClick={onClose}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          <NavLink to="/agenda" onClick={onClose}>
            <CalendarDays size={20} />
            Agenda
          </NavLink>

          <NavLink to="/calendario" onClick={onClose}>
            <Calendar size={20} />
            Calendário
          </NavLink>

          <span style={categoryStyle}>Rede</span>
          
          <NavLink to="/pacientes" onClick={onClose}>
            <Contact size={20} />
            Fichas de Pacientes
          </NavLink>

          <NavLink to="/medicos" onClick={onClose}>
            <Users size={20} />
            Médicos
          </NavLink>

          <NavLink to="/pedidos" onClick={onClose}>
            <ClipboardList size={20} />
            Pedidos
          </NavLink>

          <span style={categoryStyle}>Sistema</span>
          <NavLink to="/relatorios" onClick={onClose}>
            <FileText size={20} />
            Relatórios
          </NavLink>

          <NavLink to="/configuracoes" onClick={onClose}>
            <Settings size={20} />
            Configurações
          </NavLink>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar;