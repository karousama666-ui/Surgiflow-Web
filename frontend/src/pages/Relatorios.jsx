import React, { useState, useMemo, useEffect } from "react";
import { useCirurgias } from "../context/CirurgiasContext";
import { usePedidos } from "../context/PedidosContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from '../services/supabase';

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
    Printer,
    Calendar,
    User,
    FileText,
    Copy,
    BarChart3
} from "lucide-react";

function Relatorios() {
    const { usuario } = useAuth();
    const { listaCirurgias } = useCirurgias();
    const { listaPedidos } = usePedidos();

    // 🌟 CONTROLE DE ABAS (Tabs)
    const [abaAtiva, setAbaAtiva] = useState('analitico'); // 'analitico' ou 'diario'

    // ========================================================
    // 📊 ESTADOS E LÓGICA DA ABA 1: VISÃO ANALÍTICA (SEU CÓDIGO)
    // ========================================================
    const [mesFiltro, setMesFiltro] = useState(new Date().toISOString().slice(0, 7));

    const { 
        metricas, 
        rankingMedicos, 
        rankingHospitais, 
        rankingConvenios, 
        rankingFornecedores 
    } = useMemo(() => {
        const cirurgiasDoMes = listaCirurgias.filter(c => {
            if (!c.data_cirurgia) return false;
            return c.data_cirurgia.startsWith(mesFiltro);
        });

        const total = cirurgiasDoMes.length;
        const confirmadas = cirurgiasDoMes.filter(c => c.status === "Confirmada" || c.status === "Finalizada").length;
        const canceladas = cirurgiasDoMes.filter(c => c.status === "Cancelada").length;
        const pendentes = cirurgiasDoMes.filter(c => c.status === "Pendente").length;

        const opmesDoMesBrutos = listaPedidos.filter(p => 
            cirurgiasDoMes.some(c => String(c.id) === String(p.cirurgia_id))
        );

        const opmesDoMes = opmesDoMesBrutos.filter((pedido, index, self) =>
            index === self.findIndex((p) => p.cirurgia_id === pedido.cirurgia_id)
        );

        const opmeAprovados = opmesDoMes.filter(p => p.status === "Aprovado" || p.status === "Material Entregue").length;
        const opmePendentes = opmesDoMes.filter(p => p.status === "Aguardando Orçamento" || p.status === "Em Aprovação (Convênio)").length;

        const gerarRanking = (array, extrator) => {
            const contagem = {};
            array.forEach(item => {
                const chave = extrator(item) || "Não informado";
                contagem[chave] = (contagem[chave] || 0) + 1;
            });
            return Object.entries(contagem)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);
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

    // ========================================================
    // 📋 ESTADOS E LÓGICA DA ABA 2: AGENDA DIÁRIA (WHATSAPP/PDF)
    // ========================================================
    const [dataDiario, setDataDiario] = useState(new Date().toISOString().split('T')[0]);
    const [medicoSelecionado, setMedicoSelecionado] = useState('');
    const [medicosBanco, setMedicosBanco] = useState([]);
    const [cirurgiasDoDia, setCirurgiasDoDia] = useState([]);
    const [loadingDiario, setLoadingDiario] = useState(false);
    const [copiado, setCopiado] = useState(false);

    useEffect(() => {
        async function carregarMedicos() {
            const { data } = await supabase.from('medicos').select('id, nome').eq('user_id', usuario?.id);
            if (data) setMedicosBanco(data);
        }
        if (usuario && abaAtiva === 'diario') carregarMedicos();
    }, [usuario, abaAtiva]);

    useEffect(() => {
        async function buscarCirurgias() {
            if (!medicoSelecionado || !dataDiario) return;
            setLoadingDiario(true);
            
            // 🛡️ Filtro Blindado
            const cirurgiasFiltradas = listaCirurgias.filter(c => {
                const dataBate = c.data_cirurgia && c.data_cirurgia.startsWith(dataDiario);
                const idDoMedicoNaCirurgia = String(c.medico_id || c.medicos?.id || c.id_medico);
                const medicoBate = idDoMedicoNaCirurgia === String(medicoSelecionado);

                return dataBate && medicoBate;
            });

            const cirurgiasComMateriais = cirurgiasFiltradas.map(cirurgia => {
                const pedidoVinculado = listaPedidos.find(p => String(p.cirurgia_id) === String(cirurgia.id));
                return { ...cirurgia, materiais: pedidoVinculado?.materiais || 'Nenhum material listado' };
            });

            setCirurgiasDoDia(cirurgiasComMateriais.sort((a, b) => (a.horario || '').localeCompare(b.horario || '')));
            setLoadingDiario(false);
        }
        
        buscarCirurgias();
    }, [dataDiario, medicoSelecionado, listaCirurgias, listaPedidos]);

    const handleCopiarWhatsApp = () => {
        const nomeMedico = medicosBanco.find(m => String(m.id) === String(medicoSelecionado))?.nome || "Médico";
        const dataFormatada = dataDiario.split('-').reverse().join('/');

        let texto = `*📋 AGENDA CIRÚRGICA - ${dataFormatada}*\n`;
        texto += `*👨‍⚕️ Dr(a).* ${nomeMedico}\n\n`;

        if (cirurgiasDoDia.length === 0) {
            texto += `Nenhuma cirurgia agendada para este dia.`;
        } else {
            cirurgiasDoDia.forEach((c, index) => {
                texto += `*${index + 1}️⃣ Paciente:* ${c.paciente_nome}\n`;
                texto += `*⏰ Horário:* ${c.horario || 'A confirmar'}\n`;
                texto += `*🏥 Hospital:* ${c.hospital || 'A confirmar'}\n`;
                texto += `*💉 Procedimento:* ${c.procedimento || 'Não informado'}\n`; // 👈 Aqui estava a faca kkk
                if (c.convenio) texto += `*💳 Convênio:* ${c.convenio}\n`;
                texto += `*📦 OPME:* ${c.materiais}\n`;
                texto += `-----------------------------------\n`;
            });
        }

        navigator.clipboard.writeText(texto);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 3000);
    };

    // ========================================================
    // 🎨 ESTILOS REUTILIZÁVEIS
    // ========================================================
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
            
            {/* 👇 MÁGICA DO PDF: CSS INJETADO PARA IMPRESSÃO PERFEITA 👇 */}
            <style>
                {`
                @media print {
                    body { background: white !important; margin: 0; padding: 0; }
                    aside, header, .nao-imprimir { display: none !important; }
                    main { padding: 0 !important; background: white !important; overflow: visible !important; }
                    
                    /* Cabeçalhos do PDF */
                    .print-header { display: block !important; margin-bottom: 30px; }
                    
                    /* Evita quebras de página ruins */
                    .print-card, .pdf-item { page-break-inside: avoid; border: 1px solid #cbd5e1 !important; box-shadow: none !important; }
                    
                    /* Ajuste do grid analítico */
                    .print-grid-4 { display: grid !important; grid-template-columns: repeat(4, 1fr) !important; gap: 10px !important; }
                    .print-grid-2 { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 15px !important; }
                }
                .print-header { display: none; }
                `}
            </style>

            {/* CABEÇALHO DO TÍTULO E ABAS (Escondido na Impressão) */}
            <div className="nao-imprimir" style={{ marginBottom: "30px" }}>
                <h1 style={{ fontSize: "1.8rem", color: "#1e293b", margin: "0 0 4px 0", fontWeight: "800" }}>
                    Relatórios Gerenciais
                </h1>
                <p style={{ color: "#64748b", fontSize: "0.95rem", margin: "0 0 20px 0", fontWeight: "500" }}>
                    Visão analítica, auditoria de OPME e resumos de agenda.
                </p>

                {/* 🌟 NAVEGADOR DE ABAS 🌟 */}
                <div style={{ display: 'flex', gap: '15px', borderBottom: '2px solid #e2e8f0', paddingBottom: '0px' }}>
                    <button 
                        onClick={() => setAbaAtiva('analitico')}
                        style={{ background: 'none', border: 'none', borderBottom: abaAtiva === 'analitico' ? '3px solid #6C63FF' : '3px solid transparent', padding: '10px 15px', fontWeight: '700', fontSize: '1rem', color: abaAtiva === 'analitico' ? '#6C63FF' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s' }}
                    >
                        <BarChart3 size={18} /> Visão Analítica
                    </button>
                    <button 
                        onClick={() => setAbaAtiva('diario')}
                        style={{ background: 'none', border: 'none', borderBottom: abaAtiva === 'diario' ? '3px solid #10b981' : '3px solid transparent', padding: '10px 15px', fontWeight: '700', fontSize: '1rem', color: abaAtiva === 'diario' ? '#10b981' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s' }}
                    >
                        <FileText size={18} /> Agenda Diária (WhatsApp)
                    </button>
                </div>
            </div>

            {/* ========================================================================= */}
            {/* 📊 TELA DA ABA 1: VISÃO ANALÍTICA (SEU CÓDIGO) */}
            {/* ========================================================================= */}
            {abaAtiva === 'analitico' && (
                <>
                    {/* CABEÇALHO PARA O PDF DE AUDITORIA ANALÍTICO */}
                    <div className="print-header">
                        <div style={{ borderBottom: "2px solid #0f172a", paddingBottom: "15px", marginBottom: "20px" }}>
                            <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#0f172a", margin: "0 0 5px 0" }}>Relatório de Conformidade e Fluxo Cirúrgico</h2>
                            <p style={{ margin: 0, color: "#475569", fontSize: "0.95rem" }}>Documentação comprobatória de rastreabilidade e operação sanitária.</p>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#334155", fontWeight: "600", marginBottom: "30px", background: "#f8fafc", padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                            <span>Período de Apuração: {mesFiltro.split('-').reverse().join('/')}</span>
                            <span>Diretrizes Aplicáveis: RDC 16/2013 e RDC 665/2022</span>
                            <span>Gerado em: {new Date().toLocaleDateString('pt-BR')}</span>
                        </div>
                    </div>

                    {/* Filtros da Aba 1 */}
                    <div className="nao-imprimir" style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px", gap: "15px" }}>
                        <input type="month" value={mesFiltro} onChange={(e) => setMesFiltro(e.target.value)} style={{ padding: "10px 16px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "1rem", outline: "none", color: "#1e293b", background: "#fff", cursor: "pointer", fontWeight: "600" }} />
                        <button onClick={() => window.print()} style={{ background: "#1e293b", color: "white", border: "none", padding: "10px 20px", borderRadius: "10px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                            <Printer size={18} /> Salvar PDF
                        </button>
                    </div>

                    <div className="print-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "20px" }}>
                        <div className="print-card" style={cardStyle}>
                            <div style={headerCardStyle}><span>Total de Cirurgias</span><Activity size={20} color="#6C63FF" /></div>
                            <h2 style={valueStyle}>{metricas.total}</h2>
                            <span style={{ fontSize: "0.85rem", color: "#10b981", fontWeight: "600" }}>Neste período</span>
                        </div>
                        <div className="print-card" style={cardStyle}>
                            <div style={headerCardStyle}><span>Confirmadas / Finais</span><CheckCircle2 size={20} color="#10b981" /></div>
                            <h2 style={valueStyle}>{metricas.confirmadas}</h2>
                            <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Agendamentos seguros</span>
                        </div>
                        <div className="print-card" style={cardStyle}>
                            <div style={headerCardStyle}><span>Taxa de Cancelamento</span><TrendingUp size={20} color="#ef4444" /></div>
                            <h2 style={valueStyle}>{metricas.taxaCancelamento}%</h2>
                            <span style={{ fontSize: "0.85rem", color: "#ef4444", fontWeight: "600" }}>{metricas.canceladas} canceladas</span>
                        </div>
                        <div className="print-card" style={cardStyle}>
                            <div style={headerCardStyle}><span>OPMEs Pendentes</span><AlertCircle size={20} color="#f59e0b" /></div>
                            <h2 style={valueStyle}>{metricas.opmePendentes}</h2>
                            <span style={{ fontSize: "0.85rem", color: "#f59e0b", fontWeight: "600" }}>Requer atenção</span>
                        </div>
                    </div>

                    <div className="print-grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "20px", marginBottom: "20px" }}>
                        <div className="print-card" style={cardStyle}>
                            <h3 style={{ margin: "0 0 15px 0", color: "#1e293b", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={18} color="#6C63FF"/> Status das Cirurgias</h3>
                            <div style={{ marginBottom: "12px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "5px", fontWeight: "600", color: "#475569" }}><span>Pendentes ({metricas.pendentes})</span><span>{metricas.total > 0 ? Math.round((metricas.pendentes/metricas.total)*100) : 0}%</span></div>
                                <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}><div style={{ width: `${metricas.total > 0 ? (metricas.pendentes/metricas.total)*100 : 0}%`, height: "100%", background: "#f59e0b" }}></div></div>
                            </div>
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "5px", fontWeight: "600", color: "#475569" }}><span>Canceladas ({metricas.canceladas})</span><span>{metricas.total > 0 ? Math.round((metricas.canceladas/metricas.total)*100) : 0}%</span></div>
                                <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}><div style={{ width: `${metricas.total > 0 ? (metricas.canceladas/metricas.total)*100 : 0}%`, height: "100%", background: "#ef4444" }}></div></div>
                            </div>
                        </div>

                        <div className="print-card" style={cardStyle}>
                            <h3 style={{ margin: "0 0 15px 0", color: "#1e293b", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}><PackageSearch size={18} color="#6C63FF"/> Funil de OPME</h3>
                            <div style={{ marginBottom: "12px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "5px", fontWeight: "600", color: "#475569" }}><span>Liberados / Entregues ({metricas.opmeAprovados})</span><span>{metricas.opmeTotal > 0 ? Math.round((metricas.opmeAprovados/metricas.opmeTotal)*100) : 0}%</span></div>
                                <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}><div style={{ width: `${metricas.opmeTotal > 0 ? (metricas.opmeAprovados/metricas.opmeTotal)*100 : 0}%`, height: "100%", background: "#10b981" }}></div></div>
                            </div>
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "5px", fontWeight: "600", color: "#475569" }}><span>Em Análise / Orçamento ({metricas.opmePendentes})</span><span>{metricas.opmeTotal > 0 ? Math.round((metricas.opmePendentes/metricas.opmeTotal)*100) : 0}%</span></div>
                                <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}><div style={{ width: `${metricas.opmeTotal > 0 ? (metricas.opmePendentes/metricas.opmeTotal)*100 : 0}%`, height: "100%", background: "#f59e0b" }}></div></div>
                            </div>
                        </div>
                    </div>

                    <div className="print-grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "20px", marginBottom: "20px" }}>
                        <div className="print-card" style={cardStyle}>
                            <h3 style={{ margin: "0 0 10px 0", color: "#1e293b", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}><Users size={18} color="#10b981"/> Top Produtividade (Médicos)</h3>
                            <RankingList dados={rankingMedicos} sufixo="cirurgia(s)" />
                        </div>
                        <div className="print-card" style={cardStyle}>
                            <h3 style={{ margin: "0 0 10px 0", color: "#1e293b", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}><Building2 size={18} color="#f59e0b"/> Locais mais atuantes</h3>
                            <RankingList dados={rankingHospitais} sufixo="vol." />
                        </div>
                    </div>

                    <div className="print-grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "20px" }}>
                        <div className="print-card" style={cardStyle}>
                            <h3 style={{ margin: "0 0 10px 0", color: "#1e293b", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}><ShieldPlus size={18} color="#3b82f6"/> Top Convênios</h3>
                            <RankingList dados={rankingConvenios} sufixo="vol." />
                        </div>
                        <div className="print-card" style={cardStyle}>
                            <h3 style={{ margin: "0 0 10px 0", color: "#1e293b", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}><Truck size={18} color="#8b5cf6"/> Top Fornecedores de OPME</h3>
                            <RankingList dados={rankingFornecedores} sufixo="pedido(s)" />
                        </div>
                    </div>
                </>
            )}

            {/* ========================================================================= */}
            {/* 📋 TELA DA ABA 2: AGENDA DIÁRIA E WHATSAPP */}
            {/* ========================================================================= */}
            {abaAtiva === 'diario' && (
                <>
                    <div className="nao-imprimir" style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <div style={{ flex: '1 1 200px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '8px' }}><Calendar size={14} style={{ display: 'inline', marginRight: '4px' }}/> Data</label>
                            <input type="date" value={dataDiario} onChange={(e) => setDataDiario(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', color: '#1e293b', fontWeight: '600' }} />
                        </div>

                        <div style={{ flex: '1 1 250px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '8px' }}><User size={14} style={{ display: 'inline', marginRight: '4px' }}/> Médico Responsável</label>
                            <select value={medicoSelecionado} onChange={(e) => setMedicoSelecionado(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', color: '#1e293b', background: 'white', fontWeight: '600' }}>
                                <option value="">Selecione...</option>
                                {medicosBanco.map(m => (
                                    <option key={m.id} value={m.id}>{m.nome}</option>
                                ))}
                            </select>
                        </div>

                        <button onClick={handleCopiarWhatsApp} disabled={!medicoSelecionado || cirurgiasDoDia.length === 0} style={{ background: copiado ? '#10b981' : '#25D366', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: '700', cursor: (!medicoSelecionado || cirurgiasDoDia.length === 0) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: (!medicoSelecionado || cirurgiasDoDia.length === 0) ? 0.5 : 1 }}>
                            {copiado ? <CheckCircle2 size={18} /> : <Copy size={18} />} {copiado ? 'Copiado!' : 'Copiar Texto'}
                        </button>
                        
                        <button onClick={() => window.print()} disabled={!medicoSelecionado || cirurgiasDoDia.length === 0} style={{ background: '#10b981', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: '700', cursor: (!medicoSelecionado || cirurgiasDoDia.length === 0) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: (!medicoSelecionado || cirurgiasDoDia.length === 0) ? 0.5 : 1 }}>
                            <Printer size={18} /> Salvar PDF
                        </button>
                    </div>

                    <div style={{ background: 'white', padding: '40px', borderRadius: '16px', border: '1px solid #e2e8f0', minHeight: '300px' }}>
                        {!medicoSelecionado ? (
                            <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '50px', fontWeight: '500' }}>Selecione o médico para visualizar a agenda.</p>
                        ) : cirurgiasDoDia.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#f59e0b', marginTop: '50px', fontWeight: '600' }}>Nenhuma cirurgia agendada para este dia.</p>
                        ) : (
                            <>
                                {/* CABEÇALHO DO PDF DIÁRIO */}
                                <div className="print-header">
                                    <div style={{ borderBottom: '2px solid #1e293b', paddingBottom: '15px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                        <div>
                                            <h2 style={{ margin: '0 0 5px 0', color: '#1e293b', fontSize: '1.6rem', fontWeight: '800' }}>Agenda Cirúrgica Diária</h2>
                                            <h3 style={{ margin: 0, color: '#10b981', fontSize: '1.1rem', fontWeight: '700' }}>Dr(a). {medicosBanco.find(m => String(m.id) === String(medicoSelecionado))?.nome}</h3>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ display: 'block', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>DATA</span>
                                            <span style={{ color: '#1e293b', fontSize: '1.2rem', fontWeight: '800' }}>{dataDiario.split('-').reverse().join('/')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {cirurgiasDoDia.map((c, index) => (
                                        <div key={c.id} className="pdf-item" style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px', background: '#f8fafc' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px', marginBottom: '10px' }}>
                                                <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b', fontWeight: '800' }}>
                                                    <span style={{ color: '#10b981', marginRight: '8px' }}>#{index + 1}</span> {c.paciente_nome}
                                                </h4>
                                                <span style={{ background: '#1e293b', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700' }}>
                                                    ⏰ {c.horario || 'A confirmar'}
                                                </span>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem' }}>
                                                <div><strong style={{ color: '#475569' }}>🏥 Hospital:</strong> <span style={{ color: '#1e293b', fontWeight: '600' }}>{c.hospital}</span></div>
                                                <div><strong style={{ color: '#475569' }}>💳 Convênio:</strong> <span style={{ color: '#1e293b', fontWeight: '600' }}>{c.convenio}</span></div>
                                                <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#475569' }}>💉 Procedimento:</strong> <span style={{ color: '#1e293b', fontWeight: '600' }}>{c.procedimento}</span></div> {/* 👈 Aqui também! */}
                                                <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#475569' }}>📦 OPME:</strong> <span style={{ color: '#1e293b', fontWeight: '600' }}>{c.materiais}</span></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}

        </div>
    );
}

export default Relatorios;