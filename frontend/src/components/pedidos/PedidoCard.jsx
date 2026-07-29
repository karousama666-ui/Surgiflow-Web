import { FileText, Eye, Building2, CalendarDays } from "lucide-react";

import "./PedidoCard.css";



function PedidoCard({

    cirurgia,

    onPreview

}) {

    return (

        <div className="pedido-card">

            <div className="pedido-header">

                <h3>{cirurgia.paciente}</h3>

                <span>{cirurgia.status}</span>

            </div>

            <div className="pedido-info">

                <p>

                    <Building2 size={16}/>

                    {cirurgia.hospital}

                </p>

                <p>

                    <CalendarDays size={16}/>

                    {cirurgia.data}

                </p>

            </div>

            <div className="pedido-actions">

                <button

    onClick={() => onPreview(cirurgia)}

>

    <Eye size={18}/>

    Visualizar

</button>

                <button className="primary">

                    <FileText size={18}/>

                    Gerar PDF

                </button>

            </div>

        </div>

    );

}

export default PedidoCard;