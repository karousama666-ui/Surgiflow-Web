import React from 'react';
import CalendarContainer from "../components/calendar/CalendarContainer";

function Calendario() {
  return (
    <div style={{ paddingBottom: "40px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "1.8rem", color: "#1e293b", margin: "0 0 4px 0", fontWeight: "700" }}>
          Calendário Cirúrgico
        </h1>
        <p style={{ color: "#64748b", fontSize: "0.95rem", margin: 0 }}>
          Visualização mensal e semanal das cirurgias agendadas.
        </p>
      </div>
      
      <CalendarContainer />
    </div>
  );
}

export default Calendario;