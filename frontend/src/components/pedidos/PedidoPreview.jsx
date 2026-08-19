import { useState, useEffect, useRef } from "react";
import Modal from "../modal/Modal";
import "./PedidoPreview.css";
import logoDocumento from "../../assets/logopdf.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { User, Stethoscope, Building2, CalendarDays, Clock3, CircleCheck, FileText, Package } from "lucide-react";
import { usePedidos } from "../../context/PedidosContext";

function PedidoPreview({ cirurgia, pedido, isOpen, onClose }) {
    const { salvarPedido } = usePedidos();
    const pdfRef = useRef(null);

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
        const dados = { ...form, cirurgia_id: cirurgia.id };
        if (pedido?.id) dados.id = pedido.id;

        await salvarPedido(dados);
        onClose();
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

    const gerarPDF = async () => {
        const elemento = pdfRef.current;
        const canvas = await html2canvas(elemento, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const larguraPDF = 210;
        const alturaPDF = (canvas.height * larguraPDF) / canvas.width;
        
        pdf.addImage(imgData, "PNG", 0, 0, larguraPDF, alturaPDF);
        pdf.save(`Pedido_Cirurgico_${cirurgia.paciente.replace(/\s+/g, "_")}.pdf`);
    };

    const inputStyle = {
        width: "100%", padding: "12px", border: "1px solid #cbd5e1", borderRadius: "8px", 
        fontSize: "14px", marginTop: "4px", backgroundColor: "#f8fafc", outline: "none", color: "#1e293b"
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            {/* CONTAINER PRINCIPAL: Mantém a largura ideal sem estourar o Modal */}
            <div style={{ minWidth: "600px", display: "flex", flexDirection: "column" }}>
                
                {/* ÁREA COM ROLAGEM INTERNA: Apenas o conteúdo desliza, os botões ficam fixos! */}
                <div style={{ maxHeight: "65vh", overflowY: "auto", paddingRight: "15px" }}>
                    <div ref={pdfRef} style={{ background: "white", padding: "10px" }}>
                        <div className="preview">
                            <div className="preview-header">
                                <img src={logoDocumento} alt="SurgiFlow" className="preview-logo" />
                                <h2>Pedido Cirúrgico / OPME</h2>
                            </div>

                            <div className="preview-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                <div className="preview-section">
                                    <strong><User size={16} /> Paciente</strong>
                                    <span>{cirurgia.paciente}</span>
                                </div>
                                <div className="preview-section">
                                    <strong><Stethoscope size={16} /> Médico</strong>
                                    <span>{nomeMedico}</span>
                                </div>
                                <div className="preview-section">
                                    <strong><Building2 size={16} /> Hospital</strong>
                                    <span>{cirurgia.hospital}</span>
                                </div>
                                <div className="preview-section">
                                    <strong><FileText size={16} /> Convênio</strong>
                                    <span>{cirurgia.convenio}</span>
                                </div>
                                <div className="preview-section">
                                    <strong><CalendarDays size={16} /> Data</strong>
                                    <span>{data}</span>
                                </div>
                                <div className="preview-section">
                                    <strong><Clock3 size={16} /> Horário</strong>
                                    <span>{hora}</span>
                                </div>
                                <div className="preview-section" style={{ gridColumn: "span 2" }}>
                                    <strong><CircleCheck size={16} /> Status da Cirurgia</strong>
                                    <span>{cirurgia.status}</span>
                                </div>
                            </div>

                            <div style={{ marginTop: "30px", borderTop: "2px solid #f1f5f9", paddingTop: "20px" }}>
                                <h3 style={{ color: "#1e293b", fontSize: "1.1rem", marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Package size={20} color="#6C63FF" /> Especificações de OPME
                                </h3>
                                
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                                    <div>
                                        <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#475569" }}>Fornecedor</label>
                                        <input name="fornecedor" value={form.fornecedor} onChange={handleChange} style={inputStyle} placeholder="Ex: Medtronic, J&J..." />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#475569" }}>Status (Compras)</label>
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
                                    <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#475569" }}>Lista de Materiais / Justificativa</label>
                                    <textarea name="materiais" value={form.materiais} onChange={handleChange} rows="4" style={{ ...inputStyle, resize: "none" }} placeholder="Descreva as órteses, próteses e materiais especiais necessários..."></textarea>
                                </div>
                            </div>

                            <div className="preview-footer" style={{ marginTop: "30px", textAlign: "center", color: "#94a3b8", fontSize: "0.85rem", paddingBottom: "10px" }}>
                                Documento gerado e auditado pelo <strong>SurgiFlow</strong>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RODAPÉ ALINHADO: Fica elegante na base do modal, sem vazar pra fora */}
                <div style={{ display: "flex", gap: "15px", marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #e2e8f0" }}>
                    <button
                        onClick={handleSalvarOPME}
                        style={{ flex: 1, background: "#10b981", color: "white", border: "none", borderRadius: "10px", padding: "14px", fontWeight: "600", cursor: "pointer", fontSize: "0.95rem" }}
                    >
                        💾 Salvar OPME
                    </button>
                    <button
                        onClick={gerarPDF}
                        style={{ flex: 1, background: "#6C63FF", color: "white", border: "none", borderRadius: "10px", padding: "14px", fontWeight: "600", cursor: "pointer", fontSize: "0.95rem" }}
                    >
                        📄 Gerar PDF
                    </button>
                </div>

            </div>
        </Modal>
    );
}

export default PedidoPreview;