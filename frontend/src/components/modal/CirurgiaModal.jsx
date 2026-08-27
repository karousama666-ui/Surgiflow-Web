import { useState, useEffect } from "react";
import Modal from "./Modal"; // Assumindo que você tem um componente base de Modal
import { useMedicos } from "../../context/MedicosContext";
import { usePacientes } from "../../context/PacientesContext"; 
import { supabase } from "../../services/supabase"; 
import { User, Hospital, FileText, Calendar, Clock, UploadCloud, FileCheck, X, Eye, Trash2, CheckSquare, Syringe, FileEdit, CalendarDays, MapPin, Paperclip } from "lucide-react";

// ==========================================
// COMPONENTE: CHECKBOX PREMIUM
// ==========================================
const CustomCheck = ({ label, field, checked, onChange }) => (
    <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", userSelect: "none", padding: "8px", borderRadius: "8px", transition: "0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = "#f8fafc"} onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
        <div style={{
            width: "20px", height: "20px", borderRadius: "6px",
            background: checked ? "#10b981" : "#ffffff",
            border: checked ? "1px solid #10b981" : "1px solid #cbd5e1",
            display: "flex", justifyContent: "center", alignItems: "center",
            transition: "all 0.2s ease",
            flexShrink: 0
        }}>
            {checked && <FileCheck size={14} color="white" strokeWidth={3} />}
        </div>
        <span style={{ color: checked ? "#065f46" : "#475569", fontSize: "0.85rem", fontWeight: checked ? "600" : "500", transition: "color 0.2s" }}>{label}</span>
        <input type="checkbox" checked={checked} onChange={() => onChange(field, !checked)} style={{ display: "none" }} />
    </label>
);

// ==========================================
// COMPONENTE: MINI AGENDA (OUTLOOK STYLE)
// ==========================================
const MiniAgendaDia = ({ dataSelecionada, horarioSelecionado }) => {
    const horas = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

    // Calcula a posição do bloco azul
    let topPosition = -1;
    if (horarioSelecionado) {
        const [hora, minuto] = horarioSelecionado.split(":").map(Number);
        if (hora >= 7 && hora <= 20) {
            const indexHora = hora - 7;
            topPosition = (indexHora * 40) + (minuto / 60) * 40;
        }
    }

    const dataFormatada = dataSelecionada 
        ? new Date(dataSelecionada + "T00:00:00").toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' }) 
        : "Selecione uma data";

    return (
        <div style={{ 
            background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", 
            overflow: "hidden", display: "flex", flexDirection: "column", height: "100%",
            boxShadow: "0 4px 6px rgba(0,0,0,0.02)"
        }}>
            {/* Cabeçalho da Mini Agenda */}
            <div style={{ background: "#f8fafc", padding: "12px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#1e293b", fontWeight: "700", fontSize: "0.9rem" }}>
                    <CalendarDays size={18} color="#6C63FF" />
                    <span style={{ textTransform: "capitalize" }}>{dataFormatada}</span>
                </div>
            </div>

            {/* Régua de Horários */}
            <div style={{ flex: 1, overflowY: "auto", position: "relative", padding: "10px 0", background: "#fdfdfd" }}>
                {horas.map(hora => (
                    <div key={hora} style={{ display: "flex", height: "40px", borderBottom: "1px solid #f1f5f9" }}>
                        <div style={{ width: "45px", textAlign: "right", paddingRight: "10px", color: "#94a3b8", fontSize: "0.75rem", fontWeight: "500", marginTop: "-6px" }}>
                            {String(hora).padStart(2, '0')}:00
                        </div>
                        <div style={{ flex: 1, borderLeft: "1px solid #f1f5f9" }}></div>
                    </div>
                ))}

                {/* BLOCO DA CIRURGIA (Azul Outlook) */}
                {topPosition >= 0 && (
                    <div style={{
                        position: "absolute",
                        top: `${topPosition + 10}px`, // +10 do padding top
                        left: "45px", right: "10px",
                        height: "60px", // Estimando 1h30m de cirurgia padrão
                        background: "#0078d4", // Azul Microsoft/Outlook
                        borderLeft: "4px solid #005a9e",
                        borderRadius: "4px",
                        color: "white",
                        padding: "4px 8px",
                        fontSize: "0.75rem",
                        boxShadow: "0 2px 5px rgba(0, 120, 212, 0.3)",
                        zIndex: 10,
                        overflow: "hidden"
                    }}>
                        <strong style={{ display: "block" }}>{horarioSelecionado}</strong>
                        <span>Cirurgia Agendada</span>
                    </div>
                )}
            </div>
        </div>
    );
};

// ==========================================
// FORMULÁRIO PRINCIPAL (LADO ESQUERDO)
// ==========================================
function NovaCirurgiaForm({ onSave, dados }) {
    const { listaMedicos } = useMedicos();
    const { listaPacientes } = usePacientes(); 
    const [isUploading, setIsUploading] = useState(false); 

    const [form, setForm] = useState({
        paciente: "", medicoId: "", hospital: "", convenio: "", procedimento: "", 
        data: "", horario: "", anexo_url: null, novo_arquivo: null   
    });

    const [checklist, setChecklist] = useState({ jejum: false, exames: false, termo: false });

    useEffect(() => {
        if (dados) {
            let dataSeparada = "";
            let horaSeparada = "";
            if (dados.data_cirurgia) {
                const partes = dados.data_cirurgia.split(" ");
                dataSeparada = partes[0] || "";
                horaSeparada = partes[1] || "";
            }

            setForm({
                paciente: dados.paciente || "", medicoId: dados.medico_id || "", 
                hospital: dados.hospital || "", convenio: dados.convenio || "",
                procedimento: dados.procedimento || "", data: dataSeparada,
                horario: horaSeparada, anexo_url: dados.anexo_url || null, novo_arquivo: null
            });

            if (dados.checklist) setChecklist(dados.checklist);
        }
    }, [dados]);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSalvar = async () => {
        setIsUploading(true);
        try {
            let linkFinalDoAnexo = form.anexo_url;
            const { data: { user } } = await supabase.auth.getUser();

            if (form.novo_arquivo && user) {
                const extensao = form.novo_arquivo.name.split('.').pop();
                const caminhoDoArquivo = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${extensao}`;
                const { error: uploadError } = await supabase.storage.from('anexos_cirurgias').upload(caminhoDoArquivo, form.novo_arquivo);
                if (uploadError) throw uploadError;
                const { data: publicUrl } = supabase.storage.from('anexos_cirurgias').getPublicUrl(caminhoDoArquivo);
                linkFinalDoAnexo = publicUrl.publicUrl;
            }

            const dadosFormatados = {
                paciente: form.paciente, medico_id: form.medicoId ? Number(form.medicoId) : null,
                hospital: form.hospital, convenio: form.convenio, procedimento: form.procedimento, 
                data_cirurgia: (form.data && form.horario) ? `${form.data} ${form.horario}` : null,
                status: dados ? dados.status : "Pendente", anexo_url: linkFinalDoAnexo, checklist: checklist 
            };

            await onSave(dadosFormatados);
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("❌ Erro ao salvar arquivo.");
        } finally {
            setIsUploading(false);
        }
    };

    const labelStyle = { display: "block", fontSize: "0.75rem", fontWeight: "700", color: "#64748b", marginBottom: "6px", textTransform: "uppercase" };
    const inputStyle = { width: "100%", padding: "10px 12px 10px 35px", borderBottom: "1px solid #e2e8f0", borderTop: "none", borderLeft: "none", borderRight: "none", fontSize: "0.95rem", outline: "none", boxSizing: "border-box", color: "#1e293b", background: "transparent", transition: "0.2s" };
    const iconStyle = { position: "absolute", left: "5px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" };

    return (
        <form style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            
            {/* LADO ESQUERDO (Formulário Outlook Style) + LADO DIREITO (Mini Agenda) */}
            <div style={{ display: "flex", gap: "25px", flex: 1, minHeight: 0 }}>
                
                {/* COLUNA ESQUERDA: DADOS CLÍNICOS */}
                <div style={{ flex: 1.8, overflowY: "auto", paddingRight: "10px", display: "flex", flexDirection: "column", gap: "20px" }}>
                    
                    {/* Linha 1: Título e Identificação (Como no Outlook) */}
                    <div style={{ borderBottom: "2px solid #f1f5f9", paddingBottom: "15px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                            <div style={{ width: "40px", height: "40px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#0078d4" }}>
                                <User size={20} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <select name="paciente" value={form.paciente} onChange={handleChange} style={{ width: "100%", border: "none", fontSize: "1.2rem", fontWeight: "800", color: "#1e293b", outline: "none", background: "transparent", cursor: "pointer", appearance: "none" }}>
                                    <option value="" disabled>Selecione o paciente...</option>
                                    {listaPacientes.map(pac => <option key={pac.id} value={pac.nome}>{pac.nome} {pac.cpf ? `(CPF: ${pac.cpf})` : ""}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Localização e Médico */}
                        <div style={{ display: "flex", gap: "20px" }}>
                            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
                                <MapPin size={16} color="#94a3b8" />
                                <input type="text" name="hospital" placeholder="Hospital (Local)" value={form.hospital} onChange={handleChange} style={{ border: "none", outline: "none", fontSize: "0.9rem", width: "100%", color: "#475569" }} />
                            </div>
                            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
                                <FileText size={16} color="#94a3b8" />
                                <input type="text" name="convenio" placeholder="Convênio" value={form.convenio} onChange={handleChange} style={{ border: "none", outline: "none", fontSize: "0.9rem", width: "100%", color: "#475569" }} />
                            </div>
                        </div>
                    </div>

                    {/* Datas e Procedimento */}
                    <div style={{ display: "flex", gap: "20px" }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Procedimento</label>
                            <div style={{ position: "relative" }}>
                                <Syringe size={18} style={iconStyle} />
                                <input type="text" name="procedimento" placeholder="Nome da Cirurgia" value={form.procedimento} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = "#0078d4"} onBlur={(e) => e.target.style.borderColor = "#e2e8f0"} />
                            </div>
                        </div>
                        <div style={{ width: "180px" }}>
                            <label style={labelStyle}>Cirurgião</label>
                            <select name="medicoId" value={form.medicoId} onChange={(e) => setForm({...form, medicoId: e.target.value})} style={{ ...inputStyle, paddingLeft: "10px", appearance: "none", cursor: "pointer" }} onFocus={(e) => e.target.style.borderColor = "#0078d4"} onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}>
                                <option value="" disabled>Selecione...</option>
                                {listaMedicos.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "20px" }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Data Agendada</label>
                            <div style={{ position: "relative" }}>
                                <Calendar size={18} style={iconStyle} />
                                <input type="date" name="data" value={form.data} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = "#0078d4"} onBlur={(e) => e.target.style.borderColor = "#e2e8f0"} />
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Início (Hora)</label>
                            <div style={{ position: "relative" }}>
                                <Clock size={18} style={iconStyle} />
                                <input type="time" name="horario" value={form.horario} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = "#0078d4"} onBlur={(e) => e.target.style.borderColor = "#e2e8f0"} />
                            </div>
                        </div>
                    </div>

                    {/* Bloco de Notas / Checklist */}
                    <div style={{ background: "#fdfdfd", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "15px" }}>
                        <h4 style={{ margin: "0 0 10px 0", fontSize: "0.85rem", color: "#475569", display: "flex", alignItems: "center", gap: "6px" }}><CheckSquare size={16} /> Checklist de Preparo</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                            <CustomCheck label="Jejum Ok" field="jejum" checked={checklist.jejum} onChange={(f,v) => setChecklist({...checklist, [f]: v})} />
                            <CustomCheck label="Exames Ok" field="exames" checked={checklist.exames} onChange={(f,v) => setChecklist({...checklist, [f]: v})} />
                            <CustomCheck label="Termo Assinado" field="termo" checked={checklist.termo} onChange={(f,v) => setChecklist({...checklist, [f]: v})} />
                        </div>
                    </div>

                    {/* Anexos (Estilo Outlook) */}
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", color: "#475569", fontWeight: "600", fontSize: "0.85rem" }}>
                            <Paperclip size={16} /> Arquivos e Documentos
                        </div>
                        <div style={{
                            border: "1px dashed #cbd5e1", borderRadius: "8px", padding: "15px", textAlign: "center", background: "#f8fafc", position: "relative", cursor: "pointer", transition: "0.2s"
                        }} onMouseOver={(e) => e.currentTarget.style.background = "#eff6ff"} onMouseOut={(e) => e.currentTarget.style.background = "#f8fafc"}>
                            
                            {form.anexo_url && !form.novo_arquivo ? (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#0078d4", fontWeight: "600" }}><FileCheck size={20} /> Documento Salvo</div>
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        <button type="button" onClick={(e) => { e.preventDefault(); window.open(form.anexo_url, "_blank"); }} style={{ background: "white", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "6px", cursor: "pointer" }}><Eye size={16} color="#475569"/></button>
                                        <button type="button" onClick={(e) => { e.preventDefault(); setForm({ ...form, anexo_url: null }); }} style={{ background: "white", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "6px", cursor: "pointer" }}><Trash2 size={16} color="#ef4444"/></button>
                                    </div>
                                </div>
                            ) : form.novo_arquivo ? (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#10b981", fontWeight: "600" }}><FileCheck size={20} /> {form.novo_arquivo.name}</div>
                                    <button type="button" onClick={(e) => { e.preventDefault(); setForm({ ...form, novo_arquivo: null }); }} style={{ background: "white", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "6px", cursor: "pointer" }}><X size={16} color="#ef4444"/></button>
                                </div>
                            ) : (
                                <>
                                    <UploadCloud size={24} color="#94a3b8" style={{ marginBottom: "5px" }} />
                                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>Arraste um arquivo ou clique para anexar o PDF</p>
                                    <input type="file" id="file-upload" accept=".pdf,image/*" style={{ display: "none" }} onChange={(e) => { if (e.target.files && e.target.files[0]) { setForm({ ...form, novo_arquivo: e.target.files[0] }); } }} />
                                    <label htmlFor="file-upload" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", cursor: "pointer" }}></label>
                                </>
                            )}
                        </div>
                    </div>

                </div>

                {/* COLUNA DIREITA: MINI AGENDA */}
                <div style={{ flex: 1, minWidth: "220px", display: { xs: "none", md: "block" } }}>
                    <MiniAgendaDia dataSelecionada={form.data} horarioSelecionado={form.horario} />
                </div>
            </div>

            {/* BOTÃO SALVAR (Rodapé) */}
            <div style={{ paddingTop: "15px", marginTop: "15px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end" }}>
                <button
                    type="button" onClick={handleSalvar} disabled={isUploading}
                    style={{
                        background: isUploading ? "#94a3b8" : "#0078d4", // Azul Microsoft
                        color: "white", border: "none", borderRadius: "6px",
                        padding: "12px 30px", fontWeight: "700", fontSize: "0.95rem", cursor: isUploading ? "wait" : "pointer",
                        transition: "0.2s", display: "flex", alignItems: "center", gap: "8px"
                    }}
                >
                    {isUploading ? "Salvando..." : (dados ? "Atualizar Evento" : "Agendar Cirurgia")}
                </button>
            </div>
        </form>
    );
}

// ==========================================
// MODAL MASTER
// ==========================================
function CirurgiaModal({ isOpen, onClose, cirurgia, onSave }) {
    const [abaAtiva, setAbaAtiva] = useState("dados");
    const [historico, setHistorico] = useState([]);
    const [carregandoHistorico, setCarregandoHistorico] = useState(false);

    useEffect(() => {
        if (isOpen) setAbaAtiva("dados");
    }, [isOpen]);

    useEffect(() => {
        if (abaAtiva === "historico" && cirurgia?.id) buscarHistorico();
    }, [abaAtiva, cirurgia]);

    async function buscarHistorico() {
        setCarregandoHistorico(true);
        try {
            const { data, error } = await supabase.from('historico_cirurgias').select('*').eq('cirurgia_id', cirurgia.id).order('created_at', { ascending: false }); 
            if (error) throw error;
            setHistorico(data || []);
        } catch (error) {
            console.error("Erro ao buscar histórico:", error);
        } finally {
            setCarregandoHistorico(false);
        }
    }

    const handleSalvarComAuditoria = async (dadosDoFormulario) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const nomeUsuario = user?.user_metadata?.nome || user?.email || "Usuário do Sistema";

            let acaoRealizada = "Criou a cirurgia";
            if (cirurgia) {
                if (dadosDoFormulario.status !== cirurgia.status) {
                    acaoRealizada = `Alterou o status de '${cirurgia.status}' para '${dadosDoFormulario.status}'`;
                } else {
                    acaoRealizada = "Editou os dados / anexos da cirurgia";
                }
            }

            await onSave(dadosDoFormulario);

            if (cirurgia?.id) {
                await supabase.from('historico_cirurgias').insert([{
                    cirurgia_id: cirurgia.id, usuario_nome: nomeUsuario, acao: acaoRealizada
                }]);
            }
        } catch (error) {
            console.error("Erro no fluxo de salvamento:", error);
        }
    };

    const tabStyle = (ativa) => ({
        padding: "10px 20px", cursor: "pointer", fontWeight: "600", fontSize: "0.9rem", transition: "0.2s",
        borderBottom: ativa ? "3px solid #0078d4" : "3px solid transparent", color: ativa ? "#0078d4" : "#64748b",
    });

    return (
        // ⚠️ DICA IMPORTANTE: Se o seu <Modal> antigo tiver uma largura fixa pequena (ex: 500px), 
        // ele vai espremer a tela dividida. Tente garantir que o Modal abra com pelo menos 850px!
        <Modal isOpen={isOpen} onClose={onClose}>
            <div style={{ fontFamily: "'Segoe UI', 'Inter', sans-serif", display: "flex", flexDirection: "column", height: "100%", minHeight: "65vh" }}>
                
                {/* Título Estilo Reunião */}
                <h2 style={{ color: "#1e293b", marginTop: 0, marginBottom: "5px", fontSize: "1.3rem", fontWeight: "700" }}>
                    {cirurgia ? `Detalhes do Evento: ${cirurgia.paciente}` : "Novo Evento Cirúrgico"}
                </h2>

                {cirurgia && (
                    <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", marginBottom: "20px", marginTop: "10px" }}>
                        <div style={tabStyle(abaAtiva === "dados")} onClick={() => setAbaAtiva("dados")}>Geral</div>
                        <div style={tabStyle(abaAtiva === "historico")} onClick={() => setAbaAtiva("historico")}>Log de Alterações</div>
                    </div>
                )}

                <div style={{ display: abaAtiva === "dados" ? "flex" : "none", flex: 1, minHeight: 0 }}>
                    <NovaCirurgiaForm dados={cirurgia} onSave={handleSalvarComAuditoria} />
                </div>

                {/* Aba de Histórico Omitida por Brevidade (O mesmo código de antes se mantém aqui) */}
                <div style={{ display: abaAtiva === "historico" ? "block" : "none", height: "400px", overflowY: "auto", paddingRight: "10px" }}>
                    {/* ... (Código do histórico original mantido intacto) ... */}
                    {carregandoHistorico ? (
                        <p style={{ textAlign: "center", color: "#64748b" }}>Buscando registros...</p>
                    ) : historico.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "30px", background: "#f8fafc", borderRadius: "10px", border: "1px dashed #cbd5e1" }}>
                            <p style={{ margin: 0, color: "#475569", fontWeight: "500" }}>Nenhum histórico registrado ainda.</p>
                        </div>
                    ) : (
                        <div style={{ position: "relative", paddingLeft: "15px", paddingTop: "5px", paddingBottom: "5px" }}>
                            <div style={{ position: "absolute", left: "22px", top: "10px", bottom: "10px", width: "2px", background: "#e2e8f0", zIndex: 0 }}></div>
                            {historico.map((item, index) => {
                                const dataFormatada = new Date(item.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                                return (
                                    <div key={index} style={{ display: "flex", gap: "15px", marginBottom: "20px", position: "relative", zIndex: 1 }}>
                                        <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#0078d4", border: "4px solid #fff", marginTop: "4px", flexShrink: 0, boxShadow: "0 0 0 1px #e2e8f0" }}></div>
                                        <div style={{ flex: 1, background: "#f8fafc", padding: "12px 15px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                                                <span style={{ fontWeight: "700", color: "#1e293b", fontSize: "0.9rem" }}>{item.usuario_nome}</span>
                                                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{dataFormatada}</span>
                                            </div>
                                            <p style={{ margin: 0, color: "#475569", fontSize: "0.9rem" }}>{item.acao}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </Modal>
    );
}

export default CirurgiaModal;