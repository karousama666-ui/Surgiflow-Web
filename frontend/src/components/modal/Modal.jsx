import "./Modal.css";
import { createPortal } from "react-dom";

function Modal({ isOpen, children, onClose, maxWidth }) {
    if (!isOpen) {
        return null;
    }

    return createPortal(
        <div className="modal-overlay">
            <div className="modal" style={maxWidth ? { maxWidth: maxWidth, width: '100%' } : {}}>
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