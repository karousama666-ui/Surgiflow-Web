import React from 'react';
import { useCirurgias } from "../context/CirurgiasContext";
import { ClipboardList, CalendarCheck, Clock, CheckCircle, Calendar } from "lucide-react";
import Lembretes from "../components/dashboard/Lembretes"; 
import "./Dashboard.css";

function Dashboard() {
  const { listaCirurgias } = useCirurgias();

  // Métricas dinâmicas reais
  const totalCirurgias = listaCirurgias.length;
  const confirmadas = listaCirurgias.filter(c => c.status === "Confirmada").length;
  const pendentes = listaCirurgias.filter(c => c.status === "Pendente").length;
  const autorizadas = listaCirurgias.filter(c => c.status === "Finalizada" || c.status === "Confirmada").length;

  // 1. DATA DINÂMICA PARA O CABEÇALHO (Adeus data chumbada no código!)
  const dataAtual = new Date();
  const opcoesData = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  let dataHeader = dataAtual.toLocaleDateString('pt-BR', opcoesData);
  dataHeader = dataHeader.charAt(0).toUpperCase() + dataHeader.slice(1);

  // 2. DATA FORMATADA PARA BUSCAR NO SUPABASE (YYYY-MM-DD)
  const ano = dataAtual.getFullYear();
  const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
  const dia = String(dataAtual.getDate()).padStart(2, '0');
  const hojeStr = `${ano}-${mes}-${dia}`;

  // 3. FILTRANDO AS CIRURGIAS DE HOJE CORRETAMENTE
  const cirurgiasHoje = listaCirurgias.filter(c => {
    // Usa o campo data_cirurgia do Supabase!
    return c.data_cirurgia && c.data_cirurgia.startsWith(hojeStr);
  }).sort((a, b) => {
    // Ordena as cirurgias do dia pelo horário
    const timeA = a.data_cirurgia ? a.data_cirurgia.split(" ")[1] : "00:00";
    const timeB = b.data_cirurgia ? b.data_cirurgia.split(" ")[1] : "00:00";
    return timeA.localeCompare(timeB);
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
          {dataHeader}
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

      {/* Grid Inferior */}
      <div className="dashboard-grid-bottom">
        {/* Agenda de Hoje */}
        <div className="dashboard-card">
          <h3>
            <Calendar size={18} color="#6C63FF" />
            Agenda de Hoje
          </h3>
          {cirurgiasHoje.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
              {cirurgiasHoje.map(c => {
                // Separa o horário que vem grudadinho na data do Supabase
                const horario = c.data_cirurgia ? c.data_cirurgia.split(" ")[1] : "Não informado";
                
                // Cores dinâmicas para as pílulas de status
                let corFundo = "#dcfce7"; let corTexto = "#15803d";
                if (c.status === "Cancelada") { corFundo = "#fee2e2"; corTexto = "#991b1b"; }
                else if (c.status === "Pendente") { corFundo = "#fef3c7"; corTexto = "#b45309"; }

                return (
                  <div key={c.id} style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong style={{ display: "block", color: "#1e293b", fontSize: "0.95rem" }}>{c.paciente}</strong>
                      <span style={{ color: "#64748b", fontSize: "0.85rem" }}>{c.hospital} • {horario}</span>
                    </div>
                    <span style={{ background: corFundo, color: corTexto, padding: "4px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "600" }}>
                      {c.status}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "30px 0", color: "#94a3b8", fontSize: "0.9rem" }}>
              Nenhuma cirurgia programada para hoje.
            </div>
          )}
        </div>

        <Lembretes />
      </div>
    </div>
  );
}

export default Dashboard;