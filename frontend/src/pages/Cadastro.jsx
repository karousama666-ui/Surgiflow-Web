import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, FileText, ArrowRight, ShieldCheck } from "lucide-react";
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
        
        if (form.cpf.length !== 14) {
            alert("Por favor, insira um CPF válido com 11 dígitos.");
            return;
        }

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

            // Sucesso!
            alert("Conta criada com sucesso! Bem-vindo(a) ao SurgiFlow.");
            navigate("/"); // Redireciona para a tela de Login
            
        } catch (err) {
            console.error("Erro inesperado no cadastro:", err);
            alert("Ocorreu um erro no servidor. Tente novamente.");
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
                textAlign: "center", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.5)"
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
                        <input type="password" name="senha" placeholder="Crie uma senha forte" value={form.senha} onChange={handleChange} required minLength="6"
                            style={{ 
                                width: "100%", padding: "14px 14px 14px 45px", borderRadius: "12px", 
                                border: "1px solid #cbd5e1", fontSize: "0.95rem", outline: "none", boxSizing: "border-box", 
                                background: "#f8fafc", color: "#1e293b", fontFamily: "inherit" 
                            }}
                        />
                    </div>

                    <button type="submit" 
                        style={{ 
                            background: "#6C63FF", color: "white", padding: "15px", borderRadius: "12px", border: "none", 
                            fontSize: "1rem", fontWeight: "700", cursor: "pointer", display: "flex", justifyContent: "center", 
                            alignItems: "center", gap: "10px", boxShadow: "0 4px 14px rgba(108, 99, 255, 0.4)", 
                            transition: "0.2s", marginTop: "5px", fontFamily: "inherit"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                        onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                    >
                        Criar Conta Grátis <ArrowRight size={20} />
                    </button>
                </form>

                <div style={{ marginTop: "20px", fontSize: "0.9rem", color: "#64748b" }}>
                    Já possui uma conta? <Link to="/" style={{ color: "#6C63FF", textDecoration: "none", fontWeight: "700", fontFamily: "inherit" }}>Faça Login</Link>
                </div>
            </div>
        </div>
    );
}

export default Cadastro;