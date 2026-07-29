import Modal from "../modal/Modal";

function PedidoPreview({

    cirurgia,

    isOpen,

    onClose

}) {

    if (!cirurgia) return null;

    return (

        <Modal

            isOpen={isOpen}

            onClose={onClose}

        >

            <h2>Pedido Cirúrgico</h2>

            <hr />

            <p><strong>Paciente:</strong> {cirurgia.paciente}</p>

            <p><strong>Médico:</strong> {cirurgia.medico}</p>

            <p><strong>Hospital:</strong> {cirurgia.hospital}</p>

            <p><strong>Data:</strong> {cirurgia.data}</p>

            <p><strong>Horário:</strong> {cirurgia.horario}</p>

            <p><strong>Status:</strong> {cirurgia.status}</p>

            <br />

            <button>

                📄 Gerar PDF

            </button>

        </Modal>

    );

}

export default PedidoPreview;