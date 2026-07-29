import "./Modal.css";
import { createPortal } from "react-dom";

function Modal({ isOpen, children, onClose }) {

    if (!isOpen) {

        return null;

    }

    return createPortal(

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

    </div>,

    document.body

);

}

export default Modal;