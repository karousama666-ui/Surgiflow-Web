import "./AgendaTable.css";
import { Pencil, Trash2 } from "lucide-react";
import { useMedicos } from "../../context/MedicosContext";

function AgendaTable({
    cirurgias,
    onStatusChange,
    onDelete,
    onEdit
}) {

    const { listaMedicos } = useMedicos();


    function formatarData(data) {

        if (!data) return "";

        if (data.includes("/")) {
            return data;
        }

        const [ano, mes, dia] = data.split("-");

        return `${dia}/${mes}/${ano}`;

    }


    function obterNomeMedico(cirurgia) {

        if (cirurgia.medicoId) {

            const medico = listaMedicos.find(
                medico =>
                    String(medico.id) ===
                    String(cirurgia.medicoId)
            );

            if (medico) {
                return medico.nome;
            }

        }

        return cirurgia.medico ||
            "Médico não informado";

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

        <>

            {/* DESKTOP */}

            <div className="agenda-table-wrapper">

                <table className="agenda-table">

                    <thead>

                        <tr>

                            <th>Paciente</th>

                            <th>Médico</th>

                            <th>Hospital</th>

                            <th>Convênio</th>

                            <th>Data</th>

                            <th>Hora</th>

                            <th>Status</th>

                            <th>Ações</th>

                        </tr>

                    </thead>


                    <tbody>

                        {cirurgias.map((cirurgia) => (

                            <tr key={cirurgia.id}>

                                <td>
                                    {cirurgia.paciente}
                                </td>

                                <td>
                                    {obterNomeMedico(cirurgia)}
                                </td>

                                <td>
                                    {cirurgia.hospital}
                                </td>

                                <td>
                                    {cirurgia.convenio}
                                </td>

                                <td>
                                    {formatarData(cirurgia.data)}
                                </td>

                                <td>
                                    {cirurgia.horario}
                                </td>

                                <td>

                                    <select

                                        className={`agenda-status-select ${obterStatusClasse(cirurgia.status)}`}

                                        value={cirurgia.status}

                                        onChange={(e) =>
                                            onStatusChange(
                                                cirurgia.id,
                                                e.target.value
                                            )
                                        }

                                    >

                                        <option>
                                            Pendente
                                        </option>

                                        <option>
                                            Confirmada
                                        </option>

                                        <option>
                                            Finalizada
                                        </option>

                                        <option>
                                            Cancelada
                                        </option>

                                    </select>

                                </td>


                                <td>

                                    <div className="agenda-actions">

                                        <button

                                            type="button"

                                            className="edit-button"

                                            onClick={() =>
                                                onEdit(cirurgia)
                                            }

                                            title="Editar"

                                        >

                                            <Pencil size={17} />

                                        </button>


                                        <button

                                            type="button"

                                            className="delete-button"

                                            onClick={() =>
                                                onDelete(cirurgia.id)
                                            }

                                            title="Excluir"

                                        >

                                            <Trash2
                                                size={17}
                                            />

                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>


            {/* MOBILE */}

            <div className="agenda-mobile-list">

                {cirurgias.map((cirurgia) => (

                    <div
                        className="agenda-mobile-card"
                        key={cirurgia.id}
                    >

                        <div className="mobile-card-header">

                            <div>

                                <span className="mobile-paciente">

                                    {cirurgia.paciente}

                                </span>

                                <span className="mobile-horario">

                                    🕘 {cirurgia.horario}

                                </span>

                            </div>


                            <span
                                className={`mobile-status ${obterStatusClasse(cirurgia.status)}`}
                            >

                                {cirurgia.status}

                            </span>

                        </div>


                        <div className="mobile-card-info">

                            <div>

                                <span className="info-label">
                                    Médico
                                </span>

                                <span>
                                    👨‍⚕️ {obterNomeMedico(cirurgia)}
                                </span>

                            </div>


                            <div>

                                <span className="info-label">
                                    Hospital
                                </span>

                                <span>
                                    🏥 {cirurgia.hospital}
                                </span>

                            </div>


                            <div>

                                <span className="info-label">
                                    Convênio
                                </span>

                                <span>
                                    📄 {cirurgia.convenio}
                                </span>

                            </div>


                            <div>

                                <span className="info-label">
                                    Data
                                </span>

                                <span>
                                    📅 {formatarData(cirurgia.data)}
                                </span>

                            </div>

                        </div>


                        <div className="mobile-card-footer">

                            <select

                                className={`agenda-status-select ${obterStatusClasse(cirurgia.status)}`}

                                value={cirurgia.status}

                                onChange={(e) =>
                                    onStatusChange(
                                        cirurgia.id,
                                        e.target.value
                                    )
                                }

                            >

                                <option>
                                    Pendente
                                </option>

                                <option>
                                    Confirmada
                                </option>

                                <option>
                                    Finalizada
                                </option>

                                <option>
                                    Cancelada
                                </option>

                            </select>


                            <div className="agenda-actions">

                                <button

                                    type="button"

                                    className="edit-button"

                                    onClick={() =>
                                        onEdit(cirurgia)
                                    }

                                >

                                    <Pencil size={17} />

                                    <span>
                                        Editar
                                    </span>

                                </button>


                                <button

                                    type="button"

                                    className="delete-button"

                                    onClick={() =>
                                        onDelete(cirurgia.id)
                                    }

                                >

                                    <Trash2 size={17} />

                                    <span>
                                        Excluir
                                    </span>

                                </button>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </>

    );

}

export default AgendaTable;