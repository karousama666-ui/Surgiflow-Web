import { useState, useEffect } from "react";
import { X, User, Stethoscope, Phone, Mail, FileText } from "lucide-react";

function MedicoModal({ isOpen, onClose, onSave, medico }) {
    const estadoInicial = {
        nome: "",
        crm: "",
        especialidade: "",
        telefone: "",
        email: ""
    };

    const [form, setForm] = useState(estadoInicial);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (medico) {
            setForm(medico);
        } else {
            setForm(estadoInicial);
        }
    }, [medico, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        let { name, value } = e.target;

        // Máscara de Telefone (WhatsApp)
        if (name === "telefone") {
            value = value.replace(/\D/g, "");
            if (value.length > 11) value = value.slice(0, 11);
            value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
            value = value.replace(/(\d)(\d{4})$/, "$1-$2");
        }

        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onSave(form);
        setLoading(false);
    };

    // Estilo unificado para os inputs
    const inputStyle = {
        width: "100%", padding: "12px 12px 12px 40px", borderRadius: "10px", 
        border: "1px solid #cbd5e1", fontSize: "0.95rem", outline: "none", 
        boxSizing: "border-box", background: "#f8fafc", color: "#1e293b", fontFamily: "inherit"
    };

    const iconStyle = { position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" };

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)",
            display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999
        }}>
            <div style={{
                background: "#fff", width: "100%", maxWidth: "550px", borderRadius: "20px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", overflow: "hidden", display: "flex", flexDirection: "column"
            }}>
                <div style={{
                    padding: "20px 25px", borderBottom: "1px solid #e2e8f0", 
                    display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc"
                }}>
                    <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#1e293b", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
                        <Stethoscope size={22} color="#6C63FF" />
                        {medico ? "Editar Ficha do Médico" : "Novo Médico"}
                    </h2>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: "5px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", transition: "0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = "#e2e8f0"} onMouseOut={(e) => e.currentTarget.style.background = "none"}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: "25px", display: "flex", flexDirection: "column", gap: "16px" }}>
                    
                    <div style={{ position: "relative" }}>
                        <User size={18} style={iconStyle} />
                        <input type="text" name="nome" placeholder="Nome completo (Ex: Dr. João Silva)" value={form.nome} onChange={handleChange} required style={inputStyle} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div style={{ position: "relative" }}>
                            <FileText size={18} style={iconStyle} />
                            <input type="text" name="crm" placeholder="CRM / UF" value={form.crm} onChange={handleChange} required style={inputStyle} />
                        </div>
                        <div style={{ position: "relative" }}>
                            <Stethoscope size={18} style={iconStyle} />
                            <input type="text" name="especialidade" placeholder="Especialidade" value={form.especialidade} onChange={handleChange} style={inputStyle} />
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div style={{ position: "relative" }}>
                            <Phone size={18} style={iconStyle} />
                            <input type="text" name="telefone" placeholder="WhatsApp / Telefone" value={form.telefone} onChange={handleChange} required style={inputStyle} />
                        </div>
                        <div style={{ position: "relative" }}>
                            <Mail size={18} style={iconStyle} />
                            <input type="email" name="email" placeholder="E-mail de Contato" value={form.email} onChange={handleChange} style={inputStyle} />
                        </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "10px" }}>
                        <button type="button" onClick={onClose} style={{ padding: "12px 20px", borderRadius: "10px", border: "1px solid #cbd5e1", background: "#fff", color: "#475569", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} style={{ padding: "12px 24px", borderRadius: "10px", border: "none", background: "#6C63FF", color: "#fff", fontWeight: "700", cursor: loading ? "wait" : "pointer", display: "flex", alignItems: "center", gap: "8px", fontFamily: "inherit", boxShadow: "0 4px 12px rgba(108, 99, 255, 0.3)" }}>
                            {loading ? "Salvando..." : "Salvar Ficha"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default MedicoModal;