import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

import logoSurgiFlow from "../assets/logo_surgiflowdark.png"; 
import videoFundo from "../assets/surgiflowbackground.mp4"; 

function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const navigate = useNavigate(); 
    
    const { login, recuperarSenha } = useAuth(); 

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            if (login) {
                await login(email, senha);
            }
            navigate("/dashboard");
        } catch (error) {
            console.error("Erro ao fazer login", error);
            alert("Credenciais incorretas ou conta não encontrada.");
        }
    };

    const handleEsqueciSenha = async (e) => {
        e.preventDefault();
        
        if (!email) {
            alert("Por favor, digite seu e-mail no campo acima para recuperar a senha.");
            return;
        }

        try {
            await recuperarSenha(email);
            alert(`As instruções de recuperação foram enviadas para: ${email}. Verifique sua caixa de entrada!`);
        } catch (error) {
            alert("Erro ao enviar e-mail de recuperação. Verifique se o e-mail está correto.");
        }
    };

    return (
        <div style={{ 
            display: "flex", width: "100vw", height: "100vh", overflow: "hidden", 
            position: "fixed", top: 0, left: 0,
            fontFamily: "'Montserrat', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}>
            
            {/* LADO ESQUERDO: APRESENTAÇÃO DO SURGIFLOW */}
            <div style={{ 
                flex: 1, position: "relative", display: "flex", flexDirection: "column", 
                justifyContent: "center", padding: "80px", color: "white" 
            }}>
                {/* Vídeo de fundo */}
                <video 
                    autoPlay loop muted playsInline
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
                >
                    <source src={videoFundo} type="video/mp4" />
                </video>
                
                {/* MÁSCARA CLEAN: Bem transparente, deixando o vídeo brilhar */}
                <div style={{ 
                    position: "absolute", top: 0, left: 0, width: "100%", height: "100%", 
                    background: "linear-gradient(to right, rgba(0, 0, 0, 0.3), transparent)", zIndex: 1 
                }}></div>

                <div style={{ position: "relative", zIndex: 2, maxWidth: "650px", textShadow: "0px 2px 15px rgba(0,0,0,0.85)" }}>
                    
                    {/* AQUI ESTÁ A MUDANÇA: Texto preto, minimalista e sem sombra */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "30px" }}>
                        <span style={{ 
                            fontSize: "1.1rem", 
                            fontWeight: "600", 
                            color: "#000000", 
                            textShadow: "none", // Retira a sombra para ficar clean
                            letterSpacing: "0.5px"
                        }}>
                            SurgiFlow - Plataforma de Agendamento e Controle Cirúrgico.
                        </span>
                    </div>

                    <h1 style={{ fontSize: "3.5rem", fontWeight: "800", marginBottom: "25px", lineHeight: "1.1", color: "#ffffff" }}>
                        Gestão inteligente da agenda cirúrgica
                    </h1>
                    
                    <p style={{ fontSize: "1.2rem", color: "#ffffff", marginBottom: "20px", lineHeight: "1.6", fontWeight: "600" }}>
                        Organize, acompanhe e simplifique todo o fluxo de agendamentos cirúrgicos em um só lugar.
                    </p>
                    
                    <p style={{ fontSize: "1.1rem", color: "#ffffff", marginBottom: "40px", lineHeight: "1.6", fontWeight: "500" }}>
                        Com o SurgiFlow, você centraliza informações de pacientes, médicos, hospitais, convênios e procedimentos, além de acompanhar o status de cada cirurgia de forma rápida e segura.
                    </p>

                    <div style={{ 
                        display: "inline-flex", alignItems: "center", gap: "12px", fontSize: "1.15rem", 
                        fontWeight: "700", color: "#ffffff", background: "rgba(0, 0, 0, 0.25)", 
                        padding: "15px 25px", borderRadius: "12px", backdropFilter: "blur(8px)", 
                        border: "1px solid rgba(255,255,255,0.2)", textShadow: "0px 2px 8px rgba(0,0,0,0.6)"
                    }}>
                        <CheckCircle2 size={24} color="#6C63FF" /> Mais organização. Mais controle. Menos complicação.
                    </div>
                </div>
            </div>

            {/* LADO DIREITO: PAINEL LATERAL DE LOGIN */}
            <div style={{ 
                width: "100%", maxWidth: "500px", background: "#ffffff", display: "flex", 
                flexDirection: "column", justifyContent: "center", padding: "60px 50px", 
                boxShadow: "-10px 0 40px rgba(0,0,0,0.15)", zIndex: 10 
            }}>
                
                <div style={{ textAlign: "center", marginBottom: "35px" }}>
                    <img 
                        src={logoSurgiFlow} alt="SurgiFlow Logo" 
                        style={{ height: "190px", objectFit: "contain", marginBottom: "10px" }} 
                        onError={(e) => { e.target.style.display = 'none' }} 
                    />
                    <h2 style={{ color: "#1e293b", margin: "15px 0 5px 0", fontSize: "1.6rem", fontWeight: "800" }}>Acesse sua conta</h2>
                    
                    <p style={{ color: "#64748b", fontSize: "0.95rem", margin: 0 }}>Painel de Controle Cirúrgico.</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                    
                    <div style={{ position: "relative" }}>
                        <Mail size={20} color="#94a3b8" style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)" }} />
                        <input 
                            type="email" placeholder="E-mail profissional" value={email} onChange={(e) => setEmail(e.target.value)} required
                            style={{ 
                                width: "100%", padding: "16px 16px 16px 45px", borderRadius: "12px", 
                                border: "1px solid #cbd5e1", fontSize: "1rem", outline: "none", boxSizing: "border-box", 
                                background: "#f8fafc", color: "#1e293b", fontFamily: "inherit"
                            }}
                        />
                    </div>

                    <div style={{ position: "relative" }}>
                        <Lock size={20} color="#94a3b8" style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)" }} />
                        <input 
                            type="password" placeholder="Sua senha" value={senha} onChange={(e) => setSenha(e.target.value)} 
                            style={{ 
                                width: "100%", padding: "16px 16px 16px 45px", borderRadius: "12px", 
                                border: "1px solid #cbd5e1", fontSize: "1rem", outline: "none", boxSizing: "border-box", 
                                background: "#f8fafc", color: "#1e293b", fontFamily: "inherit"
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "-5px", marginBottom: "15px" }}>
                        <Link to="/cadastro" style={{ fontSize: "0.85rem", color: "#6C63FF", textDecoration: "none", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                            <ShieldCheck size={16} /> Criar conta grátis
                        </Link>
                        
                        <a href="#" onClick={handleEsqueciSenha} style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: "600" }}>
                            Esqueceu a senha?
                        </a>
                    </div>

                    <button 
                        type="submit" 
                        style={{ 
                            background: "#6C63FF", color: "white", padding: "16px", borderRadius: "12px", 
                            border: "none", fontSize: "1.1rem", fontWeight: "700", cursor: "pointer", 
                            display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", 
                            boxShadow: "0 6px 20px rgba(108, 99, 255, 0.3)", transition: "0.2s", fontFamily: "inherit"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                        onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                    >
                        Entrar no Dashboard <ArrowRight size={20} />
                    </button>
                </form>
                
                <div style={{ marginTop: "40px", textAlign: "center", fontSize: "0.8rem", color: "#94a3b8" }}>
                    Solução desenvolvida pela <strong>SurgiFlow</strong>.<br/>
                    Protegido de ponta a ponta.
                </div>
            </div>
        </div>
    );
}

export default Login;