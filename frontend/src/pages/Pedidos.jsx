import { useCirurgias } from "../context/CirurgiasContext";
import { usePedidos } from "../context/PedidosContext"; // Importamos o cérebro dos pedidos!
import PedidoCard from "../components/pedidos/PedidoCard";
import PedidoPreview from "../components/pedidos/PedidoPreview";
import "./Pedidos.css";
import { useState } from "react";

function Pedidos() {
    const { listaCirurgias } = useCirurgias();
    const { listaPedidos } = usePedidos(); // Puxa os dados reais da tabela "pedidos"

    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    
    const [pesquisa, setPesquisa] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("");
    const [filtroHospital, setFiltroHospital] = useState("");
    const [filtroMedico, setFiltroMedico] = useState("");

    // Ajustado para ler o formato do Supabase (ex: "2026-08-18 19:00")
    function converterData(dataCirurgia) {
        if (!dataCirurgia) return 0;
        const apenasData = dataCirurgia.split(" ")[0]; 
        return new Date(apenasData).getTime();
    }

    // Pega o nome do médico direto do relacionamento do banco
    function obterNomeMedico(cirurgia) {
        return cirurgia.medicos && cirurgia.medicos.nome 
            ? cirurgia.medicos.nome 
            : "Médico não informado";
    }

    const hospitais = [...new Set(listaCirurgias.map(c => c.hospital).filter(Boolean))];
    const medicos = [...new Set(listaCirurgias.map(c => obterNomeMedico(c)).filter(Boolean))];

    const pedidosFiltrados = listaCirurgias
        .filter(cirurgia => {
            const paciente = cirurgia.paciente?.toLowerCase() || "";
            const busca = pesquisa.toLowerCase();
            const nomeMedico = obterNomeMedico(cirurgia);

            const correspondePesquisa = paciente.includes(busca);
            const correspondeStatus = filtroStatus === "" || cirurgia.status === filtroStatus;
            const correspondeHospital = filtroHospital === "" || cirurgia.hospital === filtroHospital;
            const correspondeMedico = filtroMedico === "" || nomeMedico === filtroMedico;

            return correspondePesquisa && correspondeStatus && correspondeHospital && correspondeMedico;
        })
        .sort((a, b) => converterData(b.data_cirurgia) - converterData(a.data_cirurgia));

    return (
        <>
            <h1>Pedidos Cirúrgicos</h1>
            <br />

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "12px", marginBottom: "25px" }}>
                <input
                    type="text"
                    placeholder="🔎 Buscar paciente..."
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    style={{ padding: "12px 15px", border: "1px solid #DDD", borderRadius: "10px", fontSize: "14px" }}
                />
                
                <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} style={{ padding: "12px", border: "1px solid #DDD", borderRadius: "10px" }}>
                    <option value="">Todos os status</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Confirmada">Confirmada</option>
                    <option value="Finalizada">Finalizada</option>
                    <option value="Cancelada">Cancelada</option>
                </select>

                <select value={filtroHospital} onChange={(e) => setFiltroHospital(e.target.value)} style={{ padding: "12px", border: "1px solid #DDD", borderRadius: "10px" }}>
                    <option value="">Todos os hospitais</option>
                    {hospitais.map(hospital => (
                        <option key={hospital} value={hospital}>{hospital}</option>
                    ))}
                </select>

                <select value={filtroMedico} onChange={(e) => setFiltroMedico(e.target.value)} style={{ padding: "12px", border: "1px solid #DDD", borderRadius: "10px" }}>
                    <option value="">Todos os médicos</option>
                    {medicos.map(medico => (
                        <option key={medico} value={medico}>{medico}</option>
                    ))}
                </select>
            </div>

            <div style={{ marginBottom: "20px", color: "#777", fontSize: "14px" }}>
                {pedidosFiltrados.length} {pedidosFiltrados.length === 1 ? "pedido encontrado" : "pedidos encontrados"}
            </div>

            <div className="pedidos-grid">
                {pedidosFiltrados.length === 0 ? (
                    <div style={{ background: "#fff", padding: "30px", borderRadius: "16px", textAlign: "center", color: "#777" }}>
                        Nenhum pedido encontrado.
                    </div>
                ) : (
                    pedidosFiltrados.map((cirurgia) => {
                        // Cruza os dados: encontra o pedido (OPME) no banco que pertence a essa cirurgia
                        const pedidoDaCirurgia = listaPedidos.find(p => String(p.cirurgia_id) === String(cirurgia.id));

                        return (
                            <PedidoCard
                                key={cirurgia.id}
                                cirurgia={cirurgia}
                                pedido={pedidoDaCirurgia} // Passa o pedido pro Card
                                onPreview={() => {
                                    // Guarda a cirurgia E o pedido para exibir no modal
                                    setPedidoSelecionado({ cirurgia, pedido: pedidoDaCirurgia });
                                    setPreviewOpen(true);
                                }}
                            />
                        );
                    })
                )}
            </div>

            <PedidoPreview
                cirurgia={pedidoSelecionado?.cirurgia}
                pedido={pedidoSelecionado?.pedido} // Envia os dados para o Modal!
                isOpen={previewOpen}
                onClose={() => setPreviewOpen(false)}
            />
        </>
    );
}

export default Pedidos;