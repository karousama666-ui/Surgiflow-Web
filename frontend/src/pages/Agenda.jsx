import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 NOVO: O "motorista" que leva pra tela de planos
import { useCirurgias } from "../context/CirurgiasContext";
import AgendaTable from "../components/agenda/AgendaTable";
import SearchBar from "../components/agenda/SearchBar";
import CirurgiaModal from "../components/modal/CirurgiaModal";

function Agenda() {
    const [pesquisa, setPesquisa] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [cirurgiaEditando, setCirurgiaEditando] = useState(null);
    
    // 👈 NOVO: Inicializa o "motorista"
    const navigate = useNavigate(); 

    // Puxamos as funções do nosso Contexto
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
                        // 🛑 A BARREIRA (PAYWALL) 🛑
                        if (listaCirurgias.length >= 10) {
                            navigate('/planos'); // 👈 Joga o usuário pra tela de Planos
                            return; // Expulsa da função, não abre o modal
                        }

                        // 🟢 SE PASSOU DA BARREIRA, CONTINUA NORMALMENTE 🟢
                        setCirurgiaEditando(null); 
                        setModalOpen(true);
                    }}
                    style={{
                        background: "#6C63FF", color: "#fff", border: "none",
                        padding: "12px 20px", borderRadius: "10px", fontWeight: "600", cursor: "pointer",
                        boxShadow: "0 4px 10px rgba(108, 99, 255, 0.3)", transition: "0.2s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
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
                    const confirmacao = window.confirm("⚠️ Tem certeza que deseja excluir esta cirurgia? Esta ação não poderá ser desfeita.");
                    if (confirmacao) {
                        excluirCirurgia(id);
                    }
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
                
                onSave={async (dados) => {
                    try {
                        if (cirurgiaEditando) {
                            await editarCirurgia(cirurgiaEditando.id, dados);
                        } else {
                            await adicionarCirurgia(dados);
                        }
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