import { useState } from "react";
import { useCirurgias } from "../context/CirurgiasContext";
import { usePedidos } from "../context/PedidosContext"; 
import PedidoCard from "../components/pedidos/PedidoCard";
import PedidoPreview from "../components/pedidos/PedidoPreview";
import "./Pedidos.css";
import { LayoutGrid, List } from "lucide-react"; // 👈 Ícones para o alternador de visão

// 👇 AS COLUNAS DO NOSSO QUADRO TRELLO 👇
const COLUNAS_KANBAN = [
    { id: "Pendente", titulo: "Sem OPME / Novos", corFundo: "#f8fafc", corBorda: "#e2e8f0", corTopo: "#94a3b8" },
    { id: "Aguardando Orçamento", titulo: "Orçamento", corFundo: "#fffbeb", corBorda: "#ffedd5", corTopo: "#f59e0b" },
    { id: "Em Aprovação (Convênio)", titulo: "Em Aprovação", corFundo: "#eff6ff", corBorda: "#dbeafe", corTopo: "#3b82f6" },
    { id: "Aprovado", titulo: "Aprovado", corFundo: "#ecfdf5", corBorda: "#d1fae5", corTopo: "#10b981" },
    { id: "Material Entregue", titulo: "Entregue", corFundo: "#f0fdf4", corBorda: "#bbf7d0", corTopo: "#059669" }
];

function Pedidos() {
    const { listaCirurgias } = useCirurgias();
    const { listaPedidos, salvarPedido } = usePedidos(); // 👈 Precisamos da função salvarPedido para o arrastar/soltar

    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    
    const [pesquisa, setPesquisa] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("");
    const [filtroHospital, setFiltroHospital] = useState("");
    const [filtroMedico, setFiltroMedico] = useState("");

    // Estado do Alternador de Visão: 'kanban' ou 'lista'
    const [visao, setVisao] = useState("kanban");

    // Estado para saber qual card está sendo arrastado no momento
    const [draggedItem, setDraggedItem] = useState(null);

    function converterData(dataCirurgia) {
        if (!dataCirurgia) return 0;
        const apenasData = dataCirurgia.split(" ")[0]; 
        return new Date(apenasData).getTime();
    }

    function obterNomeMedico(cirurgia) {
        return cirurgia.medicos && cirurgia.medicos.nome 
            ? cirurgia.medicos.nome 
            : "Médico não informado";
    }

    const hospitais = [...new Set(listaCirurgias.map(c => c.hospital).filter(Boolean))];
    const medicos = [...new Set(listaCirurgias.map(c => obterNomeMedico(c)).filter(Boolean))];

    const pedidosFiltrados = listaCirurgias
        .filter(cirurgia => {
            const paciente = cirurgia.paciente?.toLowerCase() || "";
            const busca = pesquisa.toLowerCase();
            const nomeMedico = obterNomeMedico(cirurgia);

            const correspondePesquisa = paciente.includes(busca);
            const correspondeStatus = filtroStatus === "" || cirurgia.status === filtroStatus;
            const correspondeHospital = filtroHospital === "" || cirurgia.hospital === filtroHospital;
            const correspondeMedico = filtroMedico === "" || nomeMedico === filtroMedico;

            // No Kanban, ignoramos cirurgias canceladas na visão principal para não poluir
            const naoCancelado = visao === "kanban" ? cirurgia.status !== "Cancelada" : true;

            return correspondePesquisa && correspondeStatus && correspondeHospital && correspondeMedico && naoCancelado;
        })
        .sort((a, b) => converterData(b.data_cirurgia) - converterData(a.data_cirurgia));

    // 👇 MÁGICA DO ARRASTAR E SOLTAR (DRAG AND DROP) 👇
    const handleDragStart = (e, cirurgia, pedido) => {
        setDraggedItem({ cirurgia, pedido });
    };

    const handleDrop = async (e, colunaDestinoStatus) => {
        e.preventDefault();
        if (!draggedItem) return;

        const statusAtual = draggedItem.pedido?.status || "Pendente";
        
        // Se soltou na mesma coluna que já estava, ignora
        if (statusAtual === colunaDestinoStatus) {
            setDraggedItem(null);
            return;
        }

        // Monta os dados para salvar
        const dadosSalvar = draggedItem.pedido 
            ? { ...draggedItem.pedido, status: colunaDestinoStatus } 
            : { cirurgia_id: draggedItem.cirurgia.id, status: colunaDestinoStatus, fornecedor: "", materiais: "", valor_total: "" }; // Se o pedido não existia, cria um esqueleto dele

        try {
            await salvarPedido(dadosSalvar);
        } catch (error) {
            console.error("Erro ao mover card:", error);
            alert("Erro ao mover OPME. Tente novamente.");
        } finally {
            setDraggedItem(null);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Permite que a div receba o elemento que foi solto
    };

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                <div>
                    <h1 style={{ margin: "0 0 5px 0", color: "#0f172a" }}>Pedidos de OPME</h1>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "0.95rem" }}>Acompanhe o funil de orçamentos e liberação de materiais.</p>
                </div>

                {/* 👇 O ALTERNADOR DE VISÃO (TOGGLE) 👇 */}
                <div style={{ display: "flex", background: "#f1f5f9", padding: "4px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <button 
                        onClick={() => setVisao("kanban")}
                        style={{ display: "flex", alignItems: "center", gap: "6px", background: visao === "kanban" ? "#fff" : "transparent", color: visao === "kanban" ? "#6C63FF" : "#64748b", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", transition: "0.2s", boxShadow: visao === "kanban" ? "0 2px 4px rgba(0,0,0,0.05)" : "none" }}
                    >
                        <LayoutGrid size={18} /> Quadro
                    </button>
                    <button 
                        onClick={() => setVisao("lista")}
                        style={{ display: "flex", alignItems: "center", gap: "6px", background: visao === "lista" ? "#fff" : "transparent", color: visao === "lista" ? "#6C63FF" : "#64748b", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", transition: "0.2s", boxShadow: visao === "lista" ? "0 2px 4px rgba(0,0,0,0.05)" : "none" }}
                    >
                        <List size={18} /> Lista
                    </button>
                </div>
            </div>

            {/* Filtros */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "12px", marginBottom: "25px" }}>
                <input type="text" placeholder="🔎 Buscar paciente..." value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} style={{ padding: "12px 15px", border: "1px solid #cbd5e1", borderRadius: "10px", fontSize: "14px", outline: "none", fontFamily: "inherit" }} />
                <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} style={{ padding: "12px", border: "1px solid #cbd5e1", borderRadius: "10px", outline: "none", fontFamily: "inherit", cursor: "pointer" }}>
                    <option value="">Status da Cirurgia (Todos)</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Confirmada">Confirmada</option>
                    <option value="Finalizada">Finalizada</option>
                    <option value="Cancelada">Cancelada</option>
                </select>
                <select value={filtroHospital} onChange={(e) => setFiltroHospital(e.target.value)} style={{ padding: "12px", border: "1px solid #cbd5e1", borderRadius: "10px", outline: "none", fontFamily: "inherit", cursor: "pointer" }}>
                    <option value="">Todos os hospitais</option>
                    {hospitais.map(hospital => <option key={hospital} value={hospital}>{hospital}</option>)}
                </select>
                <select value={filtroMedico} onChange={(e) => setFiltroMedico(e.target.value)} style={{ padding: "12px", border: "1px solid #cbd5e1", borderRadius: "10px", outline: "none", fontFamily: "inherit", cursor: "pointer" }}>
                    <option value="">Todos os médicos</option>
                    {medicos.map(medico => <option key={medico} value={medico}>{medico}</option>)}
                </select>
            </div>

            {/* 👇 RENDERIZAÇÃO DA VISÃO ESCOLHIDA 👇 */}
            {visao === "lista" ? (
                // =============== VISÃO LISTA CLÁSSICA ===============
                <div className="pedidos-grid">
                    {pedidosFiltrados.length === 0 ? (
                        <div style={{ background: "#fff", padding: "30px", borderRadius: "16px", textAlign: "center", color: "#777", gridColumn: "1 / -1" }}>Nenhum pedido encontrado.</div>
                    ) : (
                        pedidosFiltrados.map((cirurgia) => {
                            const pedidoDaCirurgia = listaPedidos.find(p => String(p.cirurgia_id) === String(cirurgia.id));
                            return (
                                <PedidoCard
                                    key={cirurgia.id}
                                    cirurgia={cirurgia}
                                    pedido={pedidoDaCirurgia}
                                    onPreview={() => {
                                        setPedidoSelecionado({ cirurgia, pedido: pedidoDaCirurgia });
                                        setPreviewOpen(true);
                                    }}
                                />
                            );
                        })
                    )}
                </div>
            ) : (
                // =============== VISÃO KANBAN (QUADRO) ===============
                <div style={{ display: "flex", gap: "20px", overflowX: "auto", minHeight: "60vh", paddingBottom: "20px", alignItems: "flex-start" }}>
                    
                    {COLUNAS_KANBAN.map(coluna => {
                        // Filtra as cirurgias que pertencem a esta coluna
                        const cardsDestaColuna = pedidosFiltrados.filter(cirurgia => {
                            const pedidoDaCirurgia = listaPedidos.find(p => String(p.cirurgia_id) === String(cirurgia.id));
                            const statusOPME = pedidoDaCirurgia?.status || "Pendente";
                            return statusOPME === coluna.id;
                        });

                        return (
                            <div 
                                key={coluna.id} 
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, coluna.id)}
                                style={{ 
                                    minWidth: "320px", width: "320px", background: coluna.corFundo, border: `1px solid ${coluna.corBorda}`, 
                                    borderRadius: "14px", display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" 
                                }}
                            >
                                {/* Topo da Coluna */}
                                <div style={{ padding: "15px", borderBottom: `2px solid ${coluna.corTopo}`, background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <h3 style={{ margin: 0, fontSize: "1rem", color: "#1e293b", fontWeight: "700" }}>{coluna.titulo}</h3>
                                    <span style={{ background: "#f1f5f9", color: "#475569", padding: "2px 8px", borderRadius: "10px", fontSize: "0.8rem", fontWeight: "800" }}>
                                        {cardsDestaColuna.length}
                                    </span>
                                </div>

                                {/* Corpo da Coluna onde ficam os cards */}
                                <div style={{ padding: "15px", display: "flex", flexDirection: "column", gap: "15px", flex: 1, minHeight: "150px" }}>
                                    {cardsDestaColuna.map(cirurgia => {
                                        const pedidoDaCirurgia = listaPedidos.find(p => String(p.cirurgia_id) === String(cirurgia.id));
                                        
                                        return (
                                            <div 
                                                key={cirurgia.id} 
                                                draggable // 👈 Ativa o Drag and Drop HTML5 nativo
                                                onDragStart={(e) => handleDragStart(e, cirurgia, pedidoDaCirurgia)}
                                                style={{ cursor: "grab", opacity: draggedItem?.cirurgia.id === cirurgia.id ? 0.5 : 1 }}
                                            >
                                                {/* Reutilizamos o seu próprio PedidoCard dentro do Kanban! */}
                                                <PedidoCard
                                                    cirurgia={cirurgia}
                                                    pedido={pedidoDaCirurgia}
                                                    onPreview={() => {
                                                        setPedidoSelecionado({ cirurgia, pedido: pedidoDaCirurgia });
                                                        setPreviewOpen(true);
                                                    }}
                                                />
                                            </div>
                                        );
                                    })}

                                    {cardsDestaColuna.length === 0 && (
                                        <div style={{ textAlign: "center", padding: "30px 10px", color: "#cbd5e1", fontSize: "0.9rem", fontStyle: "italic", border: "2px dashed #cbd5e1", borderRadius: "10px" }}>
                                            Solte um pedido aqui
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal de Detalhes do OPME */}
            <PedidoPreview
                cirurgia={pedidoSelecionado?.cirurgia}
                pedido={pedidoSelecionado?.pedido}
                isOpen={previewOpen}
                onClose={() => setPreviewOpen(false)}
            />
        </>
    );
}

export default Pedidos;