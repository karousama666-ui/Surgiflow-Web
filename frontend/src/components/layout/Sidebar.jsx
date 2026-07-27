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

    return (

        <aside className="sidebar">

            <Logo />

            <nav>
  <NavLink to="/" end>
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

  <NavLink to="/medicos">
    <Users size={20} />
    Médicos
  </NavLink>

  <NavLink to="/pedidos">
    <ClipboardList size={20} />
    Pedidos
  </NavLink>

  <NavLink to="/relatorios">
    <FileText size={20} />
    Relatórios
  </NavLink>

  <NavLink to="/configuracoes">
    <Settings size={20} />
    Configurações
  </NavLink>
</nav>

            <div className="profile">

                <strong>Carolina Ramos</strong>

                <span>Biomédica</span>

            </div>

        </aside>

    )

}

export default Sidebar;