import { useState, useEffect } from "react";
import Modal from "./Modal";
import NovaCirurgiaForm from "./NovaCirurgiaForm";
import { supabase } from "../../services/supabase"; // Cuidado com o caminho!
import { History, FileEdit, Clock } from "lucide-react";

function CirurgiaModal({ isOpen, onClose, cirurgia, onSave }) {
    // Estado para controlar qual aba está aberta
    const [abaAtiva, setAbaAtiva] = useState("dados"); // "dados" ou "historico"
    const [historico, setHistorico] = useState([]);
    const [carregandoHistorico, setCarregandoHistorico] = useState(false);

    // Reseta a aba para "dados" sempre que o modal fechar ou abrir
    useEffect(() => {
        if (isOpen) {
            setAbaAtiva("dados");
        }
    }, [isOpen]);

    // Busca o histórico no Supabase quando o usuário clica na aba "Histórico"
    useEffect(() => {
        if (abaAtiva === "historico" && cirurgia?.id) {
            buscarHistorico();
        }
    }, [abaAtiva, cirurgia]);

    async function buscarHistorico() {
        setCarregandoHistorico(true);
        try {
            const { data, error } = await supabase
                .from('historico_cirurgias')
                .select('*')
                .eq('cirurgia_id', cirurgia.id)
                .order('created_at', { ascending: false }); // Do mais recente para o mais antigo

            if (error) throw error;
            setHistorico(data || []);
        } catch (error) {
            console.error("Erro ao buscar histórico:", error);
        } finally {
            setCarregandoHistorico(false);
        }
    }

    // Função "Interceptadora" de Salvamento (Gera o rastro na auditoria)
    const handleSalvarComAuditoria = async (dadosDoFormulario) => {
        try {
            // 1. Descobre quem está logado fazendo a alteração
            const { data: { user } } = await supabase.auth.getUser();
            const nomeUsuario = user?.user_metadata?.nome || user?.email || "Usuário do Sistema";

            // 2. Define qual é a ação que está sendo registrada
            let acaoRealizada = "Criou a cirurgia";
            if (cirurgia) {
                // Se já existia, tenta descobrir o que mudou (Exemplo simples focado no status)
                if (dadosDoFormulario.status !== cirurgia.status) {
                    acaoRealizada = `Alterou o status de '${cirurgia.status}' para '${dadosDoFormulario.status}'`;
                } else {
                    acaoRealizada = "Editou os dados / anexos da cirurgia";
                }
            }

            // 3. Salva a cirurgia normalmente (chamando a função do pai que você já tinha)
            await onSave(dadosDoFormulario);

            // 4. (NOVIDADE) Salva o rastro na tabela de histórico!
            // ATENÇÃO: Só grava no histórico se for uma EDIÇÃO (pois na criação o ID da cirurgia ainda não existe nesse momento)
            if (cirurgia?.id) {
                await supabase.from('historico_cirurgias').insert([{
                    cirurgia_id: cirurgia.id,
                    usuario_nome: nomeUsuario,
                    acao: acaoRealizada
                }]);
            }

        } catch (error) {
            console.error("Erro no fluxo de salvamento:", error);
        }
    };

    // Estilos das Abas
    const tabStyle = (ativa) => ({
        flex: 1, padding: "12px", textAlign: "center", cursor: "pointer",
        fontWeight: "600", fontSize: "0.95rem", transition: "0.2s",
        borderBottom: ativa ? "2px solid #6C63FF" : "2px solid transparent",
        color: ativa ? "#6C63FF" : "#64748b",
        display: "flex", justifyContent: "center", alignItems: "center", gap: "8px"
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                
                <h2 style={{ color: "#1e293b", marginTop: 0, marginBottom: "15px" }}>
                    {cirurgia ? "Gerenciar Cirurgia" : "Nova Cirurgia"}
                </h2>

                {/* --- NAVEGAÇÃO DE ABAS (Só aparece se estiver editando) --- */}
                {cirurgia && (
                    <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", marginBottom: "20px" }}>
                        <div style={tabStyle(abaAtiva === "dados")} onClick={() => setAbaAtiva("dados")}>
                            <FileEdit size={18} /> Dados da Cirurgia
                        </div>
                        <div style={tabStyle(abaAtiva === "historico")} onClick={() => setAbaAtiva("historico")}>
                            <History size={18} /> Trilha de Auditoria
                        </div>
                    </div>
                )}

                {/* --- CONTEÚDO DA ABA: DADOS --- */}
                <div style={{ display: abaAtiva === "dados" ? "block" : "none" }}>
                    <NovaCirurgiaForm
                        dados={cirurgia}
                        onSave={handleSalvarComAuditoria} // Passa pela nossa função que "espiona" a ação
                    />
                </div>

                {/* --- CONTEÚDO DA ABA: HISTÓRICO --- */}
                <div style={{ display: abaAtiva === "historico" ? "block" : "none", maxHeight: "60vh", overflowY: "auto", paddingRight: "10px" }}>
                    {carregandoHistorico ? (
                        <p style={{ textAlign: "center", color: "#64748b" }}>Buscando registros...</p>
                    ) : historico.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "30px", background: "#f8fafc", borderRadius: "10px", border: "1px dashed #cbd5e1" }}>
                            <Clock size={32} color="#94a3b8" style={{ marginBottom: "10px" }} />
                            <p style={{ margin: 0, color: "#475569", fontWeight: "500" }}>Nenhum histórico registrado ainda.</p>
                            <p style={{ margin: "5px 0 0 0", fontSize: "0.85rem", color: "#94a3b8" }}>As próximas alterações aparecerão aqui.</p>
                        </div>
                    ) : (
                        <div style={{ position: "relative", paddingLeft: "15px" }}>
                            {/* Linha vertical conectora */}
                            <div style={{ position: "absolute", left: "22px", top: "10px", bottom: "10px", width: "2px", background: "#e2e8f0", zIndex: 0 }}></div>

                            {historico.map((item, index) => {
                                // Formata a data para padrão brasileiro
                                const dataFormatada = new Date(item.created_at).toLocaleString('pt-BR', { 
                                    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                                });

                                return (
                                    <div key={index} style={{ display: "flex", gap: "15px", marginBottom: "20px", position: "relative", zIndex: 1 }}>
                                        {/* Bolinha da timeline */}
                                        <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#6C63FF", border: "4px solid #fff", marginTop: "4px", flexShrink: 0, boxShadow: "0 0 0 1px #e2e8f0" }}></div>
                                        
                                        {/* Card de conteúdo */}
                                        <div style={{ flex: 1, background: "#f8fafc", padding: "12px 15px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                                                <span style={{ fontWeight: "700", color: "#1e293b", fontSize: "0.9rem" }}>{item.usuario_nome}</span>
                                                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{dataFormatada}</span>
                                            </div>
                                            <p style={{ margin: 0, color: "#475569", fontSize: "0.9rem" }}>{item.acao}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </Modal>
    );
}

export default CirurgiaModal;