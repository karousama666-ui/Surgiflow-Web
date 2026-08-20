import { useState, useEffect } from "react";
import { useMedicos } from "../../context/MedicosContext";
import { User, Hospital, FileText, Calendar, Clock, UploadCloud, FileCheck, X } from "lucide-react";

function NovaCirurgiaForm({ onSave, dados }) {
    const { listaMedicos } = useMedicos();

    const [form, setForm] = useState({
        paciente: "",
        medicoId: "",
        hospital: "",
        convenio: "",
        data: "",
        horario: "",
        anexo: null
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
                anexo: null
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

            {/* Anexo de Documentos Moderno (A MÁGICA ACONTECE AQUI ✨) */}
            <div>
                <label style={labelStyle}>Anexo de Documentos / Pedido</label>
                <div style={{
                    position: "relative", 
                    border: form.anexo ? "1.5px solid #10b981" : "1.5px dashed #cbd5e1", 
                    borderRadius: "12px", 
                    padding: form.anexo ? "15px" : "20px", // Dá uma encolhidinha elegante quando preenche
                    textAlign: "center", 
                    background: form.anexo ? "#ecfdf5" : "#f8fafc", 
                    transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => { 
                    if(!form.anexo) {
                        e.currentTarget.style.borderColor = "#6C63FF"; 
                        e.currentTarget.style.background = "#eff6ff"; 
                    }
                }}
                onMouseOut={(e) => { 
                    if(!form.anexo) {
                        e.currentTarget.style.borderColor = "#cbd5e1"; 
                        e.currentTarget.style.background = "#f8fafc"; 
                    }
                }}
                >
                    {!form.anexo ? (
                        // ESTADO 1: CAIXA VAZIA
                        <>
                            <UploadCloud size={24} color="#6C63FF" style={{ marginBottom: "8px" }} />
                            <p style={{ margin: "0", fontSize: "0.9rem", color: "#475569", fontWeight: "500" }}>
                                Clique para selecionar o PDF/Imagem
                            </p>
                            <input 
                                type="file" 
                                id="file-upload" 
                                accept=".pdf,image/*" // Trava para só aceitar PDF ou imagens
                                style={{ display: "none" }} 
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setForm({ ...form, anexo: e.target.files[0] });
                                    }
                                }}
                            />
                            {/* Label cobre a caixa toda só quando está vazia */}
                            <label htmlFor="file-upload" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", cursor: "pointer" }}></label>
                        </>
                    ) : (
                        // ESTADO 2: ARQUIVO SELECIONADO
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 10 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
                                <FileCheck size={24} color="#10b981" />
                                <span style={{ fontSize: "0.95rem", color: "#065f46", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "250px" }}>
                                    {form.anexo.name}
                                </span>
                            </div>
                            
                            {/* Botão de Remover Arquivo */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setForm({ ...form, anexo: null }); // Limpa a memória do arquivo
                                }}
                                style={{
                                    background: "white", border: "1px solid #fca5a5", cursor: "pointer", color: "#ef4444",
                                    display: "flex", alignItems: "center", justifyContent: "center", padding: "6px", borderRadius: "50%",
                                    transition: "0.2s"
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = "#fee2e2"}
                                onMouseOut={(e) => e.currentTarget.style.background = "white"}
                                title="Remover anexo"
                            >
                                <X size={16} strokeWidth={3} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Botão Salvar */}
            <button
                type="button"
                onClick={() => {
                    const dadosFormatadosParaSupabase = {
                        paciente: form.paciente,
                        medico_id: form.medicoId ? Number(form.medicoId) : null, 
                        hospital: form.hospital,
                        convenio: form.convenio,
                        data_cirurgia: (form.data && form.horario) ? `${form.data} ${form.horario}` : null,
                        status: dados ? dados.status : "Pendente" 
                    };

                    onSave(dadosFormatadosParaSupabase);
                    setForm({ paciente: "", medicoId: "", hospital: "", convenio: "", data: "", horario: "", anexo: null });
                }}
                style={{
                    background: "#6C63FF", color: "white", border: "none", borderRadius: "10px",
                    padding: "14px", fontWeight: "700", fontSize: "1rem", cursor: "pointer",
                    marginTop: "10px", transition: "0.2s", boxShadow: "0 4px 14px rgba(108, 99, 255, 0.4)", fontFamily: "inherit"
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
                {dados ? "Salvar Alterações" : "Cadastrar Cirurgia"}
            </button>
        </form>
    );
}

export default NovaCirurgiaForm;