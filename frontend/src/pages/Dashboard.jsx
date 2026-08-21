import React from 'react';
import { useCirurgias } from "../context/CirurgiasContext";
import { usePedidos } from "../context/PedidosContext"; // 👈 NOVO: Puxando o cérebro de OPMEs!
import { CalendarCheck, Calendar, Package, TrendingDown, Activity } from "lucide-react";
import Lembretes from "../components/dashboard/Lembretes"; 
import "./Dashboard.css";

function Dashboard() {
  const { listaCirurgias } = useCirurgias();
  const { listaPedidos } = usePedidos(); // 👈 Trazendo os pedidos para a tela inicial

  const totalCirurgias = listaCirurgias.length;

  // 1. DATA E SAUDAÇÃO DINÂMICAS PARA O CABEÇALHO
  const dataAtual = new Date();
  const opcoesData = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  let dataHeader = dataAtual.toLocaleDateString('pt-BR', opcoesData);
  dataHeader = dataHeader.charAt(0).toUpperCase() + dataHeader.slice(1);

  const horaAtual = dataAtual.getHours();
  let saudacao = "Bom dia";
  if (horaAtual >= 12 && horaAtual < 18) saudacao = "Boa tarde";
  else if (horaAtual >= 18) saudacao = "Boa noite";

  // 2. DATA FORMATADA PARA BUSCAR NO SUPABASE (YYYY-MM-DD)
  const ano = dataAtual.getFullYear();
  const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
  const dia = String(dataAtual.getDate()).padStart(2, '0');
  const hojeStr = `${ano}-${mes}-${dia}`;

  // 3. INDICADORES EXECUTIVOS (As métricas que importam)
  const cirurgiasHoje = listaCirurgias.filter(c => {
    return c.data_cirurgia && c.data_cirurgia.startsWith(hojeStr);
  }).sort((a, b) => {
    const timeA = a.data_cirurgia ? a.data_cirurgia.split(" ")[1] : "00:00";
    const timeB = b.data_cirurgia ? b.data_cirurgia.split(" ")[1] : "00:00";
    return timeA.localeCompare(timeB);
  });

  // Calcula quantos OPMEs estão travados (Aguardando Orçamento ou Em Aprovação)
  const opmesPendentes = listaPedidos?.filter(p => 
      p.status === "Aguardando Orçamento" || p.status === "Em Aprovação (Convênio)"
  ).length || 0;

  // Calcula a Taxa de Cancelamento
  const canceladas = listaCirurgias.filter(c => c.status === "Cancelada").length;
  const taxaCancelamento = totalCirurgias > 0 ? Math.round((canceladas / totalCirurgias) * 100) : 0;

  return (
    <div className="dashboard-container" style={{ fontFamily: "'Montserrat', 'Inter', sans-serif" }}>
      
      {/* Cabeçalho Executivo */}
      <div className="dashboard-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "30px" }}>
        <div>
          <h1 style={{ fontSize: "2rem", color: "#0f172a", margin: "0 0 4px 0", fontWeight: "800" }}>
            {saudacao}, equipe! 👋
          </h1>
          <p style={{ color: "#64748b", fontSize: "1rem", margin: 0, fontWeight: "500" }}>
            Visão geral da operação e monitoramento de OPMEs.
          </p>
        </div>
        <div className="dashboard-date" style={{ background: "#fff", padding: "10px 20px", borderRadius: "10px", border: "1px solid #e2e8f0", color: "#334155", fontWeight: "600", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
          {dataHeader}
        </div>
      </div>

      {/* Cards de Indicadores (KPIs) */}
      <div className="dashboard-stats" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        
        {/* Card 1: Agenda do Dia */}
        <div className="stat-box" style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
          <div className="stat-box-icon" style={{ background: "#eff6ff", color: "#3b82f6", padding: "14px", borderRadius: "12px", display: "flex" }}>
            <CalendarCheck size={28} />
          </div>
          <div className="stat-box-content">
            <h3 style={{ margin: 0, fontSize: "1.8rem", color: "#0f172a", fontWeight: "800" }}>{cirurgiasHoje.length}</h3>
            <span style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: "600" }}>Cirurgias Hoje</span>
          </div>
        </div>

        {/* Card 2: OPMEs Pendentes (Alerta) */}
        <div className="stat-box" style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
          <div className="stat-box-icon" style={{ background: "#fff7ed", color: "#f97316", padding: "14px", borderRadius: "12px", display: "flex" }}>
            <Package size={28} />
          </div>
          <div className="stat-box-content">
            <h3 style={{ margin: 0, fontSize: "1.8rem", color: "#0f172a", fontWeight: "800" }}>{opmesPendentes}</h3>
            <span style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: "600" }}>OPMEs Pendentes</span>
          </div>
        </div>

        {/* Card 3: Total Ativas */}
        <div className="stat-box" style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
          <div className="stat-box-icon" style={{ background: "#f0fdf4", color: "#22c55e", padding: "14px", borderRadius: "12px", display: "flex" }}>
            <Activity size={28} />
          </div>
          <div className="stat-box-content">
            <h3 style={{ margin: 0, fontSize: "1.8rem", color: "#0f172a", fontWeight: "800" }}>{totalCirurgias}</h3>
            <span style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: "600" }}>Total na Base</span>
          </div>
        </div>

        {/* Card 4: Taxa de Cancelamento */}
        <div className="stat-box" style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
          <div className="stat-box-icon" style={{ background: "#fef2f2", color: "#ef4444", padding: "14px", borderRadius: "12px", display: "flex" }}>
            <TrendingDown size={28} />
          </div>
          <div className="stat-box-content">
            <h3 style={{ margin: 0, fontSize: "1.8rem", color: "#0f172a", fontWeight: "800" }}>{taxaCancelamento}%</h3>
            <span style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: "600" }}>Taxa de Cancelamento</span>
          </div>
        </div>

      </div>

      {/* Grid Inferior */}
      <div className="dashboard-grid-bottom" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
        
        {/* Agenda de Hoje Detalhada */}
        <div className="dashboard-card" style={{ background: "#fff", padding: "25px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
          <h3 style={{ margin: "0 0 20px 0", color: "#0f172a", display: "flex", alignItems: "center", gap: "10px", fontSize: "1.2rem", fontWeight: "800" }}>
            <Calendar size={20} color="#6C63FF" />
            Cirurgias Programadas para Hoje
          </h3>
          
          {cirurgiasHoje.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {cirurgiasHoje.map(c => {
                const horario = c.data_cirurgia ? c.data_cirurgia.split(" ")[1] : "Não informado";
                
                let corFundo = "#dcfce7"; let corTexto = "#15803d";
                if (c.status === "Cancelada") { corFundo = "#fee2e2"; corTexto = "#991b1b"; }
                else if (c.status === "Pendente") { corFundo = "#fef3c7"; corTexto = "#b45309"; }

                return (
                  <div key={c.id} style={{ padding: "16px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "0.2s" }} onMouseOver={(e) => e.currentTarget.style.borderColor = "#cbd5e1"} onMouseOut={(e) => e.currentTarget.style.borderColor = "#f1f5f9"}>
                    <div>
                      <strong style={{ display: "block", color: "#1e293b", fontSize: "1rem", marginBottom: "4px" }}>{c.paciente}</strong>
                      <span style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: "500" }}>🏥 {c.hospital} &nbsp;•&nbsp; 🕒 {horario}</span>
                    </div>
                    <span style={{ background: corFundo, color: corTexto, padding: "6px 14px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "700", letterSpacing: "0.5px" }}>
                      {c.status}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 0", background: "#f8fafc", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
              <CalendarCheck size={32} color="#94a3b8" style={{ marginBottom: "10px" }} />
              <p style={{ margin: 0, color: "#64748b", fontSize: "0.95rem", fontWeight: "500" }}>Nenhuma cirurgia programada para a data de hoje.</p>
            </div>
          )}
        </div>

        {/* Lembretes (Mantivemos o seu componente intacto!) */}
        <div style={{ background: "#fff", padding: "25px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
            <Lembretes />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;