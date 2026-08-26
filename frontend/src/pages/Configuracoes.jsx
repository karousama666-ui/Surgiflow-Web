import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 NOVO: Importamos o motorista
import { supabase } from "../services/supabase"; 
import { useAuth } from '../context/AuthContext'; 
import { User, Building, ShieldCheck, CreditCard, Save, Check, Users, UserPlus, Trash2, ArrowUpCircle } from "lucide-react";
import "./Configuracoes.css";

// ==========================================
// COMPONENTE CUSTOMIZADO: CHECKBOX PREMIUM
// ==========================================
const CustomCheckbox = ({ label, name, checked, onChange }) => {
    return (
        <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", marginBottom: "16px", userSelect: "none" }}>
            <input 
                type="checkbox" name={name} checked={checked} 
                onChange={onChange} style={{ display: "none" }} 
            />
            <div style={{
                width: "22px", height: "22px", borderRadius: "6px",
                background: checked ? "#6C63FF" : "#ffffff",
                border: checked ? "1px solid #6C63FF" : "1px solid #cbd5e1",
                display: "flex", justifyContent: "center", alignItems: "center",
                transition: "all 0.2s ease",
                boxShadow: checked ? "0 2px 8px rgba(108, 99, 255, 0.25)" : "none"
            }}>
                {checked && <Check size={16} color="white" strokeWidth={3} />}
            </div>
            <span style={{ color: "#334155", fontSize: "0.95rem", fontWeight: "600" }}>{label}</span>
        </label>
    );
};

// ==========================================
// TELA PRINCIPAL DE CONFIGURAÇÕES
// ==========================================
function Configuracoes() {
  const { logout } = useAuth(); 
  const navigate = useNavigate(); // 👈 Inicializa o motorista
  
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null); 
  const [membrosEquipe, setMembrosEquipe] = useState([]); 
  const [planoAtual, setPlanoAtual] = useState("free"); 
  const [tagOriginal, setTagOriginal] = useState(""); 
  
  const [novoMembro, setNovoMembro] = useState({ nome: "", email: "", cargo: "", senha: "" }); 

  // STATUS LIMPO
  const [form, setForm] = useState({
    nome: "", cargo: "", registro: "", email: "", telefone: "", empresa: "", cnpj: "",
    notificacoesEmail: true, notificacoesSistema: true, notificacoesWhatsapp: true,
    tag: "" 
  });

  // ==========================================
  // 1. CARREGAR DADOS DO SUPABASE
  // ==========================================
  useEffect(() => {
      async function carregarPerfil() {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
              setUserId(user.id);
              
              // BUSCA O PLANO OFICIAL NA TABELA PERFIS
              const { data: perfilData, error: perfilError } = await supabase
                  .from('perfis')
                  .select('plano')
                  .eq('id', user.id)
                  .single();
              
              if (!perfilError && perfilData) {
                  setPlanoAtual(perfilData.plano || "free");
              } else {
                  setPlanoAtual("free");
              }

              // BUSCA A SURGITAG NA TABELA PROFILES
              const { data: tagData } = await supabase
                  .from('profiles')
                  .select('surgitag')
                  .eq('id', user.id)
                  .single();
              
              let tagAtual = tagData?.surgitag || "";
              setTagOriginal(tagAtual);

              // Carrega os dados do formulário
              setForm(prevForm => ({
                  ...prevForm,
                  email: user.email || "",
                  nome: user.user_metadata?.nome || "",
                  cargo: user.user_metadata?.cargo || "",
                  registro: user.user_metadata?.registro || "",
                  telefone: user.user_metadata?.telefone || "",
                  empresa: user.user_metadata?.organizacao || "", 
                  cnpj: user.user_metadata?.cnpj || "",
                  notificacoesEmail: user.user_metadata?.notificacoesEmail ?? true,
                  notificacoesSistema: user.user_metadata?.notificacoesSistema ?? true,
                  notificacoesWhatsapp: user.user_metadata?.notificacoesWhatsapp ?? true,
                  tag: tagAtual 
              }));

              // Carrega a equipe
              const { data: equipeData } = await supabase
                .from('equipe')
                .select('*')
                .eq('conta_principal_id', user.id);
              
              if (equipeData) setMembrosEquipe(equipeData);
          }
      }
      carregarPerfil();
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  }

  // ==========================================
  // LÓGICA DA EQUIPE (Com Trava de Plano)
  // ==========================================
  async function handleAdicionarMembro() {
      // 🚨 AS TRAVAS DO PAYWALL 🚨
      
      // TRAVA DO PLANO FREE (Só permite 1 usuário: o dono. Logo, 0 membros na equipe)
      if (planoAtual === "free") {
          alert("🔒 Recurso Premium!\n\nFaça o Upgrade para o plano Starter ou Pro na aba de Assinaturas para adicionar usuários à sua equipe.");
          navigate('/planos'); // 👈 Joga pro Paywall
          return;
      }

      // TRAVA DO PLANO STARTER (Até 2 usuários: o dono + 1 membro)
      // Se ele já tiver 1 membro na equipe e tentar adicionar outro, trava!
      if (planoAtual === "starter" && membrosEquipe.length >= 1) {
          alert("🔒 Limite do Plano Starter atingido!\n\nVocê atingiu o limite de 2 acessos (Você + 1). Faça o upgrade para o Clinic Pro para adicionar usuários ilimitados.");
          navigate('/planos'); // 👈 Joga pro Paywall
          return;
      }

      // 🟢 Se passou nas catracas, segue para criar o usuário
      if (!novoMembro.nome || !novoMembro.email || !novoMembro.senha || novoMembro.senha.length < 6) {
          alert("Preencha Nome, E-mail e uma Senha Inicial (mínimo 6 caracteres).");
          return;
      }

      setLoading(true);
      try {
          const { data: authData, error: authError } = await supabase.auth.signUp({
              email: novoMembro.email,
              password: novoMembro.senha,
              options: {
                  data: {
                      nome: novoMembro.nome,
                      cargo: novoMembro.cargo,
                      conta_chefe_id: userId 
                  }
              }
          });

          if (authError) {
              if (authError.message.includes("already registered")) {
                  alert("❌ Este e-mail já está cadastrado no sistema.");
              } else {
                  throw authError;
              }
              return;
          }

          const novoFuncionario = {
              nome: novoMembro.nome,
              email: novoMembro.email,
              cargo: novoMembro.cargo,
              conta_principal_id: userId 
          };

          const { data, error } = await supabase.from('equipe').insert([novoFuncionario]).select();
          if (error) throw error;

          setMembrosEquipe([...membrosEquipe, data[0]]);
          setNovoMembro({ nome: "", email: "", cargo: "", senha: "" }); 
          
          alert(`✅ Membro adicionado com sucesso!\n\nEnvie o acesso para o funcionário:\nLogin: ${novoFuncionario.email}\nSenha: (A senha que você acabou de criar)`);
      } catch (error) {
          console.error("Erro ao adicionar:", error);
          alert("❌ Erro ao salvar membro da equipe.");
      } finally {
          setLoading(false);
      }
  }

  async function handleRemoverMembro(membroId) {
      if(window.confirm("Deseja realmente remover o acesso deste funcionário? Ele não conseguirá mais ver os dados da clínica.")) {
          const { error } = await supabase.from('equipe').delete().eq('id', membroId);
          if(!error) setMembrosEquipe(membrosEquipe.filter(m => m.id !== membroId));
      }
  }

  // ==========================================
  // SALVAR PERFIL E SURGITAG
  // ==========================================
  async function handleSave(e) {
    e.preventDefault();

    if (form.tag.trim() === '') {
        alert("❌ A SurgiTag não pode ser vazia.");
        return;
    }
    if (form.tag.includes(' ')) {
        alert("❌ A SurgiTag não pode conter espaços. Use underline ou letras juntas.");
        return;
    }

    setLoading(true);

    try {
        const { error: authError } = await supabase.auth.updateUser({
            data: { 
                nome: form.nome, cargo: form.cargo, registro: form.registro, telefone: form.telefone,
                organizacao: form.empresa, cnpj: form.cnpj, notificacoesEmail: form.notificacoesEmail,
                notificacoesSistema: form.notificacoesSistema, notificacoesWhatsapp: form.notificacoesWhatsapp
            }
        });
        if (authError) throw authError;

        if (form.tag !== tagOriginal) {
            const { error: tagError } = await supabase
                .from('profiles')
                .upsert({ id: userId, surgitag: form.tag.trim(), nome_completo: form.nome });
            
            if (tagError) {
                if (tagError.code === '23505') { 
                    throw new Error("TAG_DUPLICADA");
                }
                throw tagError;
            }
            setTagOriginal(form.tag.trim());
        }

        alert("✅ Configurações e SurgiTag atualizadas com sucesso!");
    } catch (error) {
        if (error.message === "TAG_DUPLICADA") {
            alert("❌ Essa SurgiTag já está em uso por outro profissional da rede. Por favor, escolha outra.");
        } else {
            alert("❌ Ops! Erro ao salvar as configurações.");
            console.error(error);
        }
    } finally {
        setLoading(false);
    }
  }

  // ESTILOS VISUAIS
  const sectionStyle = {
    background: "#fff", padding: "30px", borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)", border: "1px solid #e2e8f0",
    marginBottom: "25px", fontFamily: "'Montserrat', 'Inter', sans-serif"
  };
  const headerStyle = {
    display: "flex", alignItems: "center", gap: "10px", 
    color: "#1e293b", fontSize: "1.2rem", fontWeight: "700",
    marginBottom: "20px", paddingBottom: "15px", borderBottom: "1px solid #f1f5f9"
  };
  const inputStyle = { 
      width: "100%", padding: "12px", border: "1px solid #cbd5e1", 
      borderRadius: "8px", marginTop: "6px", outline: "none", 
      boxSizing: "border-box", fontSize: "0.95rem", color: "#1e293b", fontFamily: "inherit"
  };

  return (
    <div className="configuracoes-container" style={{ paddingBottom: "40px", maxWidth: "950px", margin: "0 auto", fontFamily: "'Montserrat', 'Inter', sans-serif" }}>
      
      {/* Cabeçalho */}
      <div className="configuracoes-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", color: "#0f172a", margin: "0 0 4px 0", fontWeight: "800" }}>Configurações do Sistema</h1>
          <p style={{ color: "#64748b", fontSize: "0.95rem", margin: 0, fontWeight: "500" }}>Gerencie seu perfil, equipe, segurança e notificações.</p>
        </div>
        <button 
          onClick={handleSave} disabled={loading}
          style={{ background: loading ? "#94a3b8" : "#6C63FF", color: "white", border: "none", borderRadius: "10px", padding: "14px 24px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "0.2s", boxShadow: loading ? "none" : "0 4px 14px rgba(108, 99, 255, 0.3)", fontFamily: "inherit" }}
        >
          <Save size={20} /> {loading ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>

      <form onSubmit={handleSave}>
        
        {/* Seção de Perfil */}
        <div className="config-section" style={sectionStyle}>
          <div style={{ ...headerStyle, justifyContent: "space-between", borderBottom: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <User size={22} color="#6C63FF" /> Perfil Profissional
              </div>
              <button type="button" onClick={logout} style={{ background: "transparent", border: "1px solid #ef4444", color: "#ef4444", padding: "6px 12px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem", transition: "0.2s" }} onMouseOver={(e) => { e.currentTarget.style.background = "#fee2e2" }} onMouseOut={(e) => { e.currentTarget.style.background = "transparent" }}>
                  Sair da Conta (Logout)
              </button>
          </div>
          <div style={{ borderTop: "1px solid #f1f5f9", marginBottom: "20px" }}></div>
          
          <div className="config-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
            <div className="config-field">
              <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Nome Completo</label>
              <input type="text" name="nome" value={form.nome} onChange={handleChange} style={inputStyle} />
            </div>
            
            <div className="config-field">
              <label style={{ fontSize: "0.85rem", fontWeight: "800", color: "#6C63FF" }}>Identidade Única (SurgiTag)</label>
              <input type="text" name="tag" value={form.tag} onChange={handleChange} placeholder="Ex: Carolina#123" style={{ ...inputStyle, border: "2px solid #6C63FF", background: "#f8fafc" }} />
              <span style={{ fontSize: "0.7rem", color: "#94a3b8", display: "block", marginTop: "6px", fontWeight: "500" }}>Sem espaços. Usada para te encontrarem no chat.</span>
            </div>

            <div className="config-field">
              <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Cargo / Especialidade</label>
              <input type="text" name="cargo" value={form.cargo} onChange={handleChange} style={inputStyle} />
            </div>
            <div className="config-field">
              <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Registro (Conselho)</label>
              <input type="text" name="registro" value={form.registro} onChange={handleChange} style={inputStyle} />
            </div>
            <div className="config-field">
              <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>E-mail de Acesso</label>
              <input type="email" name="email" value={form.email} disabled style={{ ...inputStyle, background: "#f1f5f9", cursor: "not-allowed", color: "#94a3b8" }} />
            </div>
            <div className="config-field">
              <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Telefone / WhatsApp</label>
              <input type="text" name="telefone" value={form.telefone} onChange={handleChange} style={inputStyle} />
            </div>
          </div>
        </div>

        {/* 🌟 SEÇÃO: EQUIPE E ACESSOS 🌟 */}
        <div className="config-section" style={sectionStyle}>
          <div style={headerStyle}><Users size={22} color="#10b981" /> Equipe e Acessos</div>
          <p style={{ fontSize: "0.95rem", color: "#64748b", marginBottom: "20px", fontWeight: "500" }}>
            Adicione membros para gerenciarem a agenda e pedidos com você. Ações ficarão registradas na auditoria.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: "15px", marginBottom: "25px", alignItems: "flex-end" }}>
              <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Nome do Membro</label>
                  <input type="text" placeholder="Ex: João Silva" value={novoMembro.nome} onChange={(e) => setNovoMembro({...novoMembro, nome: e.target.value})} style={inputStyle} />
              </div>
              <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>E-mail (Login)</label>
                  <input type="email" placeholder="joao@clinica.com" value={novoMembro.email} onChange={(e) => setNovoMembro({...novoMembro, email: e.target.value})} style={inputStyle} />
              </div>
              <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Cargo</label>
                  <input type="text" placeholder="Ex: Recepção" value={novoMembro.cargo} onChange={(e) => setNovoMembro({...novoMembro, cargo: e.target.value})} style={inputStyle} />
              </div>
              <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Senha Inicial</label>
                  <input type="text" placeholder="Mínimo 6 letras/números" value={novoMembro.senha} onChange={(e) => setNovoMembro({...novoMembro, senha: e.target.value})} style={inputStyle} />
              </div>
              <button 
                  type="button" onClick={handleAdicionarMembro} disabled={loading}
                  style={{ background: "#f8fafc", color: "#6C63FF", border: "1px solid #6C63FF", borderRadius: "8px", padding: "12px 20px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "0.2s", height: "45px" }}
                  onMouseOver={(e) => { e.currentTarget.style.background = "#eff6ff" }}
                  onMouseOut={(e) => { e.currentTarget.style.background = "#f8fafc" }}
              >
                  <UserPlus size={18} /> Adicionar
              </button>
          </div>

          <div style={{ border: "1px solid #e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
              {membrosEquipe.length === 0 ? (
                  <div style={{ padding: "30px", textAlign: "center", color: "#94a3b8", fontWeight: "500", background: "#f8fafc" }}>
                      Você ainda não adicionou nenhum membro à sua equipe.
                  </div>
              ) : (
                  membrosEquipe.map((membro) => (
                      <div key={membro.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 20px", borderBottom: "1px solid #f1f5f9", background: "white" }}>
                          <div style={{ display: "flex", flexDirection: "column" }}>
                              <span style={{ fontWeight: "700", color: "#1e293b", fontSize: "1rem" }}>{membro.nome}</span>
                              <span style={{ color: "#64748b", fontSize: "0.85rem" }}>{membro.email} • {membro.cargo}</span>
                          </div>
                          <button 
                              type="button" onClick={() => handleRemoverMembro(membro.id)} title="Remover acesso"
                              style={{ background: "transparent", color: "#ef4444", border: "none", cursor: "pointer", padding: "8px", borderRadius: "6px", display: "flex", alignItems: "center", transition: "0.2s" }}
                              onMouseOver={(e) => { e.currentTarget.style.background = "#fee2e2" }}
                              onMouseOut={(e) => { e.currentTarget.style.background = "transparent" }}
                          >
                              <Trash2 size={18} />
                          </button>
                      </div>
                  ))
              )}
          </div>
        </div>

        {/* Seção de Empresa / Organização */}
        <div className="config-section" style={sectionStyle}>
          <div style={headerStyle}><Building size={22} color="#10b981" /> Dados da Organização</div>
          <div className="config-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
            <div className="config-field">
              <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Nome da Organização / Marca</label>
              <input type="text" name="empresa" value={form.empresa} onChange={handleChange} style={inputStyle} />
            </div>
            <div className="config-field">
              <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>CNPJ</label>
              <input type="text" name="cnpj" value={form.cnpj} onChange={handleChange} style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Seção de Segurança e Notificações */}
        <div className="config-section" style={sectionStyle}>
          <div style={headerStyle}><ShieldCheck size={22} color="#6C63FF" /> Segurança e Notificações</div>
          <p style={{ fontSize: "0.95rem", color: "#64748b", marginBottom: "25px", fontWeight: "500" }}>Configure os alertas e ferramentas de comunicação da sua plataforma.</p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <CustomCheckbox label="Exibir alertas visuais de OPME pendente no Dashboard" name="notificacoesSistema" checked={form.notificacoesSistema} onChange={handleChange} />
            <CustomCheckbox label="Habilitar botão de notificação via WhatsApp para pacientes na Agenda" name="notificacoesWhatsapp" checked={form.notificacoesWhatsapp} onChange={handleChange} />
            <CustomCheckbox label="Receber relatório semanal de cirurgias por e-mail" name="notificacoesEmail" checked={form.notificacoesEmail} onChange={handleChange} />
          </div>
        </div>

        {/* 💳 SEÇÃO DE PLANOS (NOVO LAYOUT DE UPGRADE) 💳 */}
        <div className="config-section" style={sectionStyle}>
          <div style={headerStyle}><CreditCard size={22} color="#6C63FF" /> Minha Assinatura</div>
          
          <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "12px", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
              <div>
                  <p style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: "600", marginBottom: "5px" }}>Plano Atual</p>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#1e293b", textTransform: "capitalize", margin: 0 }}>
                      SurgiFlow {planoAtual}
                  </h3>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#10b981", background: "#ecfdf5", padding: "8px 16px", borderRadius: "20px", fontWeight: "700", border: "1px solid #a7f3d0" }}>
                  <ShieldCheck size={20} /> Conta Ativa
              </div>
          </div>

          <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#1e293b", marginBottom: "15px" }}>Precisa de mais recursos? Faça um Upgrade:</h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              
              {/* Box Upgrade Starter */}
              <div style={{ border: "2px solid #e2e8f0", borderRadius: "12px", padding: "24px", transition: "0.2s" }} onMouseOver={(e) => e.currentTarget.style.borderColor = "#6C63FF"} onMouseOut={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}>
                  <h4 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#1e293b", marginBottom: "10px" }}>Starter (R$ 149/mês)</h4>
                  <ul style={{ listStyle: "none", padding: 0, color: "#475569", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.9rem", marginBottom: "20px", fontWeight: "500" }}>
                      <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><Check size={16} color="#6C63FF" strokeWidth={3} /> Até 10 Médicos</li>
                      <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><Check size={16} color="#6C63FF" strokeWidth={3} /> Pacientes Ilimitados</li>
                      <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><Check size={16} color="#6C63FF" strokeWidth={3} /> 2 Usuários (Acessos)</li>
                  </ul>
                  <button type="button" onClick={() => navigate('/planos')} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "#6C63FF", color: "white", padding: "12px", border: "none", cursor: "pointer", borderRadius: "8px", fontWeight: "700" }}>
                      <ArrowUpCircle size={18} /> Assinar Starter
                  </button>
              </div>

              {/* Box Upgrade Pro */}
              <div style={{ border: "2px solid #e2e8f0", borderRadius: "12px", padding: "24px", background: "#0f172a", color: "white" }}>
                  <h4 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "10px" }}>Clinic Pro (R$ 399/mês)</h4>
                  <ul style={{ listStyle: "none", padding: 0, color: "#cbd5e1", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.9rem", marginBottom: "20px", fontWeight: "500" }}>
                      <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><Check size={16} color="#10b981" strokeWidth={3} /> Médicos Ilimitados</li>
                      <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><Check size={16} color="#10b981" strokeWidth={3} /> Usuários Ilimitados</li>
                      <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><Check size={16} color="#10b981" strokeWidth={3} /> Gestão Colaborativa</li>
                  </ul>
                  <button type="button" onClick={() => navigate('/planos')} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "white", color: "#0f172a", padding: "12px", border: "none", cursor: "pointer", borderRadius: "8px", fontWeight: "800" }}>
                      <ArrowUpCircle size={18} /> Assinar Clinic Pro
                  </button>
              </div>
          </div>
        </div>

      </form>
    </div>
  );
}

export default Configuracoes;