import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { Building2, UserCircle, CheckCircle2, ArrowRight, Activity, ChevronRight, UploadCloud } from 'lucide-react';

function Onboarding() {
    const { usuario } = useAuth();
    const navigate = useNavigate();
    const [passo, setPasso] = useState(1);
    const [loading, setLoading] = useState(false);

    // Estados do Formulário
    const [clinicaNome, setClinicaNome] = useState('');
    const [cargo, setCargo] = useState('');

    const handleProximoPasso = () => {
        if (passo === 1 && !clinicaNome.trim()) return alert("Digite o nome da clínica/equipe.");
        if (passo === 2 && !cargo) return alert("Selecione sua função.");
        setPasso(passo + 1);
    };

    const handleFinalizar = async () => {
        setLoading(true);
        try {
            // 1. Atualiza o perfil do usuário no banco de dados com os dados do Onboarding
            const { error } = await supabase
                .from('profiles')
                .update({ 
                    clinica_nome: clinicaNome,
                    cargo: cargo,
                    onboarding_concluido: true 
                })
                .eq('id', usuario.id);

            if (error) throw error;

            // 2. Joga o usuário para o Dashboard, agora com tudo configurado!
            navigate('/dashboard');

        } catch (error) {
            console.error("Erro ao finalizar onboarding:", error);
            alert("Erro ao configurar sua conta. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Montserrat', 'Inter', sans-serif" }}>
            
            <div style={{ background: 'white', width: '100%', maxWidth: '600px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', padding: '40px', margin: '20px', border: '1px solid #e2e8f0' }}>
                
                {/* 🌟 BARRA DE PROGRESSO 🌟 */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '40px' }}>
                    {[1, 2, 3].map(item => (
                        <div key={item} style={{ width: '33%', height: '6px', borderRadius: '3px', background: passo >= item ? '#6C63FF' : '#e2e8f0', transition: '0.3s ease' }} />
                    ))}
                </div>

                {/* ========================================== */}
                {/* PASSO 1: NOME DA CLÍNICA / EQUIPE          */}
                {/* ========================================== */}
                {passo === 1 && (
                    <div style={{ animation: 'fadeIn 0.5s' }}>
                        <div style={{ width: '60px', height: '60px', background: '#eff6ff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                            <Building2 size={30} color="#3b82f6" />
                        </div>
                        <h1 style={{ fontSize: '1.8rem', color: '#0f172a', fontWeight: '800', marginBottom: '10px' }}>Bem-vindo ao SurgiFlow! 🚀</h1>
                        <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '30px', lineHeight: '1.5' }}>
                            Estamos felizes em ter você aqui. Para começar a organizar sua agenda, como devemos chamar o seu ambiente de trabalho?
                        </p>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>
                                Nome da Clínica ou Equipe Cirúrgica
                            </label>
                            <input 
                                type="text" 
                                placeholder="Ex: Clínica Sanora, Equipe Dr. Silva..." 
                                value={clinicaNome}
                                onChange={(e) => setClinicaNome(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleProximoPasso()}
                                style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '2px solid #cbd5e1', fontSize: '1.05rem', outline: 'none', transition: '0.2s', boxSizing: 'border-box' }}
                                onFocus={(e) => e.target.style.borderColor = '#6C63FF'}
                                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                                autoFocus
                            />
                        </div>

                        <button onClick={handleProximoPasso} style={{ width: '100%', background: '#1e293b', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '1.05rem', fontWeight: '700', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', transition: '0.2s' }}>
                            Continuar <ArrowRight size={20} />
                        </button>
                    </div>
                )}

                {/* ========================================== */}
                {/* PASSO 2: FUNÇÃO DO USUÁRIO                 */}
                {/* ========================================== */}
                {passo === 2 && (
                    <div style={{ animation: 'fadeIn 0.5s' }}>
                        <div style={{ width: '60px', height: '60px', background: '#fef3c7', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                            <UserCircle size={30} color="#f59e0b" />
                        </div>
                        <h1 style={{ fontSize: '1.8rem', color: '#0f172a', fontWeight: '800', marginBottom: '10px' }}>Qual é o seu papel?</h1>
                        <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '30px', lineHeight: '1.5' }}>
                            Isso nos ajuda a personalizar sua experiência no {clinicaNome || 'SurgiFlow'}.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
                            {[
                                { id: 'Cirurgião', desc: 'Realizo os procedimentos' },
                                { id: 'Secretaria/Recepção', desc: 'Agendo e organizo os pacientes' },
                                { id: 'Faturamento/OPME', desc: 'Aprovo orçamentos e materiais' },
                                { id: 'Diretor/Gestor', desc: 'Gerencio a clínica como um todo' }
                            ].map(opcao => (
                                <div 
                                    key={opcao.id}
                                    onClick={() => setCargo(opcao.id)}
                                    style={{ padding: '16px', border: cargo === opcao.id ? '2px solid #6C63FF' : '2px solid #e2e8f0', background: cargo === opcao.id ? '#eff6ff' : 'white', borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.2s' }}
                                >
                                    <div>
                                        <h4 style={{ margin: '0 0 4px 0', color: cargo === opcao.id ? '#6C63FF' : '#1e293b', fontSize: '1rem' }}>{opcao.id}</h4>
                                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{opcao.desc}</span>
                                    </div>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: cargo === opcao.id ? '6px solid #6C63FF' : '2px solid #cbd5e1', background: 'white' }} />
                                </div>
                            ))}
                        </div>

                        <button onClick={handleProximoPasso} disabled={!cargo} style={{ width: '100%', background: cargo ? '#1e293b' : '#cbd5e1', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '1.05rem', fontWeight: '700', cursor: cargo ? 'pointer' : 'not-allowed', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', transition: '0.2s' }}>
                            Continuar <ArrowRight size={20} />
                        </button>
                    </div>
                )}

                {/* ========================================== */}
                {/* PASSO 3: TUDO PRONTO                       */}
                {/* ========================================== */}
                {passo === 3 && (
                    <div style={{ animation: 'fadeIn 0.5s', textAlign: 'center' }}>
                        <div style={{ width: '80px', height: '80px', background: '#ecfdf5', borderRadius: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                            <CheckCircle2 size={40} color="#10b981" />
                        </div>
                        <h1 style={{ fontSize: '1.8rem', color: '#0f172a', fontWeight: '800', marginBottom: '15px' }}>Tudo configurado!</h1>
                        <p style={{ color: '#64748b', fontSize: '1.05rem', marginBottom: '30px', lineHeight: '1.6' }}>
                            Seu ambiente de trabalho <strong>{clinicaNome}</strong> está pronto. A partir de agora, diga adeus ao caos do WhatsApp e aos cancelamentos de última hora.
                        </p>

                        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '30px', textAlign: 'left' }}>
                            <h4 style={{ margin: '0 0 15px 0', color: '#1e293b', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Activity size={18} color="#6C63FF" /> Próximos passos sugeridos:
                            </h4>
                            <ul style={{ margin: 0, paddingLeft: '20px', color: '#475569', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <li>Cadastre seu primeiro paciente ou cirurgia.</li>
                                <li>Configure sua agenda semanal.</li>
                                <li>Convide sua equipe em Configurações.</li>
                            </ul>
                        </div>

                        <button 
                            onClick={handleFinalizar} 
                            disabled={loading}
                            style={{ width: '100%', background: '#6C63FF', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '1.05rem', fontWeight: '700', cursor: loading ? 'wait' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', boxShadow: '0 10px 25px rgba(108, 99, 255, 0.3)', transition: '0.2s' }}
                        >
                            {loading ? 'Preparando Dashboard...' : 'Acessar meu Dashboard'}
                        </button>
                    </div>
                )}

            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

export default Onboarding;