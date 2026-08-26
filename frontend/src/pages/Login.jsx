import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabase"; 
import { Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2, ArrowLeft, Send, Eye, EyeOff } from "lucide-react"; 

import logoSurgiFlow from "../assets/logo_surgiflowdark.png"; 
import videoFundo from "../assets/surgiflowbackground.mp4"; 

function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [isRecovering, setIsRecovering] = useState(false); 
    const [loading, setLoading] = useState(false); 
    
    // Controla a visibilidade da senha
    const [mostrarSenha, setMostrarSenha] = useState(false); 

    const navigate = useNavigate(); 
    const { login } = useAuth(); 

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (login) {
                await login(email, senha);
            }

            // 🛑 O LEÃO DE CHÁCARA DO ONBOARDING 🛑
            // Assim que logar, pegamos a identidade da pessoa
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
                // Consultamos a ficha dela no banco
                const { data: perfil } = await supabase
                    .from('profiles')
                    .select('onboarding_concluido')
                    .eq('id', user.id)
                    .single();

                // Se terminou o Onboarding, vai pro painel. Senão, volta pro Tapete Vermelho!
                if (perfil && perfil.onboarding_concluido) {
                    navigate("/dashboard");
                } else {
                    navigate("/onboarding");
                }
            } else {
                // Fallback de segurança
                navigate("/dashboard");
            }

        } catch (error) {
            console.error("Erro detalhado ao fazer login:", error);
            if (error.message && (error.message.includes("Failed to fetch") || error.message.includes("TIMED_OUT"))) {
                alert("❌ Erro de conexão: O sistema não conseguiu alcançar o servidor. Verifique sua internet, VPN ou bloqueadores de rede.");
            } else {
                alert("❌ Credenciais incorretas ou conta não encontrada.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRecuperarSenha = async (e) => {
        e.preventDefault();
        if (!email) {
            alert("Por favor, digite seu e-mail no campo para recuperar a senha.");
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/nova-senha`, 
            });
            
            if (error) throw error;
            
            alert(`✅ Sucesso! As instruções de recuperação foram enviadas para: ${email}.\n\nVerifique sua caixa de entrada (e o spam).`);
            setIsRecovering(false); 
            setSenha(""); 
            
        } catch (error) {
            console.error("Erro ao enviar e-mail de recuperação", error);
            alert("❌ Erro ao enviar e-mail. Verifique se o endereço está correto e tente novamente.");
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
        <>
            <style>
                {`
                .login-wrapper {
                    display: flex;
                    width: 100vw;
                    height: 100vh;
                    overflow: hidden;
                    position: fixed;
                    top: 0;
                    left: 0;
                    font-family: 'Montserrat', 'Inter', -apple-system, sans-serif;
                    background: #f8fafc;
                }
                
                .login-left-panel {
                    flex: 1;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 80px;
                    color: white;
                }

                .login-right-panel {
                    width: 100%;
                    max-width: 500px;
                    background: #ffffff;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 60px 50px;
                    box-shadow: -10px 0 40px rgba(0,0,0,0.15);
                    z-index: 10;
                    position: relative;
                }

                /* REGRAS PARA CELULARES E TABLETS */
                @media (max-width: 1024px) {
                    .login-left-panel {
                        display: none !important; 
                    }
                    .login-wrapper {
                        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); 
                        justify-content: center;
                        align-items: center;
                        padding: 20px;
                    }
                    .login-right-panel {
                        max-width: 100%;
                        border-radius: 24px; 
                        padding: 40px 30px;
                        box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                        height: auto;
                    }
                }
                `}
            </style>

            <div className="login-wrapper">
                
                {/* LADO ESQUERDO: APRESENTAÇÃO (Some no mobile) */}
                <div className="login-left-panel">
                    <video autoPlay loop muted playsInline style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}>
                        <source src={videoFundo} type="video/mp4" />
                    </video>
                    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(to right, rgba(0, 0, 0, 0.3), transparent)", zIndex: 1 }}></div>
                    <div style={{ position: "relative", zIndex: 2, maxWidth: "650px", textShadow: "0px 2px 15px rgba(0,0,0,0.85)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "30px" }}>
                            <span style={{ fontSize: "1.1rem", fontWeight: "600", color: "#000000", textShadow: "none", letterSpacing: "0.5px" }}>
                                SurgiFlow - Plataforma de Agendamento e Controle Cirúrgico.
                            </span>
                        </div>
                        <h1 style={{ fontSize: "3.5rem", fontWeight: "800", marginBottom: "25px", lineHeight: "1.1", color: "#ffffff" }}>Gestão inteligente da agenda cirúrgica</h1>
                        <p style={{ fontSize: "1.2rem", color: "#ffffff", marginBottom: "20px", lineHeight: "1.6", fontWeight: "600" }}>Organize, acompanhe e simplifique todo o fluxo de agendamentos cirúrgicos em um só lugar.</p>
                        <p style={{ fontSize: "1.1rem", color: "#ffffff", marginBottom: "40px", lineHeight: "1.6", fontWeight: "500" }}>Com o SurgiFlow, você centraliza informações de pacientes, médicos, hospitais, convênios e procedimentos, além de acompanhar o status de cada cirurgia de forma rápida e segura.</p>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", fontSize: "1.15rem", fontWeight: "700", color: "#ffffff", background: "rgba(0, 0, 0, 0.25)", padding: "15px 25px", borderRadius: "12px", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", textShadow: "0px 2px 8px rgba(0,0,0,0.6)" }}>
                            <CheckCircle2 size={24} color="#6C63FF" /> Mais organização. Mais controle. Menos complicação.
                        </div>
                    </div>
                </div>

                {/* LADO DIREITO: PAINEL DE LOGIN (Vira um card centralizado no mobile) */}
                <div className="login-right-panel">
                    
                    <div style={{ textAlign: "center", marginBottom: "35px" }}>
                        <img src={logoSurgiFlow} alt="SurgiFlow Logo" style={{ height: "140px", objectFit: "contain", marginBottom: "10px" }} onError={(e) => { e.target.style.display = 'none' }} />
                        <h2 style={{ color: "#1e293b", margin: "15px 0 5px 0", fontSize: "1.6rem", fontWeight: "800" }}>
                            {isRecovering ? "Recuperar Senha" : "Acesse sua conta"}
                        </h2>
                        <p style={{ color: "#64748b", fontSize: "0.95rem", margin: 0 }}>
                            {isRecovering ? "Digite seu e-mail para receber o link de acesso." : "Painel de Controle Cirúrgico."}
                        </p>
                    </div>

                    {!isRecovering ? (
                        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                            <div style={{ position: "relative" }}>
                                <Mail size={20} color="#94a3b8" style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)" }} />
                                <input type="email" placeholder="E-mail profissional" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputPremiumStyle} onFocus={(e) => e.target.style.borderColor = "#6C63FF"} onBlur={(e) => e.target.style.borderColor = "#cbd5e1"} />
                            </div>

                            <div style={{ position: "relative" }}>
                                <Lock size={20} color="#94a3b8" style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)" }} />
                                <input 
                                    type={mostrarSenha ? "text" : "password"} 
                                    placeholder="Sua senha" 
                                    value={senha} 
                                    onChange={(e) => setSenha(e.target.value)} 
                                    required
                                    style={inputPremiumStyle}
                                    onFocus={(e) => e.target.style.borderColor = "#6C63FF"}
                                    onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
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

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "-5px", marginBottom: "15px" }}>
                                <Link to="/cadastro" style={{ fontSize: "0.85rem", color: "#6C63FF", textDecoration: "none", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}><ShieldCheck size={16} /> Criar conta grátis</Link>
                                <button type="button" onClick={() => setIsRecovering(true)} style={{ background: "none", border: "none", fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: "600", cursor: "pointer", padding: 0 }}>Esqueceu a senha?</button>
                            </div>
                            <button type="submit" disabled={loading} style={{ background: loading ? "#94a3b8" : "#6C63FF", color: "white", padding: "16px", borderRadius: "12px", border: "none", fontSize: "1.1rem", fontWeight: "700", cursor: loading ? "wait" : "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", boxShadow: loading ? "none" : "0 6px 20px rgba(108, 99, 255, 0.3)", transition: "0.2s", fontFamily: "inherit" }} onMouseOver={(e) => { if(!loading) e.currentTarget.style.transform = "translateY(-2px)" }} onMouseOut={(e) => { if(!loading) e.currentTarget.style.transform = "translateY(0)" }}>
                                {loading ? "Entrando..." : <>Entrar no Dashboard <ArrowRight size={20} /></>}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleRecuperarSenha} style={{ display: "flex", flexDirection: "column", gap: "18px", animation: "fadeIn 0.3s ease-in-out" }}>
                            <div style={{ position: "relative" }}>
                                <Mail size={20} color="#94a3b8" style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)" }} />
                                <input type="email" placeholder="Digite seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputPremiumStyle} onFocus={(e) => e.target.style.borderColor = "#6C63FF"} onBlur={(e) => e.target.style.borderColor = "#cbd5e1"} />
                            </div>
                            <button type="submit" disabled={loading} style={{ background: loading ? "#94a3b8" : "#10b981", color: "white", padding: "16px", borderRadius: "12px", border: "none", fontSize: "1.1rem", fontWeight: "700", cursor: loading ? "wait" : "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", boxShadow: loading ? "none" : "0 6px 20px rgba(16, 185, 129, 0.3)", transition: "0.2s", fontFamily: "inherit", marginTop: "10px" }} onMouseOver={(e) => { if(!loading) e.currentTarget.style.transform = "translateY(-2px)" }} onMouseOut={(e) => { if(!loading) e.currentTarget.style.transform = "translateY(0)" }}>
                                {loading ? "Enviando..." : <>Enviar Link de Acesso <Send size={20} /></>}
                            </button>
                            <button type="button" onClick={() => setIsRecovering(false)} style={{ background: "transparent", border: "1px solid #cbd5e1", color: "#475569", padding: "14px", borderRadius: "12px", fontSize: "0.95rem", fontWeight: "700", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", transition: "0.2s", fontFamily: "inherit" }} onMouseOver={(e) => { e.currentTarget.style.background = "#f1f5f9" }} onMouseOut={(e) => { e.currentTarget.style.background = "transparent" }}>
                                <ArrowLeft size={18} /> Voltar ao Login
                            </button>
                        </form>
                    )}
                    
                    <div style={{ marginTop: "40px", textAlign: "center", fontSize: "0.8rem", color: "#94a3b8" }}>
                        Solução desenvolvida pela <strong>SurgiFlow</strong>.<br/> Protegido de ponta a ponta.
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;