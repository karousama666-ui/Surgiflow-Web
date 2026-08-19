import { useState } from "react";
import { useCirurgias } from "../context/CirurgiasContext";
import AgendaTable from "../components/agenda/AgendaTable";
import SearchBar from "../components/agenda/SearchBar";
import CirurgiaModal from "../components/modal/CirurgiaModal";

function Agenda() {
    const [pesquisa, setPesquisa] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [cirurgiaEditando, setCirurgiaEditando] = useState(null);
    
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
                
                // MUDAR STATUS AGORA VAI DIRETO PRO BANCO
                onStatusChange={(id, novoStatus) => {
                    editarCirurgia(id, { status: novoStatus });
                }}
                
                // DELETAR AGORA VAI DIRETO PRO BANCO
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
                
                // SALVAR OU EDITAR AGORA VAI DIRETO PRO BANCO
                onSave={(dados) => {
                    if (cirurgiaEditando) {
                        editarCirurgia(cirurgiaEditando.id, dados);
                    } else {
                        adicionarCirurgia(dados);
                    }
                    setModalOpen(false);
                    setCirurgiaEditando(null);
                }}
            />
        </>
    );
}

export default Agenda;