import { useState, useMemo } from "react";
import { useCirurgias } from "../context/CirurgiasContext";
import { usePedidos } from "../context/PedidosContext";
import { 
    TrendingUp, 
    AlertCircle, 
    CheckCircle2, 
    XCircle, 
    PackageSearch, 
    Activity 
} from "lucide-react";

function Relatorios() {
    const { listaCirurgias } = useCirurgias();
    const { listaPedidos } = usePedidos();

    // Filtro de Mês/Ano (Começa no mês atual - Ajuste para o formato YYYY-MM)
    const [mesFiltro, setMesFiltro] = useState(new Date().toISOString().slice(0, 7));

    // 1. CÁLCULO DOS DADOS (Reage automaticamente quando o mês ou os dados mudam)
    const metricas = useMemo(() => {
        // Filtra cirurgias do mês selecionado
        const cirurgiasDoMes = listaCirurgias.filter(c => {
            if (!c.data_cirurgia) return false;
            return c.data_cirurgia.startsWith(mesFiltro);
        });

        const total = cirurgiasDoMes.length;
        const confirmadas = cirurgiasDoMes.filter(c => c.status === "Confirmada" || c.status === "Finalizada").length;
        const canceladas = cirurgiasDoMes.filter(c => c.status === "Cancelada").length;
        const pendentes = cirurgiasDoMes.filter(c => c.status === "Pendente").length;

        // Filtra OPMEs das cirurgias desse mês
        const opmesDoMes = listaPedidos.filter(p => 
            cirurgiasDoMes.some(c => String(c.id) === String(p.cirurgia_id))
        );

        const opmeAprovados = opmesDoMes.filter(p => p.status === "Aprovado" || p.status === "Material Entregue").length;
        const opmePendentes = opmesDoMes.filter(p => p.status === "Aguardando Orçamento" || p.status === "Em Aprovação (Convênio)").length;

        return {
            total,
            confirmadas,
            canceladas,
            pendentes,
            taxaCancelamento: total > 0 ? Math.round((canceladas / total) * 100) : 0,
            opmeTotal: opmesDoMes.length,
            opmeAprovados,
            opmePendentes
        };
    }, [listaCirurgias, listaPedidos, mesFiltro]);

    // 2. ESTILOS REUTILIZÁVEIS (Para manter o código limpo)
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

                {/* Filtro de Mês */}
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                
                {/* Painel de Status das Cirurgias */}
                <div style={cardStyle}>
                    <h3 style={{ margin: "0 0 15px 0", color: "#1e293b", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                        <CheckCircle2 size={18} color="#6C63FF"/> 
                        Status das Cirurgias
                    </h3>
                    
                    {/* Barra Pendentes */}
                    <div style={{ marginBottom: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "5px", fontWeight: "600", color: "#475569" }}>
                            <span>Pendentes ({metricas.pendentes})</span>
                            <span>{metricas.total > 0 ? Math.round((metricas.pendentes/metricas.total)*100) : 0}%</span>
                        </div>
                        <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                            <div style={{ width: `${metricas.total > 0 ? (metricas.pendentes/metricas.total)*100 : 0}%`, height: "100%", background: "#f59e0b", transition: "width 0.5s" }}></div>
                        </div>
                    </div>

                    {/* Barra Canceladas */}
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

                {/* Painel de Funil de OPME */}
                <div style={cardStyle}>
                    <h3 style={{ margin: "0 0 15px 0", color: "#1e293b", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                        <PackageSearch size={18} color="#6C63FF"/> 
                        Funil de OPME
                    </h3>

                    {/* Barra Aprovados */}
                    <div style={{ marginBottom: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "5px", fontWeight: "600", color: "#475569" }}>
                            <span>Liberados / Entregues ({metricas.opmeAprovados})</span>
                            <span>{metricas.opmeTotal > 0 ? Math.round((metricas.opmeAprovados/metricas.opmeTotal)*100) : 0}%</span>
                        </div>
                        <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                            <div style={{ width: `${metricas.opmeTotal > 0 ? (metricas.opmeAprovados/metricas.opmeTotal)*100 : 0}%`, height: "100%", background: "#10b981", transition: "width 0.5s" }}></div>
                        </div>
                    </div>

                    {/* Barra Em Análise */}
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
        </div>
    );
}

export default Relatorios;