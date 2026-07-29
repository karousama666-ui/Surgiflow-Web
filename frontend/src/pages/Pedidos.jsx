import { useCirurgias } from "../context/CirurgiasContext";

import PedidoCard from "../components/pedidos/PedidoCard";

import "./Pedidos.css";

import { useState } from "react";

import PedidoPreview from "../components/pedidos/PedidoPreview";



function Pedidos() {

    const { listaCirurgias } = useCirurgias();

    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

const [previewOpen, setPreviewOpen] = useState(false);

    return (

    <>

        <h1>Pedidos Cirúrgicos</h1>

        <br />

        <div className="pedidos-grid">

            {listaCirurgias.map((cirurgia) => (

                <PedidoCard
                    key={cirurgia.id}
                    cirurgia={cirurgia}
                    onPreview={(cirurgia) => {
                        setPedidoSelecionado(cirurgia);
                        setPreviewOpen(true);
                    }}
                />

            ))}

        </div>

        <PedidoPreview

            cirurgia={pedidoSelecionado}

            isOpen={previewOpen}

            onClose={() => setPreviewOpen(false)}

        />

    </>

);

}

export default Pedidos;