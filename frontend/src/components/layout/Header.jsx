import React from 'react';
import './HeaderDashboard.css';
import { Bell, Search } from 'lucide-react';

function HeaderDashboard() {
  return (
    <header className="header-dashboard">
      <div className="header-search">
        <Search size={20} color="#94a3b8" />
        <input type="text" placeholder="Buscar pacientes, cirurgias..." />
      </div>

      <div className="header-actions">
        <button className="notification-btn">
          <Bell size={22} color="#64748b" />
          <span className="notification-badge"></span>
        </button>
        {/* Removido o "Boa tarde, Carolina" daqui, deixamos apenas os controles e a busca */}
      </div>
    </header>
  );
}

export default HeaderDashboard;