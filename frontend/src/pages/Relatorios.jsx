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
    Trophy,
    ShieldPlus, 
    Truck,
    Printer // 👈 Importamos o ícone da impressora
} from "lucide-react";

function Relatorios() {
    const { listaCirurgias } = useCirurgias();
    const { listaPedidos } = usePedidos();

    // Filtro de Mês/Ano
    const [mesFiltro, setMesFiltro] = useState(new Date().toISOString().slice(0, 7));

    // 1. CÁLCULO DOS DADOS
    const { 
        metricas, 
        rankingMedicos, 
        rankingHospitais, 
        rankingConvenios, 
        rankingFornecedores 
    } = useMemo(() => {
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

        // Puxa todos os pedidos que batem com as cirurgias do mês (Bruto)
        const opmesDoMesBrutos = listaPedidos.filter(p => 
            cirurgiasDoMes.some(c => String(c.id) === String(p.cirurgia_id))
        );

        // 🛡️ BLINDAGEM DE AUDITORIA: Remove duplicatas
        const opmesDoMes = opmesDoMesBrutos.filter((pedido, index, self) =>
            index === self.findIndex((p) => p.cirurgia_id === pedido.cirurgia_id)
        );

        const opmeAprovados = opmesDoMes.filter(p => p.status === "Aprovado" || p.status === "Material Entregue").length;
        const opmePendentes = opmesDoMes.filter(p => p.status === "Aguardando Orçamento" || p.status === "Em Aprovação (Convênio)").length;

        // --- FUNÇÃO AUXILIAR PARA RANKINGS ---
        const gerarRanking = (array, extrator) => {
            const contagem = {};
            array.forEach(item => {
                const chave = extrator(item) || "Não informado";
                contagem[chave] = (contagem[chave] || 0) + 1;
            });
            return Object.entries(contagem)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5); // Top 5
        };

        return {
            metricas: {
                total, confirmadas, canceladas, pendentes,
                taxaCancelamento: total > 0 ? Math.round((canceladas / total) * 100) : 0,
                opmeTotal: opmesDoMes.length, opmeAprovados, opmePendentes
            },
            rankingMedicos: gerarRanking(cirurgiasDoMes, c => c.medicos?.nome),
            rankingHospitais: gerarRanking(cirurgiasDoMes, c => c.hospital),
            rankingConvenios: gerarRanking(cirurgiasDoMes, c => c.convenio),
            rankingFornecedores: gerarRanking(opmesDoMes, p => p.fornecedor)
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

    // Componente interno para não repetir código visual dos rankings
    const RankingList = ({ dados, sufixo, iconePrimeiroLugar = <Trophy size={16} color="#f59e0b" /> }) => {
        if (dados.length === 0) {
            return <p style={{ color: "#94a3b8", fontSize: "0.9rem", fontStyle: "italic", textAlign: "center", marginTop: "20px" }}>Sem dados no período.</p>;
        }
        return (
            <div style={{ display: "flex", flexDirection: "column" }}>
                {dados.map((item, index) => (
                    <div key={index} style={rankItemStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
                            {index === 0 ? iconePrimeiroLugar : <span style={{ width: "16px", color: "#94a3b8", fontSize: "0.8rem", fontWeight: "700" }}>{index + 1}º</span>}
                            <span style={{ fontWeight: index === 0 ? "700" : "500", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "200px" }}>
                                {item[0]}
                            </span>
                        </div>
                        <div style={{ background: "#f1f5f9", padding: "4px 10px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "700", color: "#6C63FF", whiteSpace: "nowrap" }}>
                            {item[1]} {sufixo}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div style={{ paddingBottom: "40px", fontFamily: "'Montserrat', 'Inter', sans-serif" }}>
            
            {/* 👇 MÁGICA DO PDF: CSS INJETADO PARA IMPRESSÃO PERFEITA (A4) 👇 */}
            <style>
                {`
                @media print {
                    body { background: white !important; margin: 0; padding: 0; }
                    /* Esconde os menus laterais, topos e botões de ação */
                    aside, header, .nao-imprimir { display: none !important; }
                    
                    /* Ajusta o container principal para ocupar a folha toda */
                    main { padding: 0 !important; background: white !important; overflow: visible !important; }
                    
                    /* Faz o cabeçalho de auditoria aparecer apenas no papel */
                    .print-header { display: block !important; margin-bottom: 30px; }
                    
                    /* Impede que os cards quebrem no meio da folha */
                    .print-card { page-break-inside: avoid; border: 1px solid #cbd5e1 !important; box-shadow: none !important; }
                    
                    /* Força o grid a se comportar bem no papel A4 */
                    .print-grid-4 { display: grid !important; grid-template-columns: repeat(4, 1fr) !important; gap: 10px !important; }
                    .print-grid-2 { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 15px !important; }
                }
                
                /* Esconde o cabeçalho de auditoria na visualização normal da tela */
                .print-header { display: none; }
                `}
            </style>

            {/* 👇 CABEÇALHO EXCLUSIVO PARA O PDF DE AUDITORIA 👇 */}
            <div className="print-header">
                <div style={{ borderBottom: "2px solid #0f172a", paddingBottom: "15px", marginBottom: "20px" }}>
                    <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#0f172a", margin: "0 0 5px 0" }}>
                        Relatório de Conformidade e Fluxo Cirúrgico
                    </h2>
                    <p style={{ margin: 0, color: "#475569", fontSize: "0.95rem" }}>Documentação comprobatória de rastreabilidade e operação sanitária.</p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#334155", fontWeight: "600", marginBottom: "30px", background: "#f8fafc", padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                    <span>Período de Apuração: {mesFiltro.split('-').reverse().join('/')}</span>
                    <span>Diretrizes Aplicáveis: RDC 16/2013 e RDC 665/2022</span>
                    <span>Gerado em: {new Date().toLocaleDateString('pt-BR')}</span>
                </div>
            </div>

            {/* Cabeçalho da Tela (Escondido na Impressão) */}
            <div className="nao-imprimir" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
                <div>
                    <h1 style={{ fontSize: "1.8rem", color: "#1e293b", margin: "0 0 4px 0", fontWeight: "800" }}>
                        Relatórios Gerenciais
                    </h1>
                    <p style={{ color: "#64748b", fontSize: "0.95rem", margin: 0, fontWeight: "500" }}>
                        Visão analítica, auditoria de OPME e indicadores de performance.
                    </p>
                </div>

                <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                    <input 
                        type="month" 
                        value={mesFiltro}
                        onChange={(e) => setMesFiltro(e.target.value)}
                        style={{ 
                            padding: "12px 16px", borderRadius: "10px", border: "1px solid #cbd5e1", 
                            fontSize: "1rem", outline: "none", color: "#1e293b", background: "#fff", cursor: "pointer", fontWeight: "600"
                        }}
                    />
                    <button 
                        onClick={() => window.print()}
                        style={{ background: "#10b981", color: "white", border: "none", padding: "12px 20px", borderRadius: "10px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "0.2s", boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)" }}
                        onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                        onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                    >
                        <Printer size={18} /> Baixar PDF de Auditoria
                    </button>
                </div>
            </div>

            {/* LINHA 1: KPIs Principais (4 cards) */}
            <div className="print-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "20px" }}>
                <div className="print-card" style={cardStyle}>
                    <div style={headerCardStyle}>
                        <span>Total de Cirurgias</span>
                        <Activity size={20} color="#6C63FF" />
                    </div>
                    <h2 style={valueStyle}>{metricas.total}</h2>
                    <span style={{ fontSize: "0.85rem", color: "#10b981", fontWeight: "600" }}>Neste período</span>
                </div>

                <div className="print-card" style={cardStyle}>
                    <div style={headerCardStyle}>
                        <span>Confirmadas / Finais</span>
                        <CheckCircle2 size={20} color="#10b981" />
                    </div>
                    <h2 style={valueStyle}>{metricas.confirmadas}</h2>
                    <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Agendamentos seguros</span>
                </div>

                <div className="print-card" style={cardStyle}>
                    <div style={headerCardStyle}>
                        <span>Taxa de Cancelamento</span>
                        <TrendingUp size={20} color="#ef4444" />
                    </div>
                    <h2 style={valueStyle}>{metricas.taxaCancelamento}%</h2>
                    <span style={{ fontSize: "0.85rem", color: "#ef4444", fontWeight: "600" }}>{metricas.canceladas} canceladas</span>
                </div>

                <div className="print-card" style={cardStyle}>
                    <div style={headerCardStyle}>
                        <span>OPMEs Pendentes</span>
                        <AlertCircle size={20} color="#f59e0b" />
                    </div>
                    <h2 style={valueStyle}>{metricas.opmePendentes}</h2>
                    <span style={{ fontSize: "0.85rem", color: "#f59e0b", fontWeight: "600" }}>Requer atenção</span>
                </div>
            </div>

            {/* LINHA 2: Gráficos de Barra */}
            <div className="print-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                
                <div className="print-card" style={cardStyle}>
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

                <div className="print-card" style={cardStyle}>
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

            {/* LINHA 3: TOP RANKINGS (MÉDICOS E HOSPITAIS) */}
            <div className="print-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div className="print-card" style={cardStyle}>
                    <h3 style={{ margin: "0 0 10px 0", color: "#1e293b", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                        <Users size={18} color="#10b981"/> Top Produtividade (Médicos)
                    </h3>
                    <RankingList dados={rankingMedicos} sufixo="cirurgia(s)" />
                </div>

                <div className="print-card" style={cardStyle}>
                    <h3 style={{ margin: "0 0 10px 0", color: "#1e293b", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                        <Building2 size={18} color="#f59e0b"/> Locais mais atuantes (Hospitais)
                    </h3>
                    <RankingList dados={rankingHospitais} sufixo="vol." />
                </div>
            </div>

            {/* LINHA 4: NOVOS RANKINGS (CONVÊNIOS E OPME) */}
            <div className="print-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div className="print-card" style={cardStyle}>
                    <h3 style={{ margin: "0 0 10px 0", color: "#1e293b", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                        <ShieldPlus size={18} color="#3b82f6"/> Top Convênios
                    </h3>
                    <RankingList dados={rankingConvenios} sufixo="vol." />
                </div>

                <div className="print-card" style={cardStyle}>
                    <h3 style={{ margin: "0 0 10px 0", color: "#1e293b", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                        <Truck size={18} color="#8b5cf6"/> Top Fornecedores de OPME
                    </h3>
                    <RankingList dados={rankingFornecedores} sufixo="pedido(s)" />
                </div>
            </div>
            
        </div>
    );
}

export default Relatorios;