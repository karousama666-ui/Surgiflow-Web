import { useState, useEffect } from "react";
import { useMedicos } from "../../context/MedicosContext";
import { supabase } from "../../services/supabase"; 
import { User, Hospital, FileText, Calendar, Clock, UploadCloud, FileCheck, X, Eye, Trash2 } from "lucide-react"; 

function NovaCirurgiaForm({ onSave, dados }) {
    const { listaMedicos } = useMedicos();
    const [isUploading, setIsUploading] = useState(false); 

    const [form, setForm] = useState({
        paciente: "",
        medicoId: "",
        hospital: "",
        convenio: "",
        data: "",
        horario: "",
        anexo_url: null,     
        novo_arquivo: null   
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
                data: dataSeparada,
                horario: horaSeparada,
                anexo_url: dados.anexo_url || null, 
                novo_arquivo: null
            });
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

    // 👇 A MÁGICA: Agora salva dentro da subpasta do usuário logado!
    const handleSalvar = async () => {
        setIsUploading(true);
        try {
            let linkFinalDoAnexo = form.anexo_url;

            // 1. DESCOBRE QUEM ESTÁ LOGADO AGORA
            const { data: { user } } = await supabase.auth.getUser();

            // Se o usuário selecionou um arquivo NOVO e está logado, fazemos o upload
            if (form.novo_arquivo && user) {
                const extensao = form.novo_arquivo.name.split('.').pop();
                
                // 2. CRIA O CAMINHO BLINDADO: "ID_DO_USUARIO/nome_do_arquivo.pdf"
                const caminhoDoArquivo = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${extensao}`;
                
                const { error: uploadError } = await supabase.storage
                    .from('anexos_cirurgias')
                    .upload(caminhoDoArquivo, form.novo_arquivo);

                if (uploadError) throw uploadError;

                // Pega o link público do arquivo usando o novo caminho
                const { data: publicUrl } = supabase.storage
                    .from('anexos_cirurgias')
                    .getPublicUrl(caminhoDoArquivo);
                
                linkFinalDoAnexo = publicUrl.publicUrl;
            }

            // Monta os dados para o banco
            const dadosFormatadosParaSupabase = {
                paciente: form.paciente,
                medico_id: form.medicoId ? Number(form.medicoId) : null,
                hospital: form.hospital,
                convenio: form.convenio,
                data_cirurgia: (form.data && form.horario) ? `${form.data} ${form.horario}` : null,
                status: dados ? dados.status : "Pendente",
                anexo_url: linkFinalDoAnexo 
            };

            await onSave(dadosFormatadosParaSupabase);

            // Limpa o formulário após salvar cirurgia nova
            if (!dados) {
                setForm({ paciente: "", medicoId: "", hospital: "", convenio: "", data: "", horario: "", anexo_url: null, novo_arquivo: null });
            }
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("❌ Erro ao salvar arquivo. O bucket 'anexos_cirurgias' existe no Supabase e permite uploads?");
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
            
            {/* Paciente */}
            <div>
                <label style={labelStyle}>Paciente</label>
                <div style={{ position: "relative" }}>
                    <User size={18} color="#94a3b8" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                    <input type="text" name="paciente" placeholder="Nome completo do paciente" value={form.paciente} onChange={handleChange}
                        style={inputPremiumStyle}
                        onFocus={(e) => e.target.style.border = "1px solid #6C63FF"}
                        onBlur={(e) => e.target.style.border = "1px solid #e2e8f0"}
                    />
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

            {/* Anexo de Documentos Moderno (COM PERSISTÊNCIA) */}
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

                    {/* ESTADO 2: Acabou de selecionar um arquivo (Cirurgia Nova ou Atualização) */}
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

export default NovaCirurgiaForm;