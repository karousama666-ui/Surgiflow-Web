import { useState, useEffect } from "react";
import { supabase } from "../services/supabase.js";import { User, Building2, Save } from "lucide-react";

function Configuracoes() {
    const [loading, setLoading] = useState(false);
    
    // Estado para guardar os dados digitados
    const [form, setForm] = useState({
        nome: "",
        cargo: "",
        registro: "",
        email: "",
        telefone: "",
        organizacao: "",
        cnpj: ""
    });

    // 1. BUSCAR OS DADOS DO USUÁRIO ASSIM QUE A TELA ABRE
    useEffect(() => {
        async function carregarPerfil() {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
                setForm({
                    // O email é o único que vem da raiz do usuário
                    email: user.email || "",
                    
                    // O resto vem do "user_metadata" (cofre de informações extras)
                    nome: user.user_metadata?.nome || "",
                    cargo: user.user_metadata?.cargo || "",
                    registro: user.user_metadata?.registro || "",
                    telefone: user.user_metadata?.telefone || "",
                    organizacao: user.user_metadata?.organizacao || "",
                    cnpj: user.user_metadata?.cnpj || ""
                });
            }
        }
        carregarPerfil();
    }, []);

    // 2. ATUALIZAR O ESTADO ENQUANTO O USUÁRIO DIGITA
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 3. SALVAR TUDO NO SUPABASE
    const handleSalvar = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                data: { 
                    nome: form.nome,
                    cargo: form.cargo,
                    registro: form.registro,
                    telefone: form.telefone,
                    organizacao: form.organizacao,
                    cnpj: form.cnpj
                }
            });

            if (error) throw error;

            alert("✅ Configurações atualizadas com sucesso!\nRecarregue a página para ver o nome atualizado no topo.");
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("❌ Erro ao salvar configurações.");
        } finally {
            setLoading(false);
        }
    };

    // Estilos para manter o padrão elegante
    const inputStyle = {
        width: "100%", padding: "12px 14px", border: "1px solid #cbd5e1", 
        borderRadius: "8px", fontSize: "0.95rem", outline: "none", 
        color: "#334155", background: "#fff", boxSizing: "border-box",
        transition: "border 0.2s"
    };

    const labelStyle = {
        display: "block", fontSize: "0.8rem", fontWeight: "700", 
        color: "#475569", marginBottom: "8px", textTransform: "uppercase", 
        letterSpacing: "0.5px"
    };

    const cardStyle = {
        background: "#fff", borderRadius: "16px", padding: "30px", 
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", border: "1px solid #e2e8f0",
        marginBottom: "25px"
    };

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto", fontFamily: "'Inter', sans-serif" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <div>
                    <h1 style={{ color: "#0f172a", margin: "0 0 8px 0", fontSize: "1.8rem", fontWeight: "800" }}>
                        Configurações do Sistema
                    </h1>
                    <p style={{ color: "#64748b", margin: 0 }}>Gerencie seu perfil, parâmetros de qualidade e assinatura.</p>
                </div>
                
                <button 
                    onClick={handleSalvar}
                    disabled={loading}
                    style={{
                        display: "flex", alignItems: "center", gap: "8px",
                        background: loading ? "#94a3b8" : "#6C63FF", color: "#fff", 
                        border: "none", padding: "12px 24px", borderRadius: "10px", 
                        fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", 
                        fontSize: "0.95rem", transition: "0.2s"
                    }}
                >
                    <Save size={18} />
                    {loading ? "Salvando..." : "Salvar Alterações"}
                </button>
            </div>

            {/* CARD 1: PERFIL PROFISSIONAL */}
            <div style={cardStyle}>
                <h3 style={{ display: "flex", alignItems: "center", gap: "8px", color: "#0f172a", margin: "0 0 25px 0", fontSize: "1.1rem" }}>
                    <User size={20} color="#6C63FF" /> Perfil Profissional
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                    <div>
                        <label style={labelStyle}>Nome Completo</label>
                        <input name="nome" value={form.nome} onChange={handleChange} style={inputStyle} placeholder="Seu nome" />
                    </div>
                    <div>
                        <label style={labelStyle}>Cargo / Especialidade</label>
                        <input name="cargo" value={form.cargo} onChange={handleChange} style={inputStyle} placeholder="Ex: Biomédica" />
                    </div>
                    <div>
                        <label style={labelStyle}>Registro (Conselho)</label>
                        <input name="registro" value={form.registro} onChange={handleChange} style={inputStyle} placeholder="Ex: CRBM 12345" />
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
                    <div>
                        <label style={labelStyle}>E-mail de Acesso</label>
                        {/* E-mail fica desativado porque mudar e-mail exige confirmação de segurança no Supabase */}
                        <input value={form.email} disabled style={{ ...inputStyle, background: "#f1f5f9", cursor: "not-allowed", color: "#94a3b8" }} />
                    </div>
                    <div>
                        <label style={labelStyle}>Telefone / WhatsApp</label>
                        <input name="telefone" value={form.telefone} onChange={handleChange} style={inputStyle} placeholder="(11) 99999-9999" />
                    </div>
                </div>
            </div>

            {/* CARD 2: DADOS DA ORGANIZAÇÃO */}
            <div style={cardStyle}>
                <h3 style={{ display: "flex", alignItems: "center", gap: "8px", color: "#0f172a", margin: "0 0 25px 0", fontSize: "1.1rem" }}>
                    <Building2 size={20} color="#10b981" /> Dados da Organização
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
                    <div>
                        <label style={labelStyle}>Nome da Organização / Marca</label>
                        <input name="organizacao" value={form.organizacao} onChange={handleChange} style={inputStyle} placeholder="Nome da clínica ou consultoria" />
                    </div>
                    <div>
                        <label style={labelStyle}>CNPJ</label>
                        <input name="cnpj" value={form.cnpj} onChange={handleChange} style={inputStyle} placeholder="00.000.000/0001-00" />
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Configuracoes;