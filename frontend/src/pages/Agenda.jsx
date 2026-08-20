import { useState } from "react";
// Se quiser fazer o redirecionamento para a tela de pagamento depois, descomente a linha abaixo:
// import { useNavigate } from "react-router-dom"; 
import { useCirurgias } from "../context/CirurgiasContext";
import AgendaTable from "../components/agenda/AgendaTable";
import SearchBar from "../components/agenda/SearchBar";
import CirurgiaModal from "../components/modal/CirurgiaModal";

function Agenda() {
    const [pesquisa, setPesquisa] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [cirurgiaEditando, setCirurgiaEditando] = useState(null);
    
    // const navigate = useNavigate(); // Descomente quando for criar a tela de Planos

    // Puxamos as novas funções poderosas do nosso Contexto!
    const { listaCirurgias, adicionarCirurgia, editarCirurgia, excluirCirurgia } = useCirurgias();

    // Filtra pelo nome do paciente
    const cirurgiasFiltradas = listaCirurgias.filter((cirurgia) =>
        cirurgia.paciente?.toLowerCase().includes(pesquisa.toLowerCase())
    );

    return (
        <>
            <h1>Agenda de Cirurgias</h1>
            <br />
            
            <SearchBar
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
                <button
                    onClick={() => {
                        // 🛑 A BARREIRA (PAYWALL) COMEÇA AQUI 🛑
                        // Se o plano for grátis e ele já tiver 10 cirurgias, barra!
                        // No futuro, você checará algo como: if (usuario.plano === 'free' && listaCirurgias.length >= 10)
                        if (listaCirurgias.length >= 10) {
                            alert("🔒 Limite do Plano Grátis atingido!\n\nVocê já possui 10 cirurgias cadastradas. Assine o plano Premium para cadastros ilimitados.");
                            
                            // Quando você tiver a tela de checkout/planos criada, você usa isso:
                            // navigate('/planos'); 
                            
                            return; // O 'return' expulsa o usuário da função. O modal não vai abrir!
                        }
                        // 🟢 SE PASSOU DA BARREIRA, CONTINUA NORMALMENTE 🟢

                        setCirurgiaEditando(null); // Garante que o modal abra vazio
                        setModalOpen(true);
                    }}
                    style={{
                        background: "#6C63FF", color: "#fff", border: "none",
                        padding: "12px 20px", borderRadius: "10px", fontWeight: "600", cursor: "pointer"
                    }}
                >
                    + Nova Cirurgia
                </button>
            </div>
            <br />

            <AgendaTable
                cirurgias={cirurgiasFiltradas}
                
                onStatusChange={(id, novoStatus) => {
                    editarCirurgia(id, { status: novoStatus });
                }}
                
                onDelete={(id) => {
                    excluirCirurgia(id);
                }}
                
                onEdit={(cirurgia) => {
                    setCirurgiaEditando(cirurgia);
                    setModalOpen(true);
                }}
            />

            <CirurgiaModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setCirurgiaEditando(null);
                }}
                cirurgia={cirurgiaEditando}
                
                // 👇 A MÁGICA ACONTECE AQUI: Agora a agenda espera o upload terminar!
                onSave={async (dados) => {
                    try {
                        if (cirurgiaEditando) {
                            await editarCirurgia(cirurgiaEditando.id, dados);
                        } else {
                            await adicionarCirurgia(dados);
                        }
                        // Só fecha o modal DEPOIS que o banco confirmar o salvamento!
                        setModalOpen(false);
                        setCirurgiaEditando(null);
                    } catch (erro) {
                        console.error("Falha na gravação:", erro);
                    }
                }}
            />
        </>
    );
}

export default Agenda;