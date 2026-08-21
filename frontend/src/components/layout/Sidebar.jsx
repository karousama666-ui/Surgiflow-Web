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
  Settings
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

  return (
    <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Logo />

      {/* flex: 1 faz o menu ocupar o espaço disponível */}
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
    </aside>
  )
}

export default Sidebar;