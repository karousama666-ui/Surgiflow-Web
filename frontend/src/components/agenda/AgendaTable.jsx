import "./AgendaTable.css";
import { Pencil, Trash2 } from "lucide-react";

function AgendaTable({
    cirurgias,
    onStatusChange,
    onDelete,
    onEdit
}) {

    // 1. Função para extrair a Data e a Hora que vêm grudadas do banco de dados (ex: "2026-08-18 19:00")
    function extrairDataEHora(dataCirurgia) {
        if (!dataCirurgia) return { data: "", hora: "" };
        const partes = dataCirurgia.split(" ");
        return { data: partes[0] || "", hora: partes[1] || "" };
    }

    // 2. Formata a data (YYYY-MM-DD para DD/MM/YYYY)
    function formatarData(data) {
        if (!data) return "";
        if (data.includes("/")) return data;
        const [ano, mes, dia] = data.split("-");
        return `${dia}/${mes}/${ano}`;
    }

    // 3. Pega o nome do médico que o nosso Contexto já trouxe mastigado do banco!
    function obterNomeMedico(cirurgia) {
        // Se o banco trouxe o relacionamento da tabela, usamos ele
        if (cirurgia.medicos && cirurgia.medicos.nome) {
            return `Dra. / Dr. ${cirurgia.medicos.nome}`;
        }
        return "Médico não informado";
    }

    // Cores de status
    function obterStatusClasse(status) {
        if (status === "Confirmada") return "status-confirmada";
        if (status === "Finalizada") return "status-finalizada";
        if (status === "Cancelada") return "status-cancelada";
        return "status-pendente";
    }

    return (
        <>
            {/* ===================== DESKTOP ===================== */}
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
                        {cirurgias.map((cirurgia) => {
                            // Extrai as informações de data e hora para cada linha
                            const { data, hora } = extrairDataEHora(cirurgia.data_cirurgia);

                            return (
                                <tr key={cirurgia.id}>
                                    <td>{cirurgia.paciente}</td>
                                    <td>{obterNomeMedico(cirurgia)}</td>
                                    <td>{cirurgia.hospital}</td>
                                    <td>{cirurgia.convenio}</td>
                                    <td>{formatarData(data)}</td>
                                    <td>{hora}</td>
                                    <td>
                                        <select
                                            className={`agenda-status-select ${obterStatusClasse(cirurgia.status)}`}
                                            value={cirurgia.status}
                                            onChange={(e) => onStatusChange(cirurgia.id, e.target.value)}
                                        >
                                            <option>Pendente</option>
                                            <option>Confirmada</option>
                                            <option>Finalizada</option>
                                            <option>Cancelada</option>
                                        </select>
                                    </td>
                                    <td>
                                        <div className="agenda-actions">
                                            <button
                                                type="button"
                                                className="edit-button"
                                                onClick={() => onEdit(cirurgia)}
                                                title="Editar"
                                            >
                                                <Pencil size={17} />
                                            </button>

                                            <button
                                                type="button"
                                                className="delete-button"
                                                onClick={() => onDelete(cirurgia.id)}
                                                title="Excluir"
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* ===================== MOBILE ===================== */}
            <div className="agenda-mobile-list">
                {cirurgias.map((cirurgia) => {
                    const { data, hora } = extrairDataEHora(cirurgia.data_cirurgia);

                    return (
                        <div className="agenda-mobile-card" key={cirurgia.id}>
                            <div className="mobile-card-header">
                                <div>
                                    <span className="mobile-paciente">{cirurgia.paciente}</span>
                                    <span className="mobile-horario">🕘 {hora}</span>
                                </div>
                                <span className={`mobile-status ${obterStatusClasse(cirurgia.status)}`}>
                                    {cirurgia.status}
                                </span>
                            </div>

                            <div className="mobile-card-info">
                                <div>
                                    <span className="info-label">Médico</span>
                                    <span>👨‍⚕️ {obterNomeMedico(cirurgia)}</span>
                                </div>
                                <div>
                                    <span className="info-label">Hospital</span>
                                    <span>🏥 {cirurgia.hospital}</span>
                                </div>
                                <div>
                                    <span className="info-label">Convênio</span>
                                    <span>📄 {cirurgia.convenio}</span>
                                </div>
                                <div>
                                    <span className="info-label">Data</span>
                                    <span>📅 {formatarData(data)}</span>
                                </div>
                            </div>

                            <div className="mobile-card-footer">
                                <select
                                    className={`agenda-status-select ${obterStatusClasse(cirurgia.status)}`}
                                    value={cirurgia.status}
                                    onChange={(e) => onStatusChange(cirurgia.id, e.target.value)}
                                >
                                    <option>Pendente</option>
                                    <option>Confirmada</option>
                                    <option>Finalizada</option>
                                    <option>Cancelada</option>
                                </select>

                                <div className="agenda-actions">
                                    <button
                                        type="button"
                                        className="edit-button"
                                        onClick={() => onEdit(cirurgia)}
                                    >
                                        <Pencil size={17} />
                                        <span>Editar</span>
                                    </button>

                                    <button
                                        type="button"
                                        className="delete-button"
                                        onClick={() => onDelete(cirurgia.id)}
                                    >
                                        <Trash2 size={17} />
                                        <span>Excluir</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default AgendaTable;