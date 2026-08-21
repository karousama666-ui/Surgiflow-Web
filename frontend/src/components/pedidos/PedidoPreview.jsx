import { useState, useEffect } from "react";
import Modal from "../modal/Modal";
import "./PedidoPreview.css";
import logoDocumento from "../../assets/logopdf.png";
import { User, Stethoscope, Building2, CalendarDays, Clock3, CircleCheck, FileText, Package, Paperclip } from "lucide-react"; // 👈 Adicionamos o Paperclip (Clipe de papel)
import { usePedidos } from "../../context/PedidosContext";

function PedidoPreview({ cirurgia, pedido, isOpen, onClose }) {
    const { salvarPedido } = usePedidos();

    const [form, setForm] = useState({
        fornecedor: "",
        materiais: "",
        valor_total: "",
        status: "Aguardando Orçamento"
    });

    useEffect(() => {
        if (pedido) {
            setForm({
                fornecedor: pedido.fornecedor || "",
                materiais: pedido.materiais || "",
                valor_total: pedido.valor_total || "",
                status: pedido.status || "Aguardando Orçamento"
            });
        } else {
            setForm({ fornecedor: "", materiais: "", valor_total: "", status: "Aguardando Orçamento" });
        }
    }, [pedido, isOpen]);

    if (!cirurgia) return null;

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSalvarOPME() {
        try {
            const dados = { ...form, cirurgia_id: cirurgia.id };
            if (pedido?.id) dados.id = pedido.id;

            await salvarPedido(dados);
            
            alert("✅ Pedido OPME salvo com sucesso!");
            onClose(); 

        } catch (error) {
            console.error("Erro ao salvar OPME:", error);
            alert("❌ Ops! Erro ao salvar o pedido: " + (error.message || "Verifique o console apertando F12"));
        }
    }

    let data = "Não informada";
    let hora = "Não informado";
    if (cirurgia?.data_cirurgia) {
        const partes = cirurgia.data_cirurgia.split(" ");
        const [ano, mes, dia] = partes[0].split("-");
        data = `${dia}/${mes}/${ano}`;
        hora = partes[1] || "Não informado";
    }
    const nomeMedico = cirurgia?.medicos?.nome ? `Dr(a). ${cirurgia.medicos.nome}` : "Médico não informado";

    const inputStyle = {
        width: "100%", padding: "12px", border: "1px solid #cbd5e1", borderRadius: "8px", 
        fontSize: "14px", marginTop: "6px", backgroundColor: "#f8fafc", outline: "none", color: "#1e293b",
        fontFamily: "inherit", boxSizing: "border-box" 
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            {/* CONTAINER PRINCIPAL BLINDADO */}
            <div style={{ 
                width: "100%", maxWidth: "650px", display: "flex", flexDirection: "column",
                fontFamily: "'Montserrat', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                color: "#1e293b"
            }}>
                
                {/* ÁREA COM ROLAGEM INTERNA */}
                <div style={{ maxHeight: "70vh", overflowY: "auto", overflowX: "hidden", paddingRight: "10px" }}>
                    <div style={{ background: "white", padding: "10px 15px" }}>
                        
                        {/* CABEÇALHO */}
                        <div style={{ textAlign: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "20px", marginBottom: "25px" }}>
                            <img src={logoDocumento} alt="SurgiFlow" style={{ height: "45px", marginBottom: "15px", objectFit: "contain" }} onError={(e) => e.target.style.display = 'none'} />
                            <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#0f172a", margin: 0 }}>Pedido Cirúrgico / OPME</h2>
                        </div>

                        {/* GRID DE INFORMAÇÕES DO PACIENTE */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6C63FF", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase" }}>
                                    <User size={16} /> Paciente
                                </div>
                                <span style={{ fontSize: "1.05rem", fontWeight: "600" }}>{cirurgia.paciente}</span>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6C63FF", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase" }}>
                                    <Stethoscope size={16} /> Médico
                                </div>
                                <span style={{ fontSize: "1.05rem", fontWeight: "600" }}>{nomeMedico}</span>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6C63FF", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase" }}>
                                    <Building2 size={16} /> Hospital
                                </div>
                                <span style={{ fontSize: "1.05rem", fontWeight: "600" }}>{cirurgia.hospital}</span>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6C63FF", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase" }}>
                                    <FileText size={16} /> Convênio
                                </div>
                                <span style={{ fontSize: "1.05rem", fontWeight: "600" }}>{cirurgia.convenio}</span>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6C63FF", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase" }}>
                                    <CalendarDays size={16} /> Data
                                </div>
                                <span style={{ fontSize: "1.05rem", fontWeight: "600" }}>{data}</span>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6C63FF", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase" }}>
                                    <Clock3 size={16} /> Horário
                                </div>
                                <span style={{ fontSize: "1.05rem", fontWeight: "600" }}>{hora}</span>
                            </div>

                            <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "4px", padding: "12px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6C63FF", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase" }}>
                                    <CircleCheck size={16} /> Status da Cirurgia
                                </div>
                                <span style={{ fontSize: "1.1rem", fontWeight: "700", color: "#10b981" }}>{cirurgia.status}</span>
                            </div>
                        </div>

                        {/* FORMULÁRIO OPME */}
                        <div style={{ borderTop: "2px solid #f1f5f9", paddingTop: "25px" }}>
                            <h3 style={{ color: "#0f172a", fontSize: "1.1rem", margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "8px", fontWeight: "700" }}>
                                <Package size={20} color="#6C63FF" /> Especificações de OPME
                            </h3>
                            
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                                <div>
                                    <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Fornecedor</label>
                                    <input name="fornecedor" value={form.fornecedor} onChange={handleChange} style={inputStyle} placeholder="Ex: Medtronic, J&J..." />
                                </div>
                                <div>
                                    <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Status (Compras)</label>
                                    <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
                                        <option value="Aguardando Orçamento">Aguardando Orçamento</option>
                                        <option value="Em Aprovação (Convênio)">Em Aprovação (Convênio)</option>
                                        <option value="Aprovado">Aprovado</option>
                                        <option value="Material Entregue">Material Entregue</option>
                                        <option value="Cancelado">Cancelado</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Lista de Materiais / Justificativa</label>
                                <textarea name="materiais" value={form.materiais} onChange={handleChange} rows="4" style={{ ...inputStyle, resize: "none" }} placeholder="Descreva as órteses, próteses e materiais especiais necessários..."></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 👇 BOTÕES DE AÇÃO ATUALIZADOS 👇 */}
                <div style={{ display: "flex", gap: "15px", marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #e2e8f0" }}>
                    <button
                        onClick={handleSalvarOPME}
                        style={{ flex: 1, background: "#10b981", color: "white", border: "none", borderRadius: "10px", padding: "14px", fontWeight: "700", cursor: "pointer", fontSize: "0.95rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", fontFamily: "inherit", transition: "0.2s" }}
                        onMouseOver={(e) => e.currentTarget.style.background = "#059669"}
                        onMouseOut={(e) => e.currentTarget.style.background = "#10b981"}
                    >
                        💾 Salvar OPME
                    </button>

                    {/* Lógica Inteligente para o Anexo */}
                    {cirurgia?.anexo_url ? (
                        <button
                            onClick={() => window.open(cirurgia.anexo_url, "_blank")}
                            style={{ flex: 1, background: "#6C63FF", color: "white", border: "none", borderRadius: "10px", padding: "14px", fontWeight: "700", cursor: "pointer", fontSize: "0.95rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", fontFamily: "inherit", transition: "0.2s" }}
                            onMouseOver={(e) => e.currentTarget.style.background = "#5b54d6"}
                            onMouseOut={(e) => e.currentTarget.style.background = "#6C63FF"}
                        >
                            <Paperclip size={18} /> Ver Documento Original
                        </button>
                    ) : (
                        <button
                            disabled
                            style={{ flex: 1, background: "#f1f5f9", color: "#94a3b8", border: "1px solid #cbd5e1", borderRadius: "10px", padding: "14px", fontWeight: "700", cursor: "not-allowed", fontSize: "0.95rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", fontFamily: "inherit" }}
                        >
                            <Paperclip size={18} /> Sem Anexo
                        </button>
                    )}
                </div>

            </div>
        </Modal>
    );
}

export default PedidoPreview;