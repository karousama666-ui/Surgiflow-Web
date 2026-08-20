import { useState, useMemo } from "react";
import { useCirurgias } from "../context/CirurgiasContext";
import { usePedidos } from "../context/PedidosContext";
import { 
    TrendingUp, 
    AlertCircle, 
    CheckCircle2, 
    PackageSearch, 
    Activity,
    Users,
    Building2,
    Trophy // 👈 Novo ícone para os cards de ranking
} from "lucide-react";

function Relatorios() {
    const { listaCirurgias } = useCirurgias();
    const { listaPedidos } = usePedidos();

    // Filtro de Mês/Ano (Começa no mês atual - Ajuste para o formato YYYY-MM)
    const [mesFiltro, setMesFiltro] = useState(new Date().toISOString().slice(0, 7));

    // 1. CÁLCULO DOS DADOS
    const { metricas, rankingMedicos, rankingHospitais } = useMemo(() => {
        // --- FILTRO GERAL ---
        const cirurgiasDoMes = listaCirurgias.filter(c => {
            if (!c.data_cirurgia) return false;
            return c.data_cirurgia.startsWith(mesFiltro);
        });

        // --- MÉTRICAS BÁSICAS ---
        const total = cirurgiasDoMes.length;
        const confirmadas = cirurgiasDoMes.filter(c => c.status === "Confirmada" || c.status === "Finalizada").length;
        const canceladas = cirurgiasDoMes.filter(c => c.status === "Cancelada").length;
        const pendentes = cirurgiasDoMes.filter(c => c.status === "Pendente").length;

        const opmesDoMes = listaPedidos.filter(p => 
            cirurgiasDoMes.some(c => String(c.id) === String(p.cirurgia_id))
        );

        const opmeAprovados = opmesDoMes.filter(p => p.status === "Aprovado" || p.status === "Material Entregue").length;
        const opmePendentes = opmesDoMes.filter(p => p.status === "Aguardando Orçamento" || p.status === "Em Aprovação (Convênio)").length;

        // --- RANKING DE MÉDICOS ---
        const contagemMedicos = {};
        cirurgiasDoMes.forEach(c => {
            const nomeMedico = c.medicos?.nome || "Não informado";
            contagemMedicos[nomeMedico] = (contagemMedicos[nomeMedico] || 0) + 1;
        });
        const medicosRankeados = Object.entries(contagemMedicos)
            .sort((a, b) => b[1] - a[1]) // Ordena do maior para o menor
            .slice(0, 5); // Pega o Top 5

        // --- RANKING DE HOSPITAIS ---
        const contagemHospitais = {};
        cirurgiasDoMes.forEach(c => {
            const nomeHospital = c.hospital || "Não informado";
            contagemHospitais[nomeHospital] = (contagemHospitais[nomeHospital] || 0) + 1;
        });
        const hospitaisRankeados = Object.entries(contagemHospitais)
            .sort((a, b) => b[1] - a[1]) // Ordena do maior para o menor
            .slice(0, 5); // Pega o Top 5

        return {
            metricas: {
                total, confirmadas, canceladas, pendentes,
                taxaCancelamento: total > 0 ? Math.round((canceladas / total) * 100) : 0,
                opmeTotal: opmesDoMes.length, opmeAprovados, opmePendentes
            },
            rankingMedicos: medicosRankeados,
            rankingHospitais: hospitaisRankeados
        };
    }, [listaCirurgias, listaPedidos, mesFiltro]);

    // 2. ESTILOS REUTILIZÁVEIS
    const cardStyle = {
        background: "#fff", padding: "20px", borderRadius: "16px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.02)", border: "1px solid #f1f5f9",
        display: "flex", flexDirection: "column", gap: "10px"
    };

    const headerCardStyle = {
        display: "flex", justifyContent: "space-between", alignItems: "center",
        color: "#64748b", fontSize: "0.95rem", fontWeight: "600"
    };

    const valueStyle = {
        fontSize: "2rem", fontWeight: "700", color: "#1e293b", margin: 0
    };

    const rankItemStyle = {
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "12px 10px", borderBottom: "1px solid #f1f5f9", fontSize: "0.95rem", color: "#334155"
    };

    return (
        <div style={{ paddingBottom: "40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <div>
                    <h1 style={{ fontSize: "1.8rem", color: "#1e293b", margin: "0 0 4px 0", fontWeight: "700" }}>
                        Relatórios Gerenciais
                    </h1>
                    <p style={{ color: "#64748b", fontSize: "0.95rem", margin: 0 }}>
                        Visão analítica e indicadores de performance (KPIs).
                    </p>
                </div>

                <input 
                    type="month" 
                    value={mesFiltro}
                    onChange={(e) => setMesFiltro(e.target.value)}
                    style={{ 
                        padding: "12px 16px", borderRadius: "10px", border: "1px solid #cbd5e1", 
                        fontSize: "1rem", outline: "none", color: "#1e293b", background: "#fff", cursor: "pointer"
                    }}
                />
            </div>

            {/* LINHA 1: KPIs Principais (4 cards) */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "20px" }}>
                <div style={cardStyle}>
                    <div style={headerCardStyle}>
                        <span>Total de Cirurgias</span>
                        <Activity size={20} color="#6C63FF" />
                    </div>
                    <h2 style={valueStyle}>{metricas.total}</h2>
                    <span style={{ fontSize: "0.85rem", color: "#10b981", fontWeight: "600" }}>Neste período</span>
                </div>

                <div style={cardStyle}>
                    <div style={headerCardStyle}>
                        <span>Confirmadas / Finais</span>
                        <CheckCircle2 size={20} color="#10b981" />
                    </div>
                    <h2 style={valueStyle}>{metricas.confirmadas}</h2>
                    <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Agendamentos seguros</span>
                </div>

                <div style={cardStyle}>
                    <div style={headerCardStyle}>
                        <span>Taxa de Cancelamento</span>
                        <TrendingUp size={20} color="#ef4444" />
                    </div>
                    <h2 style={valueStyle}>{metricas.taxaCancelamento}%</h2>
                    <span style={{ fontSize: "0.85rem", color: "#ef4444", fontWeight: "600" }}>{metricas.canceladas} canceladas</span>
                </div>

                <div style={cardStyle}>
                    <div style={headerCardStyle}>
                        <span>OPMEs Pendentes</span>
                        <AlertCircle size={20} color="#f59e0b" />
                    </div>
                    <h2 style={valueStyle}>{metricas.opmePendentes}</h2>
                    <span style={{ fontSize: "0.85rem", color: "#f59e0b", fontWeight: "600" }}>Requer atenção</span>
                </div>
            </div>

            {/* LINHA 2: Gráficos de Barra (CSS Nativo) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                
                <div style={cardStyle}>
                    <h3 style={{ margin: "0 0 15px 0", color: "#1e293b", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                        <CheckCircle2 size={18} color="#6C63FF"/> Status das Cirurgias
                    </h3>
                    
                    <div style={{ marginBottom: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "5px", fontWeight: "600", color: "#475569" }}>
                            <span>Pendentes ({metricas.pendentes})</span>
                            <span>{metricas.total > 0 ? Math.round((metricas.pendentes/metricas.total)*100) : 0}%</span>
                        </div>
                        <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                            <div style={{ width: `${metricas.total > 0 ? (metricas.pendentes/metricas.total)*100 : 0}%`, height: "100%", background: "#f59e0b", transition: "width 0.5s" }}></div>
                        </div>
                    </div>

                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "5px", fontWeight: "600", color: "#475569" }}>
                            <span>Canceladas ({metricas.canceladas})</span>
                            <span>{metricas.total > 0 ? Math.round((metricas.canceladas/metricas.total)*100) : 0}%</span>
                        </div>
                        <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                            <div style={{ width: `${metricas.total > 0 ? (metricas.canceladas/metricas.total)*100 : 0}%`, height: "100%", background: "#ef4444", transition: "width 0.5s" }}></div>
                        </div>
                    </div>
                </div>

                <div style={cardStyle}>
                    <h3 style={{ margin: "0 0 15px 0", color: "#1e293b", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                        <PackageSearch size={18} color="#6C63FF"/> Funil de OPME
                    </h3>

                    <div style={{ marginBottom: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "5px", fontWeight: "600", color: "#475569" }}>
                            <span>Liberados / Entregues ({metricas.opmeAprovados})</span>
                            <span>{metricas.opmeTotal > 0 ? Math.round((metricas.opmeAprovados/metricas.opmeTotal)*100) : 0}%</span>
                        </div>
                        <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                            <div style={{ width: `${metricas.opmeTotal > 0 ? (metricas.opmeAprovados/metricas.opmeTotal)*100 : 0}%`, height: "100%", background: "#10b981", transition: "width 0.5s" }}></div>
                        </div>
                    </div>

                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "5px", fontWeight: "600", color: "#475569" }}>
                            <span>Em Análise / Orçamento ({metricas.opmePendentes})</span>
                            <span>{metricas.opmeTotal > 0 ? Math.round((metricas.opmePendentes/metricas.opmeTotal)*100) : 0}%</span>
                        </div>
                        <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                            <div style={{ width: `${metricas.opmeTotal > 0 ? (metricas.opmePendentes/metricas.opmeTotal)*100 : 0}%`, height: "100%", background: "#f59e0b", transition: "width 0.5s" }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 👇 LINHA 3: TOP RANKINGS */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                
                {/* Ranking de Médicos */}
                <div style={cardStyle}>
                    <h3 style={{ margin: "0 0 10px 0", color: "#1e293b", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                        <Users size={18} color="#10b981"/> Top Produtividade (Médicos)
                    </h3>
                    
                    {rankingMedicos.length === 0 ? (
                        <p style={{ color: "#94a3b8", fontSize: "0.9rem", fontStyle: "italic", textAlign: "center", marginTop: "20px" }}>Nenhuma cirurgia neste mês.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            {rankingMedicos.map((medico, index) => (
                                <div key={index} style={rankItemStyle}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        {/* Coloca um troféu no primeiro lugar */}
                                        {index === 0 ? <Trophy size={16} color="#f59e0b" /> : <span style={{ width: "16px", color: "#94a3b8", fontSize: "0.8rem", fontWeight: "700" }}>{index + 1}º</span>}
                                        <span style={{ fontWeight: index === 0 ? "700" : "500" }}>{medico[0]}</span>
                                    </div>
                                    <div style={{ background: "#f1f5f9", padding: "4px 10px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "700", color: "#6C63FF" }}>
                                        {medico[1]} cirurgia(s)
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Ranking de Hospitais */}
                <div style={cardStyle}>
                    <h3 style={{ margin: "0 0 10px 0", color: "#1e293b", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                        <Building2 size={18} color="#f59e0b"/> Locais mais atuantes (Hospitais)
                    </h3>
                    
                    {rankingHospitais.length === 0 ? (
                        <p style={{ color: "#94a3b8", fontSize: "0.9rem", fontStyle: "italic", textAlign: "center", marginTop: "20px" }}>Nenhuma cirurgia neste mês.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            {rankingHospitais.map((hospital, index) => (
                                <div key={index} style={rankItemStyle}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <span style={{ fontWeight: "500" }}>{hospital[0]}</span>
                                    </div>
                                    <div style={{ background: "#f1f5f9", padding: "4px 10px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "700", color: "#10b981" }}>
                                        {hospital[1]} vol.
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
            
        </div>
    );
}

export default Relatorios;