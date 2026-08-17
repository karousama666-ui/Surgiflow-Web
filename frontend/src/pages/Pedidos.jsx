import { useCirurgias } from "../context/CirurgiasContext";
import PedidoCard from "../components/pedidos/PedidoCard";
import "./Pedidos.css";
import { useState } from "react";
import PedidoPreview from "../components/pedidos/PedidoPreview";


function Pedidos() {

    const { listaCirurgias } = useCirurgias();

    const [pedidoSelecionado, setPedidoSelecionado] =
        useState(null);

    const [previewOpen, setPreviewOpen] =
        useState(false);

    const [pesquisa, setPesquisa] =
        useState("");

    const [filtroStatus, setFiltroStatus] =
        useState("");

    const [filtroHospital, setFiltroHospital] =
        useState("");

    const [filtroMedico, setFiltroMedico] =
        useState("");


    function converterData(data) {

        if (!data) {

            return 0;

        }

        if (data.includes("/")) {

            const [dia, mes, ano] =
                data.split("/");

            return new Date(
                `${ano}-${mes}-${dia}`
            ).getTime();

        }

        return new Date(data).getTime();

    }


    const hospitais = [

        ...new Set(

            listaCirurgias

                .map(cirurgia => cirurgia.hospital)

                .filter(Boolean)

        )

    ];


    const medicos = [

        ...new Set(

            listaCirurgias

                .map(cirurgia => cirurgia.medico)

                .filter(Boolean)

        )

    ];


    const pedidosFiltrados = listaCirurgias

        .filter(cirurgia => {

            const paciente =
                cirurgia.paciente?.toLowerCase() || "";

            const busca =
                pesquisa.toLowerCase();

            const correspondePesquisa =
                paciente.includes(busca);

            const correspondeStatus =
                filtroStatus === "" ||
                cirurgia.status === filtroStatus;

            const correspondeHospital =
                filtroHospital === "" ||
                cirurgia.hospital === filtroHospital;

            const correspondeMedico =
                filtroMedico === "" ||
                cirurgia.medico === filtroMedico;

            return (

                correspondePesquisa &&
                correspondeStatus &&
                correspondeHospital &&
                correspondeMedico

            );

        })

        .sort(

            (a, b) =>
                converterData(b.data) -
                converterData(a.data)

        );


    return (

        <>

            <h1>

                Pedidos Cirúrgicos

            </h1>

            <br />


            <div

                style={{

                    display: "grid",

                    gridTemplateColumns:
                        "2fr 1fr 1fr 1fr",

                    gap: "12px",

                    marginBottom: "25px"

                }}

            >

                <input

                    type="text"

                    placeholder="🔎 Buscar paciente..."

                    value={pesquisa}

                    onChange={(e) =>
                        setPesquisa(e.target.value)
                    }

                    style={{

                        padding: "12px 15px",

                        border:
                            "1px solid #DDD",

                        borderRadius: "10px",

                        fontSize: "14px"

                    }}

                />


                <select

                    value={filtroStatus}

                    onChange={(e) =>
                        setFiltroStatus(e.target.value)
                    }

                    style={{

                        padding: "12px",

                        border:
                            "1px solid #DDD",

                        borderRadius: "10px"

                    }}

                >

                    <option value="">

                        Todos os status

                    </option>

                    <option value="Pendente">

                        Pendente

                    </option>

                    <option value="Confirmada">

                        Confirmada

                    </option>

                    <option value="Finalizada">

                        Finalizada

                    </option>

                    <option value="Cancelada">

                        Cancelada

                    </option>

                </select>


                <select

                    value={filtroHospital}

                    onChange={(e) =>
                        setFiltroHospital(e.target.value)
                    }

                    style={{

                        padding: "12px",

                        border:
                            "1px solid #DDD",

                        borderRadius: "10px"

                    }}

                >

                    <option value="">

                        Todos os hospitais

                    </option>

                    {hospitais.map(hospital => (

                        <option
                            key={hospital}
                            value={hospital}
                        >

                            {hospital}

                        </option>

                    ))}

                </select>


                <select

                    value={filtroMedico}

                    onChange={(e) =>
                        setFiltroMedico(e.target.value)
                    }

                    style={{

                        padding: "12px",

                        border:
                            "1px solid #DDD",

                        borderRadius: "10px"

                    }}

                >

                    <option value="">

                        Todos os médicos

                    </option>

                    {medicos.map(medico => (

                        <option
                            key={medico}
                            value={medico}
                        >

                            {medico}

                        </option>

                    ))}

                </select>

            </div>


            <div

                style={{

                    marginBottom: "20px",

                    color: "#777",

                    fontSize: "14px"

                }}

            >

                {pedidosFiltrados.length}

                {" "}

                {pedidosFiltrados.length === 1
                    ? "pedido encontrado"
                    : "pedidos encontrados"
                }

            </div>


            <div className="pedidos-grid">

                {pedidosFiltrados.length === 0 ? (

                    <div

                        style={{

                            background: "#fff",

                            padding: "30px",

                            borderRadius: "16px",

                            textAlign: "center",

                            color: "#777"

                        }}

                    >

                        Nenhum pedido encontrado.

                    </div>

                ) : (

                    pedidosFiltrados.map((cirurgia) => (

                        <PedidoCard

                            key={cirurgia.id}

                            cirurgia={cirurgia}

                            onPreview={(cirurgia) => {

                                setPedidoSelecionado(
                                    cirurgia
                                );

                                setPreviewOpen(true);

                            }}

                        />

                    ))

                )}

            </div>


            <PedidoPreview

                cirurgia={pedidoSelecionado}

                isOpen={previewOpen}

                onClose={() =>
                    setPreviewOpen(false)
                }

            />

        </>

    );

}

export default Pedidos;