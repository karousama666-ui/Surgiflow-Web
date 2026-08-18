import {
    FileText,
    Eye,
    Building2,
    CalendarDays,
    UserRound,
    Clock
} from "lucide-react";

import "./PedidoCard.css";


function PedidoCard({
    cirurgia,
    onPreview
}) {

    function formatarData(data) {

        if (!data) return "Data não informada";

        if (data.includes("/")) {
            return data;
        }

        const [ano, mes, dia] = data.split("-");

        return `${dia}/${mes}/${ano}`;

    }


    function obterStatusClasse(status) {

        if (status === "Confirmada") {
            return "status-confirmada";
        }

        if (status === "Finalizada") {
            return "status-finalizada";
        }

        if (status === "Cancelada") {
            return "status-cancelada";
        }

        return "status-pendente";

    }


    return (

        <div className="pedido-card">

            <div className="pedido-header">

                <div>

                    <span className="pedido-label">
                        Paciente
                    </span>

                    <h3>
                        {cirurgia.paciente}
                    </h3>

                </div>


                <span
                    className={`pedido-status ${obterStatusClasse(cirurgia.status)}`}
                >

                    {cirurgia.status}

                </span>

            </div>


            <div className="pedido-info">

                <p>

                    <UserRound size={16} />

                    <span>
                        {cirurgia.medico ||
                            "Médico não informado"}
                    </span>

                </p>


                <p>

                    <Building2 size={16} />

                    <span>
                        {cirurgia.hospital ||
                            "Hospital não informado"}
                    </span>

                </p>


                <p>

                    <CalendarDays size={16} />

                    <span>
                        {formatarData(cirurgia.data)}
                    </span>

                </p>


                <p>

                    <Clock size={16} />

                    <span>
                        {cirurgia.horario ||
                            "Horário não informado"}
                    </span>

                </p>

            </div>


            <div className="pedido-actions">

                <button
                    type="button"
                    onClick={() => onPreview(cirurgia)}
                >

                    <Eye size={17} />

                    Visualizar

                </button>


                <button
                    type="button"
                    className="primary"
                >

                    <FileText size={17} />

                    Gerar PDF

                </button>

            </div>

        </div>

    );

}

export default PedidoCard;