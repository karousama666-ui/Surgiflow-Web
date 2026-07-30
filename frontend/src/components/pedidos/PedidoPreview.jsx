import Modal from "../modal/Modal";

import "./PedidoPreview.css";

import logoDocumento from "../../assets/logopdf.png";

import {

    User,

    Stethoscope,

    Building2,

    CalendarDays,

    Clock3,

    CircleCheck,

    FileText

} from "lucide-react";

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

            <div className="preview">

    <div className="preview-header">

    <img
        src={logoDocumento}
        alt="SurgiFlow"
        className="preview-logo"
    />

    <h2>Pedido Cirúrgico</h2>

</div>

    <div className="preview-grid">

    <div className="preview-section">

        <strong>

            <User size={16}/>

            Paciente

        </strong>

        <span>{cirurgia.paciente}</span>

    </div>

    <div className="preview-section">

        <strong>

            <Stethoscope size={16}/>

            Médico

        </strong>

        <span>{cirurgia.medico}</span>

    </div>

    <div className="preview-section">

        <strong>

            <Building2 size={16}/>

            Hospital

        </strong>

        <span>{cirurgia.hospital}</span>

    </div>

    <div className="preview-section">

    <strong>

        <FileText size={16}/>

        Convênio

    </strong>

    <span>{cirurgia.convenio}</span>

</div>

    <div className="preview-section">

        <strong>

            <CalendarDays size={16}/>

            Data

        </strong>

        <span>{cirurgia.data}</span>

    </div>

    <div className="preview-section">

        <strong>

            <Clock3 size={16}/>

            Horário

        </strong>

        <span>{cirurgia.horario}</span>

    </div>

    <div className="preview-section">

        <strong>

            <CircleCheck size={16}/>

            Status

        </strong>

        <span>{cirurgia.status}</span>

    </div>

</div>

    <button className="preview-btn">

        📄 Gerar PDF

    </button>

    <div className="preview-footer">

        Documento gerado pelo <strong>SurgiFlow</strong>

    </div>

</div>

        </Modal>

    );

}

export default PedidoPreview;