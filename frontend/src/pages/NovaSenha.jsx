import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { supabase } from "../services/supabase.js"; 
import logoSurgiFlow from "../assets/logo_surgiflowdark.png"; 

function NovaSenha() {
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAtualizarSenha = async (e) => {
        e.preventDefault();
        
        if (senha.length < 6) {
            alert("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        setLoading(true);
        try {
            // Como o link do e-mail já te "logou" invisivelmente, 
            // basta pedir pro Supabase atualizar a senha do usuário atual!
            const { error } = await supabase.auth.updateUser({
                password: senha
            });

            if (error) throw error;

            alert("✅ Senha atualizada com sucesso!");
            navigate("/dashboard"); // Joga pro painel de controle
            
        } catch (error) {
            console.error("Erro ao atualizar senha:", error);
            alert("Erro ao atualizar senha. O link pode ter expirado. Tente pedir a recuperação novamente.");
        } finally {
            setLoading(false);
        }
    };

    const inputPremiumStyle = { 
        width: "100%", padding: "16px 45px 16px 45px", borderRadius: "12px", 
        border: "1px solid #cbd5e1", fontSize: "1rem", outline: "none", boxSizing: "border-box", 
        background: "#f8fafc", color: "#1e293b", fontFamily: "inherit", transition: "border 0.2s"
    };

    return (
        <div style={{ 
            display: "flex", width: "100vw", height: "100vh", justifyContent: "center", alignItems: "center",
            background: "#f8fafc", fontFamily: "'Montserrat', 'Inter', sans-serif"
        }}>
            <div style={{ 
                width: "100%", maxWidth: "450px", background: "#ffffff", padding: "50px 40px", 
                borderRadius: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.08)", textAlign: "center",
                border: "1px solid #e2e8f0"
            }}>
                <img src={logoSurgiFlow} alt="SurgiFlow Logo" style={{ height: "60px", marginBottom: "20px", objectFit: "contain" }} onError={(e) => { e.target.style.display = 'none' }} />
                
                <h2 style={{ color: "#1e293b", margin: "0 0 10px 0", fontSize: "1.6rem", fontWeight: "800" }}>Criar Nova Senha</h2>
                <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "30px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                    <ShieldCheck size={18} color="#10b981" /> Digite sua nova senha de acesso.
                </p>

                <form onSubmit={handleAtualizarSenha} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div style={{ position: "relative" }}>
                        <Lock size={20} color="#94a3b8" style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)" }} />
                        <input 
                            type={mostrarSenha ? "text" : "password"} 
                            placeholder="Sua nova senha forte" 
                            value={senha} onChange={(e) => setSenha(e.target.value)} required minLength="6"
                            style={inputPremiumStyle}
                            onFocus={(e) => e.target.style.borderColor = "#6C63FF"} onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                        />
                        <button
                            type="button" onClick={() => setMostrarSenha(!mostrarSenha)}
                            style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}
                        >
                            {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <button type="submit" disabled={loading} 
                        style={{ 
                            background: loading ? "#94a3b8" : "#6C63FF", color: "white", padding: "16px", borderRadius: "12px", 
                            border: "none", fontSize: "1.1rem", fontWeight: "700", cursor: loading ? "wait" : "pointer", 
                            display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", 
                            boxShadow: loading ? "none" : "0 6px 20px rgba(108, 99, 255, 0.3)", transition: "0.2s"
                        }}>
                        {loading ? "Salvando..." : <>Atualizar Senha <ArrowRight size={20} /></>}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default NovaSenha;