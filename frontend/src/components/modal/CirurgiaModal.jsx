import Modal from "./Modal";
import NovaCirurgiaForm from "./NovaCirurgiaForm";

function CirurgiaModal({

    isOpen,

    onClose,

    cirurgia,

    onSave

}) {

    return (

        <Modal

            isOpen={isOpen}

            onClose={onClose}

        >

            <h2>

                {cirurgia ? "Editar Cirurgia" : "Nova Cirurgia"}

            </h2>

            <br />

            <NovaCirurgiaForm

                dados={cirurgia}

                onSave={onSave}

            />

        </Modal>

    );

}

export default CirurgiaModal;