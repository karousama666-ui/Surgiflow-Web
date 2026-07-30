import Modal from "../modal/Modal";

import "./PedidoPreview.css";

import logoDocumento from "../../assets/logopdf.png";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";

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

    const pdfRef = useRef(null);

    const gerarPDF = async () => {

    const elemento = pdfRef.current;

    const canvas = await html2canvas(elemento, {

        scale: 2

    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const larguraPDF = 210;

    const alturaPDF = (canvas.height * larguraPDF) / canvas.width;

    pdf.addImage(

        imgData,

        "PNG",

        0,

        0,

        larguraPDF,

        alturaPDF

    );

    pdf.save(

        `Pedido_Cirurgico_${cirurgia.paciente}.pdf`

    );

};

    return (

        <Modal

            isOpen={isOpen}

            onClose={onClose}

        >

            <div ref={pdfRef}>

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


    <div
    style={{
        background: "red",
        color: "white",
        padding: "20px",
        cursor: "pointer",
        textAlign: "center",
        borderRadius: "10px",
        marginTop: "20px"
    }}
    onClick={() => {
        console.log("CLICOU NA DIV");
    }}
>
    TESTE PDF
</div>

    <div className="preview-footer">

        Documento gerado pelo <strong>SurgiFlow</strong>

    </div>

</div>
</div>

        </Modal>

    );

}

export default PedidoPreview;