import React from 'react';
import { useCirurgias } from "../context/CirurgiasContext";
import { ClipboardList, CheckCircle2, Clock, CheckCheck, Building2, FileText } from "lucide-react";
import "./Relatorios.css";

function Relatorios() {
  const { listaCirurgias } = useCirurgias();

  // Cálculos dinâmicos
  const totalCirurgias = listaCirurgias.length;
  const confirmadas = listaCirurgias.filter(c => c.status === "Confirmada").length;
  const pendentes = listaCirurgias.filter(c => c.status === "Pendente").length;
  const finalizadas = listaCirurgias.filter(c => c.status === "Finalizada").length;

  // Agrupando hospitais
  const hospitaisContagem = listaCirurgias.reduce((acc, curr) => {
    if (curr.hospital) {
      acc[curr.hospital] = (acc[curr.hospital] || 0) + 1;
    }
    return acc;
  }, {});

  // Agrupando convênios
  const conveniosContagem = listaCirurgias.reduce((acc, curr) => {
    if (curr.convenio) {
      acc[curr.convenio] = (acc[curr.convenio] || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <div className="relatorios-container">
      <div className="relatorios-header">
        <h1>Relatórios e Indicadores</h1>
        <p>Visão analítica do fluxo cirúrgico e conformidade operacional.</p>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#eef2ff", color: "#6C63FF" }}>
            <ClipboardList size={26} />
          </div>
          <div className="stat-info">
            <span>Total Cadastradas</span>
            <h2>{totalCirurgias}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#dcfce7", color: "#15803d" }}>
            <CheckCircle2 size={26} />
          </div>
          <div className="stat-info">
            <span>Confirmadas</span>
            <h2 style={{ color: "#15803d" }}>{confirmadas}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fef3c7", color: "#b45309" }}>
            <Clock size={26} />
          </div>
          <div className="stat-info">
            <span>Pendentes</span>
            <h2 style={{ color: "#b45309" }}>{pendentes}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#dbeafe", color: "#1d4ed8" }}>
            <CheckCheck size={26} />
          </div>
          <div className="stat-info">
            <span>Finalizadas</span>
            <h2 style={{ color: "#1d4ed8" }}>{finalizadas}</h2>
          </div>
        </div>
      </div>

      {/* Seção de Análises Detalhadas */}
      <div className="analytics-grid">
        {/* Hospitais Frequentes */}
        <div className="analytics-card">
          <h3>
            <Building2 size={20} color="#6C63FF" />
            Cirurgias por Hospital
          </h3>
          {Object.keys(hospitaisContagem).length > 0 ? (
            <div className="analytics-list">
              {Object.entries(hospitaisContagem).map(([hospital, qtd]) => (
                <div key={hospital} className="analytics-item">
                  <span>{hospital}</span>
                  <span className="analytics-badge">{qtd} {qtd === 1 ? 'cirurgia' : 'cirurgias'}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-analytics">Nenhum hospital registrado ainda.</p>
          )}
        </div>

        {/* Convênios Utilizados */}
        <div className="analytics-card">
          <h3>
            <FileText size={20} color="#6C63FF" />
            Distribuição por Convênio
          </h3>
          {Object.keys(conveniosContagem).length > 0 ? (
            <div className="analytics-list">
              {Object.entries(conveniosContagem).map(([convenio, qtd]) => (
                <div key={convenio} className="analytics-item">
                  <span>{convenio}</span>
                  <span className="analytics-badge">{qtd} {qtd === 1 ? 'pedido' : 'pedidos'}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-analytics">Nenhum convênio registrado ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Relatorios;