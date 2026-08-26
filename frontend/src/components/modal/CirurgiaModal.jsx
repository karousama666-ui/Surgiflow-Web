import { useState, useEffect } from "react";
import Modal from "./Modal";
import { useMedicos } from "../../context/MedicosContext";
import { usePacientes } from "../../context/PacientesContext"; 
import { supabase } from "../../services/supabase"; 
import { User, Hospital, FileText, Calendar, Clock, UploadCloud, FileCheck, X, Eye, Trash2, CheckSquare, Syringe, FileEdit } from "lucide-react"; // 👈 Importamos Syringe para o ícone de procedimento

// 👇 COMPONENTE NOVO: Visual Premium para os checkboxes do checklist
const CustomCheck = ({ label, field, checked, onChange }) => (
    <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", userSelect: "none" }}>
        <div style={{
            width: "20px", height: "20px", borderRadius: "6px",
            background: checked ? "#10b981" : "#ffffff",
            border: checked ? "1px solid #10b981" : "1px solid #cbd5e1",
            display: "flex", justifyContent: "center", alignItems: "center",
            transition: "all 0.2s ease"
        }}>
            {checked && <FileCheck size={14} color="white" strokeWidth={3} />}
        </div>
        <span style={{ color: checked ? "#065f46" : "#475569", fontSize: "0.9rem", fontWeight: checked ? "600" : "500", transition: "color 0.2s" }}>{label}</span>
        <input type="checkbox" checked={checked} onChange={() => onChange(field, !checked)} style={{ display: "none" }} />
    </label>
);

function NovaCirurgiaForm({ onSave, dados }) {
    const { listaMedicos } = useMedicos();
    const { listaPacientes } = usePacientes(); 
    const [isUploading, setIsUploading] = useState(false); 

    const [form, setForm] = useState({
        paciente: "",
        medicoId: "",
        hospital: "",
        convenio: "",
        procedimento: "", // 👈 NOVO: Estado do procedimento
        data: "",
        horario: "",
        anexo_url: null,     
        novo_arquivo: null   
    });

    const [checklist, setChecklist] = useState({
        jejum: false, exames: false, termo: false
    });

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
                paciente: dados.paciente || "",
                medicoId: dados.medico_id || "", 
                hospital: dados.hospital || "",
                convenio: dados.convenio || "",
                procedimento: dados.procedimento || "", // 👈 NOVO: Puxa o procedimento ao editar
                data: dataSeparada,
                horario: horaSeparada,
                anexo_url: dados.anexo_url || null, 
                novo_arquivo: null
            });

            if (dados.checklist) {
                setChecklist(dados.checklist);
            }
        }
    }, [dados]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    }

    function handleMedicoChange(e) {
        setForm({
            ...form,
            medicoId: e.target.value
        });
    }

    function handleChecklistChange(field, value) {
        setChecklist({ ...checklist, [field]: value });
    }

    const handleSalvar = async () => {
        setIsUploading(true);
        try {
            let linkFinalDoAnexo = form.anexo_url;

            const { data: { user } } = await supabase.auth.getUser();

            if (form.novo_arquivo && user) {
                const extensao = form.novo_arquivo.name.split('.').pop();
                const caminhoDoArquivo = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${extensao}`;
                
                const { error: uploadError } = await supabase.storage
                    .from('anexos_cirurgias')
                    .upload(caminhoDoArquivo, form.novo_arquivo);

                if (uploadError) throw uploadError;

                const { data: publicUrl } = supabase.storage
                    .from('anexos_cirurgias')
                    .getPublicUrl(caminhoDoArquivo);
                
                linkFinalDoAnexo = publicUrl.publicUrl;
            }

            const dadosFormatadosParaSupabase = {
                paciente: form.paciente, 
                medico_id: form.medicoId ? Number(form.medicoId) : null,
                hospital: form.hospital,
                convenio: form.convenio,
                procedimento: form.procedimento, // 👈 NOVO: Envia para o Supabase
                data_cirurgia: (form.data && form.horario) ? `${form.data} ${form.horario}` : null,
                status: dados ? dados.status : "Pendente",
                anexo_url: linkFinalDoAnexo,
                checklist: checklist 
            };

            await onSave(dadosFormatadosParaSupabase);

            if (!dados) {
                setForm({ paciente: "", medicoId: "", hospital: "", convenio: "", procedimento: "", data: "", horario: "", anexo_url: null, novo_arquivo: null });
                setChecklist({ jejum: false, exames: false, termo: false }); 
            }
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("❌ Erro ao salvar arquivo.");
        } finally {
            setIsUploading(false);
        }
    };

    const labelStyle = { 
        display: "block", fontSize: "0.85rem", fontWeight: "600", 
        color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" 
    };

    const inputPremiumStyle = {
        width: "100%", padding: "12px 14px 12px 42px", borderRadius: "10px",
        border: "1px solid #e2e8f0", fontSize: "0.95rem", outline: "none",
        boxSizing: "border-box", color: "#334155", background: "#f8fafc", fontFamily: "inherit",
        transition: "border 0.2s"
    };

    return (
        <form style={{ display: "flex", flexDirection: "column", gap: "20px", fontFamily: "'Inter', system-ui, sans-serif" }}>
            
            {/* Campo Inteligente de Paciente */}
            <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <label style={labelStyle}>Paciente</label>
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Não encontrou? Cadastre no menu Fichas.</span>
                </div>
                <div style={{ position: "relative" }}>
                    <User size={18} color="#94a3b8" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", zIndex: 2 }} />
                    <select 
                        name="paciente" 
                        value={form.paciente} 
                        onChange={handleChange}
                        style={{ ...inputPremiumStyle, cursor: "pointer", appearance: "none", position: "relative" }}
                        onFocus={(e) => e.target.style.border = "1px solid #6C63FF"}
                        onBlur={(e) => e.target.style.border = "1px solid #e2e8f0"}
                    >
                        <option value="" disabled>Selecione o paciente cadastrado...</option>
                        {listaPacientes.map(pac => (
                            <option key={pac.id} value={pac.nome}>
                                {pac.nome} {pac.cpf ? `(CPF: ${pac.cpf})` : ""}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Médico Responsável */}
            <div>
                <label style={labelStyle}>Médico Responsável</label>
                <div style={{ position: "relative" }}>
                    <select name="medicoId" value={form.medicoId} onChange={handleMedicoChange}
                        style={{ ...inputPremiumStyle, padding: "12px 14px", cursor: "pointer", appearance: "none" }}
                        onFocus={(e) => e.target.style.border = "1px solid #6C63FF"}
                        onBlur={(e) => e.target.style.border = "1px solid #e2e8f0"}
                    >
                        <option value="" disabled>Selecione um médico</option>
                        {listaMedicos.map(medico => (
                            <option key={medico.id} value={medico.id}>
                                {medico.nome}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Hospital e Convênio */}
            <div style={{ display: "flex", gap: "15px" }}>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Hospital</label>
                    <div style={{ position: "relative" }}>
                        <Hospital size={18} color="#94a3b8" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                        <input type="text" name="hospital" placeholder="Ex: Sírio Libanês" value={form.hospital} onChange={handleChange}
                            style={inputPremiumStyle}
                            onFocus={(e) => e.target.style.border = "1px solid #6C63FF"}
                            onBlur={(e) => e.target.style.border = "1px solid #e2e8f0"}
                        />
                    </div>
                </div>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Convênio</label>
                    <div style={{ position: "relative" }}>
                        <FileText size={18} color="#94a3b8" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                        <input type="text" name="convenio" placeholder="Ex: Bradesco" value={form.convenio} onChange={handleChange}
                            style={inputPremiumStyle}
                            onFocus={(e) => e.target.style.border = "1px solid #6C63FF"}
                            onBlur={(e) => e.target.style.border = "1px solid #e2e8f0"}
                        />
                    </div>
                </div>
            </div>

            {/* 👇 NOVO: CAMPO DE PROCEDIMENTO 👇 */}
            <div>
                <label style={labelStyle}>Procedimento Cirúrgico</label>
                <div style={{ position: "relative" }}>
                    <Syringe size={18} color="#94a3b8" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                    <input type="text" name="procedimento" placeholder="Ex: Artroplastia Total do Joelho" value={form.procedimento} onChange={handleChange}
                        style={inputPremiumStyle}
                        onFocus={(e) => e.target.style.border = "1px solid #6C63FF"}
                        onBlur={(e) => e.target.style.border = "1px solid #e2e8f0"}
                    />
                </div>
            </div>

            {/* Data e Hora */}
            <div style={{ display: "flex", gap: "15px" }}>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Data da Cirurgia</label>
                    <div style={{ position: "relative" }}>
                        <Calendar size={18} color="#94a3b8" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                        <input type="date" name="data" value={form.data} onChange={handleChange}
                            style={inputPremiumStyle}
                            onFocus={(e) => e.target.style.border = "1px solid #6C63FF"}
                            onBlur={(e) => e.target.style.border = "1px solid #e2e8f0"}
                        />
                    </div>
                </div>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Horário</label>
                    <div style={{ position: "relative" }}>
                        <Clock size={18} color="#94a3b8" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                        <input type="time" name="horario" value={form.horario} onChange={handleChange}
                            style={inputPremiumStyle}
                            onFocus={(e) => e.target.style.border = "1px solid #6C63FF"}
                            onBlur={(e) => e.target.style.border = "1px solid #e2e8f0"}
                        />
                    </div>
                </div>
            </div>

            {/* ESCUDO ANTI-CANCELAMENTO */}
            <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", background: "#f8fafc" }}>
                <h3 style={{ fontSize: "1rem", color: "#0f172a", margin: "0 0 15px 0", display: "flex", alignItems: "center", gap: "8px", fontWeight: "700" }}>
                    <CheckSquare size={18} color="#10b981" /> Checklist de Validação
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", background: "#fff", padding: "15px", borderRadius: "10px", border: "1px solid #cbd5e1" }}>
                    <CustomCheck label="Jejum confirmado com paciente" field="jejum" checked={checklist.jejum} onChange={handleChecklistChange} />
                    <CustomCheck label="Exames Pré-Operatórios recebidos" field="exames" checked={checklist.exames} onChange={handleChecklistChange} />
                    <CustomCheck label="Termo de Consentimento Assinado" field="termo" checked={checklist.termo} onChange={handleChecklistChange} />
                </div>
            </div>

            {/* Anexo de Documentos Moderno */}
            <div>
                <label style={labelStyle}>Anexo de Documentos / Pedido</label>
                <div style={{
                    position: "relative", 
                    border: (form.novo_arquivo || form.anexo_url) ? "1.5px solid #10b981" : "1.5px dashed #cbd5e1", 
                    borderRadius: "12px", 
                    padding: (form.novo_arquivo || form.anexo_url) ? "15px" : "20px", 
                    textAlign: "center", 
                    background: (form.novo_arquivo || form.anexo_url) ? "#ecfdf5" : "#f8fafc", 
                    transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => { 
                    if(!form.novo_arquivo && !form.anexo_url) {
                        e.currentTarget.style.borderColor = "#6C63FF"; 
                        e.currentTarget.style.background = "#eff6ff"; 
                    }
                }}
                onMouseOut={(e) => { 
                    if(!form.novo_arquivo && !form.anexo_url) {
                        e.currentTarget.style.borderColor = "#cbd5e1"; 
                        e.currentTarget.style.background = "#f8fafc"; 
                    }
                }}
                >
                    {/* ESTADO 1: Tem arquivo salvo no banco (Cirurgia Antiga) */}
                    {form.anexo_url && !form.novo_arquivo && (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 10 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <FileCheck size={24} color="#10b981" />
                                <span style={{ fontSize: "0.95rem", color: "#065f46", fontWeight: "600" }}>Documento Salvo</span>
                            </div>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <button type="button" onClick={() => window.open(form.anexo_url, "_blank")} title="Visualizar" style={{ background: "white", border: "1px solid #10b981", color: "#10b981", display: "flex", padding: "8px", borderRadius: "8px", cursor: "pointer", transition: "0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = "#dcfce7"} onMouseOut={(e) => e.currentTarget.style.background = "white"}>
                                    <Eye size={16} />
                                </button>
                                <button type="button" onClick={() => setForm({ ...form, anexo_url: null })} title="Remover" style={{ background: "white", border: "1px solid #fca5a5", color: "#ef4444", display: "flex", padding: "8px", borderRadius: "8px", cursor: "pointer", transition: "0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = "#fee2e2"} onMouseOut={(e) => e.currentTarget.style.background = "white"}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ESTADO 2: Acabou de selecionar um arquivo */}
                    {form.novo_arquivo && (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 10 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
                                <FileCheck size={24} color="#10b981" />
                                <span style={{ fontSize: "0.95rem", color: "#065f46", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "250px" }}>
                                    {form.novo_arquivo.name}
                                </span>
                            </div>
                            
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setForm({ ...form, novo_arquivo: null }); 
                                }}
                                style={{ background: "white", border: "1px solid #fca5a5", cursor: "pointer", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", padding: "6px", borderRadius: "50%", transition: "0.2s" }}
                                onMouseOver={(e) => e.currentTarget.style.background = "#fee2e2"}
                                onMouseOut={(e) => e.currentTarget.style.background = "white"}
                            >
                                <X size={16} strokeWidth={3} />
                            </button>
                        </div>
                    )}

                    {/* ESTADO 3: Caixa Vazia esperando clique */}
                    {!form.anexo_url && !form.novo_arquivo && (
                        <>
                            <UploadCloud size={24} color="#6C63FF" style={{ marginBottom: "8px" }} />
                            <p style={{ margin: "0", fontSize: "0.9rem", color: "#475569", fontWeight: "500" }}>
                                Clique para selecionar o PDF/Imagem
                            </p>
                            <input 
                                type="file" 
                                id="file-upload" 
                                accept=".pdf,image/*" 
                                style={{ display: "none" }} 
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setForm({ ...form, novo_arquivo: e.target.files[0] });
                                    }
                                }}
                            />
                            <label htmlFor="file-upload" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", cursor: "pointer" }}></label>
                        </>
                    )}
                </div>
            </div>

            {/* Botão Salvar conectado ao Loader */}
            <button
                type="button"
                onClick={handleSalvar}
                disabled={isUploading}
                style={{
                    background: isUploading ? "#94a3b8" : "#6C63FF", color: "white", border: "none", borderRadius: "10px",
                    padding: "14px", fontWeight: "700", fontSize: "1rem", cursor: isUploading ? "wait" : "pointer",
                    marginTop: "10px", transition: "0.2s", boxShadow: isUploading ? "none" : "0 4px 14px rgba(108, 99, 255, 0.4)", fontFamily: "inherit"
                }}
                onMouseOver={(e) => { if (!isUploading) e.currentTarget.style.transform = "translateY(-2px)" }}
                onMouseOut={(e) => { if (!isUploading) e.currentTarget.style.transform = "translateY(0)" }}
            >
                {isUploading ? "Salvando Anexo..." : (dados ? "Salvar Alterações" : "Cadastrar Cirurgia")}
            </button>
        </form>
    );
}

function CirurgiaModal({ isOpen, onClose, cirurgia, onSave }) {
    // Estado para controlar qual aba está aberta
    const [abaAtiva, setAbaAtiva] = useState("dados"); // "dados" ou "historico"
    const [historico, setHistorico] = useState([]);
    const [carregandoHistorico, setCarregandoHistorico] = useState(false);

    // Reseta a aba para "dados" sempre que o modal fechar ou abrir
    useEffect(() => {
        if (isOpen) {
            setAbaAtiva("dados");
        }
    }, [isOpen]);

    // Busca o histórico no Supabase quando o usuário clica na aba "Histórico"
    useEffect(() => {
        if (abaAtiva === "historico" && cirurgia?.id) {
            buscarHistorico();
        }
    }, [abaAtiva, cirurgia]);

    async function buscarHistorico() {
        setCarregandoHistorico(true);
        try {
            const { data, error } = await supabase
                .from('historico_cirurgias')
                .select('*')
                .eq('cirurgia_id', cirurgia.id)
                .order('created_at', { ascending: false }); 

            if (error) throw error;
            setHistorico(data || []);
        } catch (error) {
            console.error("Erro ao buscar histórico:", error);
        } finally {
            setCarregandoHistorico(false);
        }
    }

    // Função "Interceptadora" de Salvamento (Gera o rastro na auditoria)
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
                    cirurgia_id: cirurgia.id,
                    usuario_nome: nomeUsuario,
                    acao: acaoRealizada
                }]);
            }

        } catch (error) {
            console.error("Erro no fluxo de salvamento:", error);
        }
    };

    const tabStyle = (ativa) => ({
        flex: 1, padding: "12px", textAlign: "center", cursor: "pointer",
        fontWeight: "600", fontSize: "0.95rem", transition: "0.2s",
        borderBottom: ativa ? "2px solid #6C63FF" : "2px solid transparent",
        color: ativa ? "#6C63FF" : "#64748b",
        display: "flex", justifyContent: "center", alignItems: "center", gap: "8px"
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                
                <h2 style={{ color: "#1e293b", marginTop: 0, marginBottom: "15px" }}>
                    {cirurgia ? "Gerenciar Cirurgia" : "Nova Cirurgia"}
                </h2>

                {cirurgia && (
                    <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", marginBottom: "20px" }}>
                        <div style={tabStyle(abaAtiva === "dados")} onClick={() => setAbaAtiva("dados")}>
                            <FileEdit size={18} /> Dados da Cirurgia
                        </div>
                        <div style={tabStyle(abaAtiva === "historico")} onClick={() => setAbaAtiva("historico")}>
                            <Clock size={18} /> Log de Alterações
                        </div>
                    </div>
                )}

                <div style={{ display: abaAtiva === "dados" ? "block" : "none" }}>
                    <NovaCirurgiaForm
                        dados={cirurgia}
                        onSave={handleSalvarComAuditoria} 
                    />
                </div>

                <div style={{ 
                    display: abaAtiva === "historico" ? "block" : "none", 
                    height: "400px", 
                    overflowY: "auto", 
                    paddingRight: "10px" 
                }}>
                    {carregandoHistorico ? (
                        <p style={{ textAlign: "center", color: "#64748b" }}>Buscando registros...</p>
                    ) : historico.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "30px", background: "#f8fafc", borderRadius: "10px", border: "1px dashed #cbd5e1" }}>
                            <Clock size={32} color="#94a3b8" style={{ marginBottom: "10px" }} />
                            <p style={{ margin: 0, color: "#475569", fontWeight: "500" }}>Nenhum histórico registrado ainda.</p>
                            <p style={{ margin: "5px 0 0 0", fontSize: "0.85rem", color: "#94a3b8" }}>As próximas alterações aparecerão aqui.</p>
                        </div>
                    ) : (
                        <div style={{ position: "relative", paddingLeft: "15px", paddingTop: "5px", paddingBottom: "5px" }}>
                            <div style={{ position: "absolute", left: "22px", top: "10px", bottom: "10px", width: "2px", background: "#e2e8f0", zIndex: 0 }}></div>

                            {historico.map((item, index) => {
                                const dataFormatada = new Date(item.created_at).toLocaleString('pt-BR', { 
                                    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                                });

                                return (
                                    <div key={index} style={{ display: "flex", gap: "15px", marginBottom: "20px", position: "relative", zIndex: 1 }}>
                                        <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#6C63FF", border: "4px solid #fff", marginTop: "4px", flexShrink: 0, boxShadow: "0 0 0 1px #e2e8f0" }}></div>
                                        
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