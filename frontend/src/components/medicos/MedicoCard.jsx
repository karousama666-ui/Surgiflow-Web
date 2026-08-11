import "./MedicoCard.css";

function MedicoCard({ medico, onDelete, onEdit }) {

    function handleDelete() {

        const confirmar = window.confirm(
            `Deseja realmente excluir ${medico.nome}?`
        );

        if (!confirmar) {

            return;

        }

        onDelete(medico.id);

    }

    function handleEdit() {

        onEdit(medico);

    }

    return (

        <div className="medico-card">

            <div className="medico-avatar">

                {medico.nome
                    .split(" ")
                    .map(nome => nome[0])
                    .slice(0, 2)
                    .join("")
                }

            </div>

            <div className="medico-info">

                <h3>
                    {medico.nome}
                </h3>

                <span>
                    CRM {medico.crm}
                </span>

                <p>
                    {medico.especialidade || "Especialidade não informada"}
                </p>

                <small>
                    {medico.hospital || "Hospital não informado"}
                </small>

            </div>

            <div className="medico-actions">

                <button
                    type="button"
                    onClick={handleEdit}
                >

                    Editar

                </button>

                <button
                    type="button"
                    onClick={handleDelete}
                >

                    Excluir

                </button>

            </div>

        </div>

    );

}

export default MedicoCard;