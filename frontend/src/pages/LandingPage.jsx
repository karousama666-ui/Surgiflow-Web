import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, LayoutGrid, FileCheck, CheckCircle2, Stethoscope, Building2, Activity } from 'lucide-react';
import logoSurgiFlow from "../assets/logo_surgiflowdark.png"; 

function LandingPage() {
    return (
        <div style={{ fontFamily: "'Montserrat', 'Inter', sans-serif", background: "#0f172a", color: "#f8fafc", minHeight: "100vh", overflowX: "hidden" }}>
            
            {/* INJETANDO RESPONSIVIDADE NATIVA */}
            <style>
                {`
                .landing-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
                .hero-section { padding: 120px 24px 80px 24px; text-align: center; }
                .hero-title { font-size: 4rem; font-weight: 800; line-height: 1.1; margin-bottom: 24px; background: linear-gradient(to right, #ffffff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
                
                @media (max-width: 900px) {
                    .hero-title { font-size: 2.5rem; }
                    .grid-3 { grid-template-columns: 1fr; }
                    .hero-section { padding: 100px 20px 60px 20px; }
                }

                .glass-card { background: rgba(30, 41, 59, 0.5); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 40px; transition: transform 0.3s; }
                .glass-card:hover { transform: translateY(-5px); border-color: rgba(108, 99, 255, 0.5); }
                
                .btn-primary { background: #6C63FF; color: white; padding: 16px 32px; border-radius: 12px; font-weight: 700; font-size: 1.1rem; text-decoration: none; display: inline-flex; alignItems: center; gap: 10px; transition: 0.2s; box-shadow: 0 10px 25px rgba(108, 99, 255, 0.3); }
                .btn-primary:hover { transform: scale(1.05); background: #5a52d5; }
                
                .btn-outline { border: 1px solid rgba(255,255,255,0.2); color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: 0.2s; }
                .btn-outline:hover { background: rgba(255,255,255,0.1); }
                `}
            </style>

            {/* HEADER DA VITRINE */}
            <header style={{ position: "fixed", top: 0, width: "100%", background: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.05)", zIndex: 100 }}>
                <div className="landing-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "80px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Activity size={32} color="#6C63FF" />
                        <span style={{ fontSize: "1.5rem", fontWeight: "800", letterSpacing: "-0.5px" }}>SurgiFlow</span>
                    </div>
                    <div>
                        <Link to="/login" className="btn-outline">Acessar Conta</Link>
                    </div>
                </div>
            </header>

            {/* SEÇÃO HERO (TOPO) */}
            <section className="hero-section">
                <div className="landing-container" style={{ maxWidth: "900px" }}>
                    <div style={{ display: "inline-block", background: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "8px 16px", borderRadius: "20px", fontWeight: "700", fontSize: "0.9rem", marginBottom: "24px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                        🚀 O Sistema Operacional do Bloco Cirúrgico
                    </div>
                    <h1 className="hero-title">O fim do caos na sua agenda cirúrgica.</h1>
                    <p style={{ fontSize: "1.25rem", color: "#94a3b8", marginBottom: "40px", lineHeight: "1.6" }}>
                        Controle agendamentos, aprove OPMEs em formato Kanban e blinde sua operação com checklists pré-cirúrgicos e relatórios de compliance para auditorias sanitárias.
                    </p>
                    <Link to="/cadastro" className="btn-primary">
                        Experimente Grátis <ArrowRight size={20} />
                    </Link>
                    <p style={{ marginTop: "20px", fontSize: "0.9rem", color: "#64748b" }}>Não requer cartão de crédito • Configuração em 5 minutos</p>
                </div>
            </section>

            {/* SEÇÃO DE FUNCIONALIDADES (DORES E SOLUÇÕES) */}
            <section style={{ padding: "80px 0", background: "#0b1120" }}>
                <div className="landing-container">
                    <div style={{ textAlign: "center", marginBottom: "60px" }}>
                        <h2 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "15px" }}>Tudo o que sua clínica precisa.</h2>
                        <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>Ferramentas desenhadas para diretores, médicos e equipes de faturamento.</p>
                    </div>

                    <div className="grid-3">
                        <div className="glass-card">
                            <div style={{ background: "rgba(108, 99, 255, 0.2)", width: "60px", height: "60px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                                <LayoutGrid size={30} color="#6C63FF" />
                            </div>
                            <h3 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "15px" }}>Kanban de OPME</h3>
                            <p style={{ color: "#94a3b8", lineHeight: "1.6" }}>Gerencie autorizações de materiais e orçamentos arrastando cards. Nunca mais perca o prazo de um convênio.</p>
                        </div>

                        <div className="glass-card">
                            <div style={{ background: "rgba(16, 185, 129, 0.2)", width: "60px", height: "60px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                                <ShieldCheck size={30} color="#10b981" />
                            </div>
                            <h3 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "15px" }}>Escudo Anti-Cancelamento</h3>
                            <p style={{ color: "#94a3b8", lineHeight: "1.6" }}>Checklists inteligentes para validação de jejum, exames e termos antes do paciente pisar no hospital.</p>
                        </div>

                        <div className="glass-card">
                            <div style={{ background: "rgba(245, 158, 11, 0.2)", width: "60px", height: "60px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                                <FileCheck size={30} color="#f59e0b" />
                            </div>
                            <h3 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "15px" }}>Compliance e Rastreabilidade</h3>
                            <p style={{ color: "#94a3b8", lineHeight: "1.6" }}>Relatórios executivos focados na RDC 16/2013 e RDC 665/2022. Prontos para apresentar na sua próxima auditoria.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEÇÃO PÚBLICO ALVO */}
            <section style={{ padding: "80px 0" }}>
                <div className="landing-container" style={{ textAlign: "center" }}>
                    <h2 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "40px" }}>Desenvolvido para operações de alto nível</h2>
                    <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
                        <div style={{ background: "rgba(255,255,255,0.05)", padding: "15px 25px", borderRadius: "40px", display: "flex", alignItems: "center", gap: "10px", border: "1px solid rgba(255,255,255,0.1)" }}>
                            <Building2 color="#6C63FF" /> Clínicas e Hospitais Dia
                        </div>
                        <div style={{ background: "rgba(255,255,255,0.05)", padding: "15px 25px", borderRadius: "40px", display: "flex", alignItems: "center", gap: "10px", border: "1px solid rgba(255,255,255,0.1)" }}>
                            <Stethoscope color="#10b981" /> Equipes Cirúrgicas Independentes
                        </div>
                    </div>
                </div>
            </section>

            {/* SEÇÃO DE PREÇOS (Opcional) */}
            <section style={{ padding: "80px 0", background: "#0b1120", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="landing-container">
                    <div style={{ textAlign: "center", marginBottom: "60px" }}>
                        <h2 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "15px" }}>Invista na sua organização</h2>
                        <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>Escolha o plano ideal para o tamanho da sua operação.</p>
                    </div>

                    <div className="grid-3">
                        {/* Plano 1 */}
                        <div className="glass-card" style={{ padding: "40px 30px" }}>
                            <h3 style={{ fontSize: "1.5rem", fontWeight: "700" }}>Starter</h3>
                            <p style={{ color: "#94a3b8", marginBottom: "20px" }}>Para cirurgiões individuais</p>
                            <div style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "20px" }}>R$ 197<span style={{ fontSize: "1rem", color: "#64748b" }}>/mês</span></div>
                            <ul style={{ listStyle: "none", padding: 0, marginBottom: "30px", color: "#e2e8f0", display: "flex", flexDirection: "column", gap: "12px" }}>
                                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><CheckCircle2 size={18} color="#10b981" /> 1 Médico cadastrado</li>
                                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><CheckCircle2 size={18} color="#10b981" /> Gestão de Agenda</li>
                                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><CheckCircle2 size={18} color="#10b981" /> Fichas de Pacientes</li>
                            </ul>
                            <Link to="/cadastro" style={{ display: "block", textAlign: "center", padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.1)", color: "white", textDecoration: "none", fontWeight: "700" }}>Começar Agora</Link>
                        </div>

                        {/* Plano 2 Destaque */}
                        <div className="glass-card" style={{ padding: "40px 30px", border: "2px solid #6C63FF", transform: "scale(1.05)", background: "rgba(108, 99, 255, 0.05)" }}>
                            <div style={{ position: "absolute", top: "-15px", left: "50%", transform: "translateX(-50%)", background: "#6C63FF", color: "white", padding: "5px 15px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "700" }}>MAIS ESCOLHIDO</div>
                            <h3 style={{ fontSize: "1.5rem", fontWeight: "700" }}>Clinic Pro</h3>
                            <p style={{ color: "#94a3b8", marginBottom: "20px" }}>Para clínicas estruturadas</p>
                            <div style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "20px" }}>R$ 497<span style={{ fontSize: "1rem", color: "#64748b" }}>/mês</span></div>
                            <ul style={{ listStyle: "none", padding: 0, marginBottom: "30px", color: "#e2e8f0", display: "flex", flexDirection: "column", gap: "12px" }}>
                                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><CheckCircle2 size={18} color="#10b981" /> Até 10 Médicos</li>
                                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><CheckCircle2 size={18} color="#10b981" /> Kanban de OPME</li>
                                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><CheckCircle2 size={18} color="#10b981" /> Checklist Anti-Cancelamento</li>
                            </ul>
                            <Link to="/cadastro" style={{ display: "block", textAlign: "center", padding: "12px", borderRadius: "10px", background: "#6C63FF", color: "white", textDecoration: "none", fontWeight: "700" }}>Começar Agora</Link>
                        </div>

                        {/* Plano 3 */}
                        <div className="glass-card" style={{ padding: "40px 30px" }}>
                            <h3 style={{ fontSize: "1.5rem", fontWeight: "700" }}>Hospitalar</h3>
                            <p style={{ color: "#94a3b8", marginBottom: "20px" }}>Para operações complexas</p>
                            <div style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "20px" }}>R$ 997<span style={{ fontSize: "1rem", color: "#64748b" }}>/mês</span></div>
                            <ul style={{ listStyle: "none", padding: 0, marginBottom: "30px", color: "#e2e8f0", display: "flex", flexDirection: "column", gap: "12px" }}>
                                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><CheckCircle2 size={18} color="#10b981" /> Médicos Ilimitados</li>
                                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><CheckCircle2 size={18} color="#10b981" /> Relatórios para Auditoria (RDC)</li>
                                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><CheckCircle2 size={18} color="#10b981" /> Suporte Prioritário</li>
                            </ul>
                            <Link to="/cadastro" style={{ display: "block", textAlign: "center", padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.1)", color: "white", textDecoration: "none", fontWeight: "700" }}>Falar com Consultor</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{ padding: "40px 24px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <Activity size={24} color="#6C63FF" style={{ marginBottom: "15px" }} />
                <p style={{ color: "#64748b", fontSize: "0.9rem" }}>&copy; {new Date().getFullYear()} SurgiFlow. Todos os direitos reservados.</p>
                <p style={{ color: "#475569", fontSize: "0.8rem", marginTop: "5px" }}>Gestão e Compliance de Excelência.</p>
            </footer>
        </div>
    );
}

export default LandingPage;