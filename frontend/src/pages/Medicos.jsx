import { useState, useEffect } from "react";
import { supabase } from "../services/supabase"; // Importe a conexão com o Supabase
import { useMedicos } from "../context/MedicosContext";
import MedicoModal from "../components/modal/MedicoModal";
import { Search, Plus, Pencil, Trash2, Phone, Stethoscope, MessageCircle } from "lucide-react";

function Medicos() {
    const { listaMedicos, adicionarMedico, editarMedico, excluirMedico } = useMedicos();
    
    const [pesquisa, setPesquisa] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [medicoEditando, setMedicoEditando] = useState(null);
    
    // 👇 Estado para guardar o plano do usuário
    const [planoAtual, setPlanoAtual] = useState("free"); 

    // 👇 Busca o plano atual do usuário no banco de dados assim que a tela abre
    useEffect(() => {
        async function carregarPlano() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: perfilData } = await supabase
                    .from('perfis')
                    .select('plano')
                    .eq('id', user.id)
                    .single();
                
                if (perfilData) {
                    setPlanoAtual(perfilData.plano || 'free');
                }
            }
        }
        carregarPlano();
    }, []);

    const medicosFiltrados = listaMedicos?.filter((m) => {
        const termo = pesquisa.toLowerCase();
        return (
            (m.nome && m.nome.toLowerCase().includes(termo)) ||
            (m.crm && m.crm.toLowerCase().includes(termo)) ||
            (m.especialidade && m.especialidade.toLowerCase().includes(termo))
        );
    }) || [];

    const handleAbrirModalNovo = () => {
        // 🚨 TRAVAS DE LIMITES POR PLANO 🚨
        if (planoAtual === 'free' && listaMedicos.length >= 1) {
            alert("🔒 Limite do Plano Free atingido!\n\nVocê já tem 1 médico cadastrado. Faça o upgrade para o plano Starter na tela de Configurações para adicionar até 10 médicos.");
            return;
        }

        if (planoAtual === 'starter' && listaMedicos.length >= 10) {
            alert("🔒 Limite do Plano Starter atingido!\n\nVocê atingiu o limite de 10 médicos. Faça o upgrade para o Clinic Pro na tela de Configurações para cadastros ilimitados.");
            return;
        }

        // Se passou pelas travas, abre o modal normalmente
        setMedicoEditando(null);
        setModalOpen(true);
    };

    const handleAbrirModalEditar = (medico) => {
        setMedicoEditando(medico);
        setModalOpen(true);
    };

    const handleSalvar = async (dados) => {
        try {
            if (medicoEditando) {
                await editarMedico(medicoEditando.id, dados);
            } else {
                await adicionarMedico(dados);
            }
            setModalOpen(false);
        } catch (error) {
            alert("Erro ao salvar médico. Tente novamente.");
        }
    };

    const handleExcluir = async (id, nome) => {
        if (window.confirm(`⚠️ Atenção: Deseja realmente excluir a ficha do(a) ${nome}? Cirurgias atreladas a este médico poderão ficar sem responsável.`)) {
            await excluirMedico(id);
        }
    };

    const chamarNoWhatsApp = (telefone) => {
        const numeroLimpo = telefone.replace(/\D/g, "");
        window.open(`https://wa.me/55${numeroLimpo}`, "_blank");
    };

    return (
        <div style={{ paddingBottom: "40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
                <div>
                    <h1 style={{ fontSize: "1.8rem", color: "#1e293b", margin: "0 0 4px 0", fontWeight: "700" }}>Corpo Clínico</h1>
                    <p style={{ color: "#64748b", fontSize: "0.95rem", margin: 0 }}>Gerencie o cadastro dos cirurgiões e contatos da equipe.</p>
                </div>

                <button 
                    onClick={handleAbrirModalNovo}
                    style={{ background: "#6C63FF", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "12px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 12px rgba(108, 99, 255, 0.3)", transition: "0.2s" }}
                    onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                    <Plus size={18} /> Novo Médico
                </button>
            </div>

            <div style={{ background: "#fff", padding: "20px", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", border: "1px solid #f1f5f9" }}>
                
                {/* Barra de Pesquisa */}
                <div style={{ position: "relative", marginBottom: "20px", maxWidth: "400px" }}>
                    <Search size={18} color="#94a3b8" style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)" }} />
                    <input 
                        type="text" 
                        placeholder="Buscar por nome, CRM ou especialidade..." 
                        value={pesquisa}
                        onChange={(e) => setPesquisa(e.target.value)}
                        style={{ width: "100%", padding: "12px 15px 12px 42px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "0.95rem", outline: "none", background: "#f8fafc", color: "#1e293b", boxSizing: "border-box" }}
                    />
                </div>

                {/* Tabela de Médicos */}
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
                        <thead>
                            <tr style={{ borderBottom: "2px solid #f1f5f9", textAlign: "left" }}>
                                <th style={{ padding: "15px", color: "#64748b", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase" }}>Médico</th>
                                <th style={{ padding: "15px", color: "#64748b", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase" }}>Contato</th>
                                <th style={{ padding: "15px", color: "#64748b", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase" }}>Especialidade</th>
                                <th style={{ padding: "15px", color: "#64748b", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", textAlign: "right" }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicosFiltrados.length > 0 ? (
                                medicosFiltrados.map((medico) => (
                                    <tr key={medico.id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = "#f8fafc"} onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
                                        
                                        <td style={{ padding: "15px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#eff6ff", color: "#3b82f6", display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid #bfdbfe" }}>
                                                    <Stethoscope size={20} />
                                                </div>
                                                <div>
                                                    <span style={{ display: "block", color: "#1e293b", fontWeight: "700", fontSize: "0.95rem" }}>{medico.nome}</span>
                                                    <span style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: "500" }}>
                                                        CRM: {medico.crm || "Não informado"}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <td style={{ padding: "15px", color: "#475569", fontSize: "0.9rem" }}>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                    <Phone size={14} color="#94a3b8" /> {medico.telefone || "-"}
                                                </div>
                                                {medico.email && (
                                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "#64748b" }}>
                                                        {medico.email}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        
                                        <td style={{ padding: "15px", color: "#475569", fontSize: "0.9rem", fontWeight: "500" }}>
                                            {medico.especialidade || "-"}
                                        </td>
                                        
                                        <td style={{ padding: "15px", textAlign: "right" }}>
                                            <div style={{ display: "inline-flex", gap: "8px" }}>
                                                {/* Botão de WhatsApp */}
                                                {medico.telefone && (
                                                    <button onClick={() => chamarNoWhatsApp(medico.telefone)} style={{ background: "#dcfce7", color: "#16a34a", border: "1px solid #bbf7d0", padding: "8px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "0.2s" }} onMouseOver={(e) => { e.currentTarget.style.background = "#bbf7d0"; }} onMouseOut={(e) => { e.currentTarget.style.background = "#dcfce7"; }} title="Falar no WhatsApp">
                                                        <MessageCircle size={16} />
                                                    </button>
                                                )}

                                                <button onClick={() => handleAbrirModalEditar(medico)} style={{ background: "#f1f5f9", color: "#64748b", border: "none", padding: "8px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "0.2s" }} onMouseOver={(e) => { e.currentTarget.style.background = "#e0e7ff"; e.currentTarget.style.color = "#6C63FF"; }} onMouseOut={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#64748b"; }} title="Editar Médico">
                                                    <Pencil size={16} />
                                                </button>
                                                <button onClick={() => handleExcluir(medico.id, medico.nome)} style={{ background: "#f1f5f9", color: "#64748b", border: "none", padding: "8px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "0.2s" }} onMouseOver={(e) => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.color = "#ef4444"; }} onMouseOut={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#64748b"; }} title="Excluir">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ padding: "40px", textAlign: "center", color: "#94a3b8", fontStyle: "italic" }}>
                                        Nenhum médico encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <MedicoModal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)} 
                onSave={handleSalvar}
                medico={medicoEditando}
            />
        </div>
    );
}

export default Medicos;