import { useState } from "react";
import { useMedicos } from "../context/MedicosContext";
import MedicoForm from "../components/medicos/MedicoForm";
import MedicoCard from "../components/medicos/MedicoCard";

function Medicos() {
    const {
        listaMedicos,
        setListaMedicos
    } = useMedicos();

    const [medicoEditando, setMedicoEditando] = useState(null);

    function handleDelete(id) {
        if (window.confirm("Tem certeza que deseja excluir este médico?")) {
            setListaMedicos(
                listaMedicos.filter(
                    medico => medico.id !== id
                )
            );
        }
    }

    function handleEdit(medico) {
        setMedicoEditando(medico);
        // Opcional: faz a página subir para o formulário aparecer no foco
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <div style={{ 
            maxWidth: "1000px", 
            margin: "0 auto", 
            padding: "20px 20px 50px 20px" 
        }}>
            {/* Título Principal */}
            <h1 style={{ marginBottom: "20px", color: "#1e293b" }}>
                Gerenciamento de Médicos
            </h1>

            {/* Formulário organizado */}
            <MedicoForm
                medicoEditando={medicoEditando}
                setMedicoEditando={setMedicoEditando}
            />

            <br />
            <br />

            {/* Subtítulo da lista */}
            <h2 style={{ 
                marginBottom: "20px", 
                color: "#1e293b",
                borderLeft: "4px solid #6C63FF",
                paddingLeft: "12px"
            }}>
                Médicos cadastrados
            </h2>

            {/* Grid dos Cards */}
            <div
                style={{
                    display: "grid",
                    /* Grid inteligente: se a tela for grande, coloca 2 ou 3 cards lado a lado. 
                       Se for pequena, ele ajusta automaticamente. */
                    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                    gap: "20px"
                }}
            >
                {listaMedicos.length > 0 ? (
                    listaMedicos.map(medico => (
                        <MedicoCard
                            key={medico.id}
                            medico={medico}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    ))
                ) : (
                    <div style={{ 
                        gridColumn: "1 / -1", 
                        textAlign: "center", 
                        padding: "40px", 
                        color: "#94a3b8",
                        background: "#f8fafc",
                        borderRadius: "16px"
                    }}>
                        Nenhum médico cadastrado ainda.
                    </div>
                )}
            </div>
        </div>
    );
}

export default Medicos;