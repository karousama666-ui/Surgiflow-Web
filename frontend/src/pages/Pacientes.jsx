import { useState } from "react";
import { usePacientes } from "../context/PacientesContext";
import PacienteModal from "../components/modal/PacienteModal";
import { Search, Plus, Pencil, Trash2, UserCircle2, Phone } from "lucide-react";

function Pacientes() {
    const { listaPacientes, adicionarPaciente, editarPaciente, excluirPaciente } = usePacientes();
    
    const [pesquisa, setPesquisa] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [pacienteEditando, setPacienteEditando] = useState(null);

    // Filtra pelo nome, CPF ou telefone
    const pacientesFiltrados = listaPacientes.filter((p) => {
        const termo = pesquisa.toLowerCase();
        return (
            (p.nome && p.nome.toLowerCase().includes(termo)) ||
            (p.cpf && p.cpf.includes(termo)) ||
            (p.telefone && p.telefone.includes(termo))
        );
    });

    const handleAbrirModalNovo = () => {
        setPacienteEditando(null);
        setModalOpen(true);
    };

    const handleAbrirModalEditar = (paciente) => {
        setPacienteEditando(paciente);
        setModalOpen(true);
    };

    const handleSalvar = async (dados) => {
        try {
            if (pacienteEditando) {
                await editarPaciente(pacienteEditando.id, dados);
            } else {
                await adicionarPaciente(dados);
            }
            setModalOpen(false);
        } catch (error) {
            alert("Erro ao salvar paciente. Tente novamente.");
        }
    };

    const handleExcluir = async (id, nome) => {
        if (window.confirm(`Tem certeza que deseja excluir a ficha de ${nome}? Isso não pode ser desfeito.`)) {
            await excluirPaciente(id);
        }
    };

    return (
        <div style={{ paddingBottom: "40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
                <div>
                    <h1 style={{ fontSize: "1.8rem", color: "#1e293b", margin: "0 0 4px 0", fontWeight: "700" }}>Fichas de Pacientes</h1>
                    <p style={{ color: "#64748b", fontSize: "0.95rem", margin: 0 }}>Gerencie o cadastro e histórico da sua base.</p>
                </div>

                <button 
                    onClick={handleAbrirModalNovo}
                    style={{ background: "#6C63FF", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "12px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 12px rgba(108, 99, 255, 0.3)", transition: "0.2s" }}
                    onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                    <Plus size={18} /> Novo Paciente
                </button>
            </div>

            <div style={{ background: "#fff", padding: "20px", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", border: "1px solid #f1f5f9" }}>
                
                {/* Barra de Pesquisa */}
                <div style={{ position: "relative", marginBottom: "20px", maxWidth: "400px" }}>
                    <Search size={18} color="#94a3b8" style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)" }} />
                    <input 
                        type="text" 
                        placeholder="Buscar por nome, CPF ou telefone..." 
                        value={pesquisa}
                        onChange={(e) => setPesquisa(e.target.value)}
                        style={{ width: "100%", padding: "12px 15px 12px 42px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "0.95rem", outline: "none", background: "#f8fafc", color: "#1e293b", boxSizing: "border-box" }}
                    />
                </div>

                {/* Tabela de Pacientes */}
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
                        <thead>
                            <tr style={{ borderBottom: "2px solid #f1f5f9", textAlign: "left" }}>
                                <th style={{ padding: "15px", color: "#64748b", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase" }}>Paciente</th>
                                <th style={{ padding: "15px", color: "#64748b", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase" }}>Contato</th>
                                <th style={{ padding: "15px", color: "#64748b", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase" }}>CPF</th>
                                <th style={{ padding: "15px", color: "#64748b", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", textAlign: "right" }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pacientesFiltrados.length > 0 ? (
                                pacientesFiltrados.map((paciente) => (
                                    <tr key={paciente.id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = "#f8fafc"} onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
                                        
                                        <td style={{ padding: "15px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#e0e7ff", color: "#6C63FF", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "700" }}>
                                                    {paciente.nome ? paciente.nome.charAt(0).toUpperCase() : <UserCircle2 size={20} />}
                                                </div>
                                                <div>
                                                    <span style={{ display: "block", color: "#1e293b", fontWeight: "600", fontSize: "0.95rem" }}>{paciente.nome}</span>
                                                    {paciente.data_nascimento && (
                                                        <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                                                            Nasc: {paciente.data_nascimento.split("-").reverse().join("/")}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <td style={{ padding: "15px", color: "#475569", fontSize: "0.9rem" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                <Phone size={14} color="#94a3b8" /> {paciente.telefone || "Não informado"}
                                            </div>
                                        </td>
                                        
                                        <td style={{ padding: "15px", color: "#475569", fontSize: "0.9rem" }}>
                                            {paciente.cpf || "-"}
                                        </td>
                                        
                                        <td style={{ padding: "15px", textAlign: "right" }}>
                                            <div style={{ display: "inline-flex", gap: "8px" }}>
                                                <button onClick={() => handleAbrirModalEditar(paciente)} style={{ background: "#f1f5f9", color: "#64748b", border: "none", padding: "8px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "0.2s" }} onMouseOver={(e) => { e.currentTarget.style.background = "#e0e7ff"; e.currentTarget.style.color = "#6C63FF"; }} onMouseOut={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#64748b"; }} title="Editar Ficha">
                                                    <Pencil size={16} />
                                                </button>
                                                <button onClick={() => handleExcluir(paciente.id, paciente.nome)} style={{ background: "#f1f5f9", color: "#64748b", border: "none", padding: "8px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "0.2s" }} onMouseOver={(e) => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.color = "#ef4444"; }} onMouseOut={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#64748b"; }} title="Excluir">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ padding: "40px", textAlign: "center", color: "#94a3b8", fontStyle: "italic" }}>
                                        Nenhum paciente encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* RENDERIZA O MODAL AQUI */}
            <PacienteModal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)} 
                onSave={handleSalvar}
                paciente={pacienteEditando}
            />
        </div>
    );
}

export default Pacientes;