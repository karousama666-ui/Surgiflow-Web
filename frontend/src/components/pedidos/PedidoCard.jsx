import { FileText, Eye, Building2, CalendarDays, UserRound, Clock, Package, Syringe } from "lucide-react"; // 👈 Importamos o Syringe
import "./PedidoCard.css";

function PedidoCard({ cirurgia, pedido, onPreview }) {

    // Extrai a data e a hora do formato do Supabase
    let data = "Não informada";
    let hora = "Não informado";
    if (cirurgia?.data_cirurgia) {
        const partes = cirurgia.data_cirurgia.split(" ");
        data = partes[0] || "Não informada";
        hora = partes[1] || "Não informado";
    }

    function formatarData(dataIso) {
        if (!dataIso || dataIso === "Não informada") return dataIso;
        if (dataIso.includes("/")) return dataIso;
        const [ano, mes, dia] = dataIso.split("-");
        return `${dia}/${mes}/${ano}`;
    }

    // Puxa o nome correto do médico
    const nomeMedico = cirurgia?.medicos?.nome ? `Dr(a). ${cirurgia.medicos.nome}` : "Médico não informado";

    function obterStatusClasse(status) {
        if (status === "Confirmada") return "status-confirmada";
        if (status === "Finalizada") return "status-finalizada";
        if (status === "Cancelada") return "status-cancelada";
        return "status-pendente";
    }

    // Gerencia o Status visual do OPME
    const statusOpme = pedido?.status || "Pendente de OPME";
    const temPedido = !!pedido;

    return (
        <div className="pedido-card">
            <div className="pedido-header">
                <div>
                    <span className="pedido-label">Paciente</span>
                    <h3>{cirurgia.paciente}</h3>
                </div>
                <span className={`pedido-status ${obterStatusClasse(cirurgia.status)}`}>
                    {cirurgia.status}
                </span>
            </div>

            <div className="pedido-info">
                <p>
                    <UserRound size={16} />
                    <span>{nomeMedico}</span>
                </p>
                <p>
                    <Building2 size={16} />
                    <span>{cirurgia.hospital || "Hospital não informado"}</span>
                </p>
                {/* 🌟 NOVO: PROCEDIMENTO NO CARTÃO 🌟 */}
                <p>
                    <Syringe size={16} />
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "200px" }}>
                        {cirurgia.procedimento || "Procedimento não informado"}
                    </span>
                </p>
                <p>
                    <CalendarDays size={16} />
                    <span>{formatarData(data)}</span>
                </p>
                <p>
                    <Clock size={16} />
                    <span>{hora}</span>
                </p>
                
                {/* Indicador de OPME na lista */}
                <p style={{ marginTop: "8px", color: temPedido ? "#6C63FF" : "#f59e0b", fontWeight: "600" }}>
                    <Package size={16} /> 
                    <span>OPME: {statusOpme}</span>
                </p>
            </div>

            <div className="pedido-actions">
                <button type="button" onClick={onPreview} style={{ width: "100%", justifyContent: "center" }}>
                    <Eye size={17} /> 
                    <span>Gerenciar OPME / PDF</span>
                </button>
            </div>
        </div>
    );
}

export default PedidoCard;