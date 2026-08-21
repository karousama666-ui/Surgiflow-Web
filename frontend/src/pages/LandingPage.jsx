import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, LayoutGrid, FileCheck, CheckCircle2, Stethoscope, Building2 } from 'lucide-react';

import logoSurgiFlow from '../assets/logo_vertical.png'; 
import iconeFundo from '../assets/iconegrande.png'; 

function LandingPage() {
    return (
        <div style={{ fontFamily: "'Montserrat', 'Inter', sans-serif", background: "#f8fafc", color: "#1e293b", minHeight: "100vh", overflowX: "hidden" }}>
            
            <style>
                {`
                *, *::before, *::after { box-sizing: border-box; }
                
                html { scroll-behavior: smooth; }

                .landing-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
                
                .hero-section { position: relative; padding: 180px 24px 80px 24px; text-align: center; background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%); overflow: hidden; }
                .hero-title { font-size: 3.8rem; font-weight: 800; line-height: 1.15; margin-bottom: 24px; color: #0f172a; letter-spacing: -1px; position: relative; z-index: 2; }
                
                /* 👇 MARCA D'ÁGUA AJUSTADA (MENOR, CENTRALIZADA E MAIS VISÍVEL) 👇 */
                .bg-watermark {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 450px; /* Bem menor e mais delicado */
                    max-width: 90vw; /* Garante que não vaza no celular */
                    opacity: 0.08; /* Menos transparente (8%) */
                    z-index: 0;
                    pointer-events: none;
                }

                .hero-content { position: relative; z-index: 2; }
                
                .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; align-items: stretch; }
                
                @media (max-width: 900px) {
                    .hero-title { font-size: 2.5rem; }
                    .grid-3 { grid-template-columns: 1fr; }
                    .hero-section { padding: 160px 20px 60px 20px; }
                    .bg-watermark { width: 300px; opacity: 0.06; } /* Ajuste fino pro celular */
                }

                .clean-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 40px; transition: all 0.3s ease; box-shadow: 0 4px 6px rgba(0,0,0,0.02); display: flex; flex-direction: column; height: 100%; }
                .clean-card:hover { transform: translateY(-5px); border-color: #cbd5e1; box-shadow: 0 12px 25px rgba(0,0,0,0.05); }
                
                .btn-primary { background: #6C63FF; color: white; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 1rem; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.2s; box-shadow: 0 6px 15px rgba(108, 99, 255, 0.25); border: none; cursor: pointer; }
                .btn-primary:hover { transform: translateY(-2px); background: #5a52d5; box-shadow: 0 8px 20px rgba(108, 99, 255, 0.35); }
                
                .btn-premium { background: #0f172a; color: white; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 1rem; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.2s; box-shadow: 0 6px 15px rgba(15, 23, 42, 0.2); border: none; cursor: pointer; }
                .btn-premium:hover { transform: translateY(-2px); background: #1e293b; box-shadow: 0 8px 20px rgba(15, 23, 42, 0.3); }

                .btn-outline { border: 2px solid #cbd5e1; color: #475569; background: #ffffff; padding: 10px 24px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 1rem; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
                .btn-outline:hover { border-color: #6C63FF; color: #6C63FF; background: #f8fafc; }

                .header-link { color: #475569; text-decoration: none; font-weight: 700; font-size: 1rem; transition: color 0.2s; }
                .header-link:hover { color: #6C63FF; }
                `}
            </style>

            <header style={{ position: "fixed", top: 0, width: "100%", background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e2e8f0", zIndex: 100 }}>
                <div className="landing-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "100px" }}>
                    <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
                        <img src={logoSurgiFlow} alt="SurgiFlow Logo" style={{ height: "85px", width: "auto", objectFit: "contain" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
                        <a href="#planos" className="header-link">Planos</a>
                        <Link to="/login" className="btn-primary" style={{ padding: "10px 20px", display: "inline-flex", width: "auto" }}>Acessar Conta</Link>
                    </div>
                </div>
            </header>

            <section className="hero-section">
                {/* Imagem de Fundo atualizada */}
                <img src={iconeFundo} alt="" className="bg-watermark" />
                
                <div className="landing-container hero-content" style={{ maxWidth: "900px" }}>
                    <div style={{ display: "inline-block", background: "#ecfdf5", color: "#059669", padding: "8px 16px", borderRadius: "20px", fontWeight: "700", fontSize: "0.9rem", marginBottom: "24px", border: "1px solid #a7f3d0" }}>
                        🚀 O Sistema Operacional do Bloco Cirúrgico
                    </div>
                    <h1 className="hero-title">O fim do caos na sua agenda cirúrgica.</h1>
                    <p style={{ fontSize: "1.25rem", color: "#64748b", marginBottom: "40px", lineHeight: "1.6", fontWeight: "500" }}>
                        Controle agendamentos, aprove OPMEs em formato Kanban e blinde sua operação com checklists pré-cirúrgicos e relatórios de compliance.
                    </p>
                    <Link to="/cadastro" className="btn-primary" style={{ padding: "14px 28px", fontSize: "1.05rem", display: "inline-flex", width: "auto" }}>
                        Experimente Grátis <ArrowRight size={20} />
                    </Link>
                    <p style={{ marginTop: "20px", fontSize: "0.95rem", color: "#94a3b8", fontWeight: "500" }}>Não requer cartão de crédito • Configuração em 5 minutos</p>
                </div>
            </section>

            <section style={{ padding: "80px 0", background: "#ffffff" }}>
                <div className="landing-container">
                    <div style={{ textAlign: "center", marginBottom: "60px" }}>
                        <h2 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "15px", color: "#0f172a" }}>Tudo o que sua clínica precisa.</h2>
                        <p style={{ color: "#64748b", fontSize: "1.1rem", fontWeight: "500" }}>Ferramentas desenhadas para diretores, médicos e equipes de faturamento.</p>
                    </div>

                    <div className="grid-3">
                        <div className="clean-card">
                            <div style={{ background: "#eff6ff", width: "60px", height: "60px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                                <LayoutGrid size={30} color="#3b82f6" />
                            </div>
                            <h3 style={{ fontSize: "1.3rem", fontWeight: "800", marginBottom: "15px", color: "#1e293b" }}>Kanban de OPME</h3>
                            <p style={{ color: "#475569", lineHeight: "1.6", fontWeight: "500" }}>Gerencie autorizações de materiais e orçamentos arrastando cards. Nunca mais perca o prazo de um convênio.</p>
                        </div>

                        <div className="clean-card">
                            <div style={{ background: "#ecfdf5", width: "60px", height: "60px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                                <ShieldCheck size={30} color="#10b981" />
                            </div>
                            <h3 style={{ fontSize: "1.3rem", fontWeight: "800", marginBottom: "15px", color: "#1e293b" }}>Escudo Anti-Cancelamento</h3>
                            <p style={{ color: "#475569", lineHeight: "1.6", fontWeight: "500" }}>Checklists inteligentes para validação de jejum, exames e termos antes do paciente pisar no hospital.</p>
                        </div>

                        <div className="clean-card">
                            <div style={{ background: "#fef3c7", width: "60px", height: "60px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                                <FileCheck size={30} color="#f59e0b" />
                            </div>
                            <h3 style={{ fontSize: "1.3rem", fontWeight: "800", marginBottom: "15px", color: "#1e293b" }}>Compliance e RDC</h3>
                            <p style={{ color: "#475569", lineHeight: "1.6", fontWeight: "500" }}>Relatórios executivos focados na RDC 16/2013 e RDC 665/2022. Prontos para apresentar na sua próxima auditoria.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ padding: "80px 0", background: "#f8fafc" }}>
                <div className="landing-container" style={{ textAlign: "center" }}>
                    <h2 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "40px", color: "#0f172a" }}>Desenvolvido para operações de alto nível</h2>
                    <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
                        <div style={{ background: "#ffffff", padding: "15px 30px", borderRadius: "40px", display: "flex", alignItems: "center", gap: "12px", border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.02)", fontWeight: "700", color: "#334155" }}>
                            <Building2 color="#6C63FF" size={24} /> Clínicas e Hospitais Dia
                        </div>
                        <div style={{ background: "#ffffff", padding: "15px 30px", borderRadius: "40px", display: "flex", alignItems: "center", gap: "12px", border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.02)", fontWeight: "700", color: "#334155" }}>
                            <Stethoscope color="#10b981" size={24} /> Equipes Cirúrgicas Independentes
                        </div>
                    </div>
                </div>
            </section>

            <section id="planos" style={{ padding: "80px 0", background: "#ffffff", borderTop: "1px solid #e2e8f0" }}>
                <div className="landing-container">
                    <div style={{ textAlign: "center", marginBottom: "60px" }}>
                        <h2 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "15px", color: "#0f172a" }}>Invista na sua organização</h2>
                        <p style={{ color: "#64748b", fontSize: "1.1rem", fontWeight: "500" }}>Escolha o plano ideal para o tamanho da sua operação.</p>
                    </div>

                    <div className="grid-3">
                        <div className="clean-card">
                            <h3 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#1e293b" }}>Free</h3>
                            <p style={{ color: "#64748b", marginBottom: "20px", fontWeight: "500" }}>Para testar a plataforma</p>
                            <div style={{ fontSize: "2.8rem", fontWeight: "800", marginBottom: "25px", color: "#0f172a" }}>R$ 0<span style={{ fontSize: "1rem", color: "#94a3b8" }}>/mês</span></div>
                            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 30px 0", color: "#475569", display: "flex", flexDirection: "column", gap: "14px", flex: 1, fontWeight: "500" }}>
                                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><CheckCircle2 size={20} color="#10b981" /> 1 Médico cadastrado</li>
                                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><CheckCircle2 size={20} color="#10b981" /> Até 10 Pacientes</li>
                                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><CheckCircle2 size={20} color="#10b981" /> Gestão de Agenda Básica</li>
                            </ul>
                            <Link to="/cadastro" className="btn-outline" style={{ width: "100%" }}>Começar Grátis</Link>
                        </div>

                        <div className="clean-card" style={{ border: "2px solid #6C63FF", transform: "scale(1.05)", background: "#ffffff", boxShadow: "0 20px 40px rgba(108, 99, 255, 0.1)", position: "relative" }}>
                            <div style={{ position: "absolute", top: "-15px", left: "50%", transform: "translateX(-50%)", background: "#6C63FF", color: "white", padding: "6px 20px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "800", letterSpacing: "0.5px" }}>MAIS ESCOLHIDO</div>
                            <h3 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#1e293b" }}>Starter</h3>
                            <p style={{ color: "#64748b", marginBottom: "20px", fontWeight: "500" }}>Para equipes em crescimento</p>
                            <div style={{ fontSize: "2.8rem", fontWeight: "800", marginBottom: "25px", color: "#0f172a" }}>R$ 149<span style={{ fontSize: "1.5rem" }}>,90</span><span style={{ fontSize: "1rem", color: "#94a3b8" }}>/mês</span></div>
                            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 30px 0", color: "#475569", display: "flex", flexDirection: "column", gap: "14px", flex: 1, fontWeight: "500" }}>
                                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><CheckCircle2 size={20} color="#6C63FF" /> Até 10 Médicos</li>
                                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><CheckCircle2 size={20} color="#6C63FF" /> Pacientes Ilimitados</li>
                                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><CheckCircle2 size={20} color="#6C63FF" /> 2 Usuários (Acessos)</li>
                                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><CheckCircle2 size={20} color="#6C63FF" /> Kanban de OPME</li>
                            </ul>
                            <Link to="/cadastro" className="btn-primary" style={{ width: "100%" }}>Assinar Starter</Link>
                        </div>

                        <div className="clean-card">
                            <h3 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#1e293b" }}>Clinic Pro</h3>
                            <p style={{ color: "#64748b", marginBottom: "20px", fontWeight: "500" }}>Para operações completas</p>
                            <div style={{ fontSize: "2.8rem", fontWeight: "800", marginBottom: "25px", color: "#0f172a" }}>R$ 399<span style={{ fontSize: "1.5rem" }}>,90</span><span style={{ fontSize: "1rem", color: "#94a3b8" }}>/mês</span></div>
                            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 30px 0", color: "#475569", display: "flex", flexDirection: "column", gap: "14px", flex: 1, fontWeight: "500" }}>
                                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><CheckCircle2 size={20} color="#10b981" /> Médicos Ilimitados</li>
                                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><CheckCircle2 size={20} color="#10b981" /> Pacientes Ilimitados</li>
                                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><CheckCircle2 size={20} color="#10b981" /> Usuários Ilimitados</li>
                                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><CheckCircle2 size={20} color="#10b981" /> Relatórios de Auditoria</li>
                            </ul>
                            <a href="#" className="btn-premium" style={{ width: "100%" }}>Assinar Pro</a>
                        </div>
                    </div>
                </div>
            </section>

            <footer style={{ padding: "40px 24px", textAlign: "center", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
                <img src={logoSurgiFlow} alt="SurgiFlow" style={{ height: "40px", marginBottom: "15px", filter: "grayscale(100%) opacity(0.6)" }} />
                <p style={{ color: "#64748b", fontSize: "0.95rem", fontWeight: "500" }}>&copy; {new Date().getFullYear()} SurgiFlow. Todos os direitos reservados.</p>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "5px", fontWeight: "500" }}>Gestão e Compliance de Excelência.</p>
            </footer>
        </div>
    );
}

export default LandingPage;