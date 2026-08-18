import React from 'react';
import { useCirurgias } from "../context/CirurgiasContext";
import { ClipboardList, CalendarCheck, Clock, CheckCircle, Calendar } from "lucide-react";
import Lembretes from "../components/dashboard/Lembretes"; // Ajuste o caminho caso esteja em outra pasta, ex: "../components/Lembretes"
import "./Dashboard.css";

function Dashboard() {
  const { listaCirurgias } = useCirurgias();

  // Métricas dinâmicas reais
  const totalCirurgias = listaCirurgias.length;
  const confirmadas = listaCirurgias.filter(c => c.status === "Confirmada").length;
  const pendentes = listaCirurgias.filter(c => c.status === "Pendente").length;
  const autorizadas = listaCirurgias.filter(c => c.status === "Finalizada" || c.status === "Confirmada").length;

  // Filtrando cirurgias de hoje
  const hojeStr = new Date().toISOString().split('T')[0];
  const cirurgiasHoje = listaCirurgias.filter(c => {
    return c.data && c.data.includes(hojeStr);
  });

  return (
    <div className="dashboard-container">
      {/* Cabeçalho */}
      <div className="dashboard-header">
        <div>
          <h1>Painel de Controle</h1>
          <p>Visão geral das atividades e monitoramento do fluxo cirúrgico.</p>
        </div>
        <div className="dashboard-date">
          Terça-feira, 18 de Agosto de 2026
        </div>
      </div>

      {/* Cards de Indicadores */}
      <div className="dashboard-stats">
        <div className="stat-box">
          <div className="stat-box-icon" style={{ background: "#eef2ff", color: "#6C63FF" }}>
            <ClipboardList size={24} />
          </div>
          <div className="stat-box-content">
            <h3>{totalCirurgias}</h3>
            <span>Cirurgias Cadastradas</span>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-box-icon" style={{ background: "#dbeafe", color: "#2563eb" }}>
            <CalendarCheck size={24} />
          </div>
          <div className="stat-box-content">
            <h3>{cirurgiasHoje.length}</h3>
            <span>Agenda de Hoje</span>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-box-icon" style={{ background: "#fef3c7", color: "#d97706" }}>
            <Clock size={24} />
          </div>
          <div className="stat-box-content">
            <h3>{pendentes}</h3>
            <span>Pendentes</span>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-box-icon" style={{ background: "#dcfce7", color: "#16a34a" }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-box-content">
            <h3>{autorizadas}</h3>
            <span>Confirmadas / Prontas</span>
          </div>
        </div>
      </div>

      {/* Grid Inferior: Agenda do Dia e Componente de Lembretes */}
      <div className="dashboard-grid-bottom">
        {/* Agenda de Hoje */}
        <div className="dashboard-card">
          <h3>
            <Calendar size={18} color="#6C63FF" />
            Agenda de Hoje
          </h3>
          {cirurgiasHoje.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
              {cirurgiasHoje.map(c => (
                <div key={c.id} style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ display: "block", color: "#1e293b", fontSize: "0.95rem" }}>{c.paciente}</strong>
                    <span style={{ color: "#64748b", fontSize: "0.85rem" }}>{c.hospital} • {c.horario}</span>
                  </div>
                  <span style={{ background: "#dcfce7", color: "#15803d", padding: "4px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "600" }}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "30px 0", color: "#94a3b8", fontSize: "0.9rem" }}>
              Nenhuma cirurgia programada para hoje.
            </div>
          )}
        </div>

        {/* Aqui entra o seu componente Lembretes isolado e perfeito */}
        <Lembretes />
      </div>
    </div>
  );
}

export default Dashboard;