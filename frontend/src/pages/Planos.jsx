import React from 'react';
import { Check, Star, Shield, Zap, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Planos() {
    const navigate = useNavigate();

    // 👇 AQUI VOCÊ COLOCA OS SEUS LINKS REAIS DO ASAAS 👇
    const linkAsaasStarter = "https://www.asaas.com/c/seu-link-starter";
    const linkAsaasPro = "https://www.asaas.com/c/seu-link-pro";

    return (
        <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Montserrat', 'Inter', sans-serif" }}>
            
            <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', marginBottom: '20px' }}>
                <ArrowLeft size={18} /> Voltar
            </button>

            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fef3c7', color: '#d97706', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700', marginBottom: '15px' }}>
                    <Star size={16} fill="#d97706" /> Faça o Upgrade do seu plano
                </div>
                <h1 style={{ fontSize: '2.5rem', color: '#1e293b', fontWeight: '800', margin: '0 0 15px 0' }}>
                    Escale sua gestão cirúrgica
                </h1>
                <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
                    Você atingiu o limite do plano gratuito. Escolha o plano ideal para a sua equipe e libere agendamentos ilimitados, alertas inteligentes e relatórios gerenciais.
                </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
                
                {/* 💳 PLANO STARTER */}
                <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', position: 'relative', transition: '0.3s', boxShadow: '0 10px 25px rgba(0,0,0,0.02)' }}>
                    <div style={{ marginBottom: '30px' }}>
                        <h2 style={{ margin: '0 0 10px 0', fontSize: '1.5rem', color: '#1e293b', fontWeight: '800' }}>Starter</h2>
                        <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 20px 0' }}>Para médicos e pequenas equipes que buscam organização essencial.</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a' }}>R$ 147</span>
                            <span style={{ color: '#64748b', fontWeight: '500' }}>/mês</span>
                        </div>
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
                        {['Agendamentos Ilimitados', 'Até 2 membros na equipe', 'Funil de OPME (Básico)', 'Suporte por e-mail'].map((item, index) => (
                            <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#475569', fontSize: '0.95rem', fontWeight: '500' }}>
                                <Check size={18} color="#10b981" /> {item}
                            </li>
                        ))}
                    </ul>

                    <a href={linkAsaasStarter} target="_blank" rel="noopener noreferrer" style={{ background: '#f1f5f9', color: '#1e293b', textAlign: 'center', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', transition: '0.2s' }} onMouseOver={(e) => { e.currentTarget.style.background = '#e2e8f0' }} onMouseOut={(e) => { e.currentTarget.style.background = '#f1f5f9' }}>
                        Assinar Starter
                    </a>
                </div>

                {/* 💳 PLANO PRO (Destaque) */}
                <div style={{ background: '#1e293b', border: '2px solid #6C63FF', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', position: 'relative', transition: '0.3s', boxShadow: '0 20px 40px rgba(108, 99, 255, 0.2)', transform: 'scale(1.05)' }}>
                    <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: '#6C63FF', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Zap size={14} fill="white" /> MAIS ESCOLHIDO
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <h2 style={{ margin: '0 0 10px 0', fontSize: '1.5rem', color: 'white', fontWeight: '800' }}>Pro</h2>
                        <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '0 0 20px 0' }}>Para clínicas estruturadas que precisam de controle total e auditoria.</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white' }}>R$ 297</span>
                            <span style={{ color: '#94a3b8', fontWeight: '500' }}>/mês</span>
                        </div>
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
                        {['Tudo do plano Starter', 'Equipe Ilimitada', 'Chat Interno Seguro', 'Relatórios Gerenciais em PDF', 'Log de Auditoria Completo', 'Suporte Prioritário (WhatsApp)'].map((item, index) => (
                            <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#f8fafc', fontSize: '0.95rem', fontWeight: '500' }}>
                                <Shield size={18} color="#6C63FF" /> {item}
                            </li>
                        ))}
                    </ul>

                    <a href={linkAsaasPro} target="_blank" rel="noopener noreferrer" style={{ background: '#6C63FF', color: 'white', textAlign: 'center', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', transition: '0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} onMouseOver={(e) => { e.currentTarget.style.background = '#5b54e5' }} onMouseOut={(e) => { e.currentTarget.style.background = '#6C63FF' }}>
                        Assinar Pro <ArrowRight size={18} />
                    </a>
                </div>

            </div>

            <div style={{ textAlign: 'center', marginTop: '40px', color: '#94a3b8', fontSize: '0.9rem' }}>
                Pagamento seguro e criptografado via <strong>Asaas</strong>. Cancele quando quiser.
            </div>

            <style>{`
                @media (max-width: 768px) {
                    div[style*="transform: scale(1.05)"] {
                        transform: scale(1) !important;
                    }
                }
            `}</style>
        </div>
    );
}

export default Planos;