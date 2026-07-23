import "./Modal.css";

function Modal({ isOpen, children, onClose }) {

    if (!isOpen) {

        return null;

    }

    return (

        <div className="modal-overlay">

            <div className="modal">

                <button
    onClick={onClose}
    className="close-button"
>

    ✕

</button>

                {children}

            </div>

        </div>

    );

}

export default Modal;