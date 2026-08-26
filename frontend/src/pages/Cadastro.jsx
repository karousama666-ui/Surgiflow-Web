import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, FileText, ArrowRight, ShieldCheck, Eye, EyeOff, FileCheck2 } from "lucide-react"; 
import logoSurgiFlow from "../assets/logopdf.png"; 

// O CAMINHO CORRIGIDO E DEFINITIVO PARA O SUPABASE! 🎯
import { supabase } from "../services/supabase.js";

function Cadastro() {
    const [form, setForm] = useState({
        nome: "",
        cpf: "",
        email: "",
        senha: ""
    });
    
    // 👇 ESTADOS DE CONTROLE 👇
    const [mostrarSenha, setMostrarSenha] = useState(false); 
    const [aceitouTermos, setAceitouTermos] = useState(false); // NOVO: Controle da LGPD
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        let { name, value } = e.target;
        
        if (name === "cpf") {
            value = value.replace(/\D/g, "");
            if (value.length > 11) value = value.slice(0, 11);
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        }

        setForm({ ...form, [name]: value });
    };

    const handleCadastro = async (e) => {
        e.preventDefault();
        
        // 1. Validação do CPF
        if (form.cpf.length !== 14) {
            alert("Por favor, insira um CPF válido com 11 dígitos.");
            return;
        }

        // 2. Validação da LGPD (Segurança Jurídica)
        if (!aceitouTermos) {
            alert("⚠️ Você precisa ler e concordar com os Termos de Uso e Política de Privacidade para criar uma conta.");
            return;
        }

        setLoading(true);

        try {
            // Chamada oficial para o banco de dados criar o usuário
            const { data, error } = await supabase.auth.signUp({
                email: form.email,
                password: form.senha,
                options: {
                    data: {
                        nome: form.nome,
                        cpf: form.cpf
                    }
                }
            });

            // Se o Supabase recusar (ex: e-mail já existe ou senha muito curta)
            if (error) {
                alert("Ops! Erro ao criar conta: " + error.message);
                return;
            }

            // Sucesso! Joga o usuário direto para o "Tapete Vermelho"
            navigate("/onboarding"); 
            
        } catch (err) {
            console.error("Erro inesperado no cadastro:", err);
            alert("Ocorreu um erro no servidor. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            position: "relative", width: "100vw", height: "100vh", overflow: "hidden", 
            display: "flex", justifyContent: "center", alignItems: "center",
            fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}>
            
            <video 
                autoPlay loop muted playsInline
                style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", zIndex: -1, filter: "brightness(0.4) blur(3px)" }}
            >
                <source src="https://assets.mixkit.co/videos/preview/mixkit-doctor-analyzing-a-patient-brain-scan-32863-large.mp4" type="video/mp4" />
            </video>

            <div style={{ 
                background: "rgba(255, 255, 255, 0.95)", padding: "40px 50px", borderRadius: "24px", 
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)", width: "100%", maxWidth: "450px", 
                textAlign: "center", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.5)",
                maxHeight: '90vh', overflowY: 'auto' // Evita quebrar em telas pequenas
            }}>
                
                <img src={logoSurgiFlow} alt="SurgiFlow Logo" style={{ height: "55px", marginBottom: "10px", objectFit: "contain" }} onError={(e) => { e.target.style.display = 'none' }} />
                
                <h2 style={{ color: "#1e293b", margin: "0 0 5px 0", fontSize: "1.5rem", fontWeight: "800" }}>Crie sua conta</h2>
                <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "25px", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                    <ShieldCheck size={16} color="#10b981" /> Acesso seguro e auditável.
                </p>

                <form onSubmit={handleCadastro} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    
                    <div style={{ position: "relative" }}>
                        <User size={20} color="#94a3b8" style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)" }} />
                        <input type="text" name="nome" placeholder="Nome completo" value={form.nome} onChange={handleChange} required
                            style={{ 
                                width: "100%", padding: "14px 14px 14px 45px", borderRadius: "12px", 
                                border: "1px solid #cbd5e1", fontSize: "0.95rem", outline: "none", boxSizing: "border-box", 
                                background: "#f8fafc", color: "#1e293b", fontFamily: "inherit" 
                            }}
                        />
                    </div>

                    <div style={{ position: "relative" }}>
                        <FileText size={20} color="#94a3b8" style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)" }} />
                        <input type="text" name="cpf" placeholder="CPF (Apenas números)" value={form.cpf} onChange={handleChange} required
                            style={{ 
                                width: "100%", padding: "14px 14px 14px 45px", borderRadius: "12px", 
                                border: "1px solid #cbd5e1", fontSize: "0.95rem", outline: "none", boxSizing: "border-box", 
                                background: "#f8fafc", color: "#1e293b", fontFamily: "inherit" 
                            }}
                        />
                    </div>

                    <div style={{ position: "relative" }}>
                        <Mail size={20} color="#94a3b8" style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)" }} />
                        <input type="email" name="email" placeholder="E-mail profissional" value={form.email} onChange={handleChange} required
                            style={{ 
                                width: "100%", padding: "14px 14px 14px 45px", borderRadius: "12px", 
                                border: "1px solid #cbd5e1", fontSize: "0.95rem", outline: "none", boxSizing: "border-box", 
                                background: "#f8fafc", color: "#1e293b", fontFamily: "inherit" 
                            }}
                        />
                    </div>

                    <div style={{ position: "relative" }}>
                        <Lock size={20} color="#94a3b8" style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)" }} />
                        
                        <input 
                            type={mostrarSenha ? "text" : "password"} 
                            name="senha" 
                            placeholder="Crie uma senha forte" 
                            value={form.senha} 
                            onChange={handleChange} 
                            required 
                            minLength="6"
                            style={{ 
                                width: "100%", padding: "14px 45px 14px 45px", borderRadius: "12px",
                                border: "1px solid #cbd5e1", fontSize: "0.95rem", outline: "none", boxSizing: "border-box", 
                                background: "#f8fafc", color: "#1e293b", fontFamily: "inherit" 
                            }}
                        />
                        
                        <button
                            type="button"
                            onClick={() => setMostrarSenha(!mostrarSenha)}
                            style={{
                                position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)",
                                background: "none", border: "none", cursor: "pointer", padding: "5px", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", transition: "0.2s"
                            }}
                            onMouseOver={(e) => e.currentTarget.style.color = "#6C63FF"}
                            onMouseOut={(e) => e.currentTarget.style.color = "#94a3b8"}
                            title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                        >
                            {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* 🌟 NOVO: CHECKBOX DA LGPD 🌟 */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '5px', textAlign: 'left', background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div 
                            onClick={() => setAceitouTermos(!aceitouTermos)}
                            style={{ width: '22px', height: '22px', borderRadius: '6px', background: aceitouTermos ? '#10b981' : 'white', border: aceitouTermos ? '1px solid #10b981' : '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: '0.2s' }}
                        >
                            {aceitouTermos && <FileCheck2 size={14} color="white" strokeWidth={3} />}
                        </div>
                        <label onClick={() => setAceitouTermos(!aceitouTermos)} style={{ fontSize: '0.8rem', color: '#475569', lineHeight: '1.4', cursor: 'pointer', userSelect: 'none' }}>
                            Li e concordo com os <a href="#" onClick={(e) => { e.preventDefault(); alert("Os Termos de Uso serão abertos aqui."); }} style={{ color: '#6C63FF', fontWeight: '600', textDecoration: 'none' }}>Termos de Serviço</a> e a <a href="#" onClick={(e) => { e.preventDefault(); alert("A Política de Privacidade será aberta aqui."); }} style={{ color: '#6C63FF', fontWeight: '600', textDecoration: 'none' }}>Política de Privacidade (LGPD)</a>.
                        </label>
                    </div>

                    <button type="submit" disabled={loading}
                        style={{ 
                            background: loading ? "#94a3b8" : "#6C63FF", color: "white", padding: "15px", borderRadius: "12px", border: "none", 
                            fontSize: "1rem", fontWeight: "700", cursor: loading ? "wait" : "pointer", display: "flex", justifyContent: "center", 
                            alignItems: "center", gap: "10px", boxShadow: loading ? "none" : "0 4px 14px rgba(108, 99, 255, 0.4)", 
                            transition: "0.2s", marginTop: "5px", fontFamily: "inherit"
                        }}
                        onMouseOver={(e) => { if(!loading) e.currentTarget.style.transform = "translateY(-2px)" }}
                        onMouseOut={(e) => { if(!loading) e.currentTarget.style.transform = "translateY(0)" }}
                    >
                        {loading ? "Criando ambiente..." : "Criar Conta Grátis"} {!loading && <ArrowRight size={20} />}
                    </button>
                </form>

                <div style={{ marginTop: "20px", fontSize: "0.9rem", color: "#64748b" }}>
                    Já possui uma conta? <Link to="/login" style={{ color: "#6C63FF", textDecoration: "none", fontWeight: "700", fontFamily: "inherit" }}>Faça Login</Link>
                </div>
            </div>
        </div>
    );
}

export default Cadastro;