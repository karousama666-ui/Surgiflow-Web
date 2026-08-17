import { useEffect, useState } from "react";

function Lembretes() {

    const [texto, setTexto] = useState("");

    const [lembretes, setLembretes] = useState(() => {

        const salvo = localStorage.getItem("lembretes");

        if (salvo) {

            return JSON.parse(salvo);

        }

        return [];

    });


    useEffect(() => {

        localStorage.setItem(

            "lembretes",

            JSON.stringify(lembretes)

        );

    }, [lembretes]);


    function adicionarLembrete() {

        if (!texto.trim()) {

            return;

        }

        const novoLembrete = {

            id: Date.now(),

            texto: texto.trim(),

            fixado: false,

            concluido: false

        };

        setLembretes([

            novoLembrete,

            ...lembretes

        ]);

        setTexto("");

    }


    function alternarFixado(id) {

        setLembretes(

            lembretes.map(lembrete =>

                lembrete.id === id

                    ? {

                        ...lembrete,

                        fixado: !lembrete.fixado

                    }

                    : lembrete

            )

        );

    }


    function alternarConcluido(id) {

        setLembretes(

            lembretes.map(lembrete =>

                lembrete.id === id

                    ? {

                        ...lembrete,

                        concluido: !lembrete.concluido

                    }

                    : lembrete

            )

        );

    }


    function excluirLembrete(id) {

        setLembretes(

            lembretes.filter(

                lembrete => lembrete.id !== id

            )

        );

    }


    const lembretesOrdenados = [

        ...lembretes

    ].sort((a, b) => {

        if (a.fixado && !b.fixado) {

            return -1;

        }

        if (!a.fixado && b.fixado) {

            return 1;

        }

        return 0;

    });


    return (

        <div

            style={{

                background: "#fff",

                borderRadius: "18px",

                padding: "24px",

                boxShadow:
                    "0 5px 20px rgba(0,0,0,.08)"

            }}

        >

            <h2>

                📝 Lembretes

            </h2>


            <br />


            <div

                style={{

                    display: "flex",

                    gap: "10px",

                    marginBottom: "20px"

                }}

            >

                <input

                    type="text"

                    value={texto}

                    onChange={(e) =>
                        setTexto(e.target.value)
                    }

                    onKeyDown={(e) => {

                        if (e.key === "Enter") {

                            adicionarLembrete();

                        }

                    }}

                    placeholder="Novo lembrete..."

                    style={{

                        flex: 1,

                        border:
                            "1px solid #DDD",

                        borderRadius: "10px",

                        padding: "12px",

                        fontSize: "14px"

                    }}

                />


                <button

                    type="button"

                    onClick={adicionarLembrete}

                    style={{

                        background: "#6C63FF",

                        color: "#fff",

                        border: "none",

                        borderRadius: "10px",

                        padding: "0 18px",

                        fontWeight: "600",

                        cursor: "pointer"

                    }}

                >

                    + Adicionar

                </button>

            </div>


            <div>

                {lembretesOrdenados.length === 0 ? (

                    <p
                        style={{
                            color: "#888"
                        }}
                    >

                        Nenhum lembrete cadastrado.

                    </p>

                ) : (

                    lembretesOrdenados.map(lembrete => (

                        <div

                            key={lembrete.id}

                            style={{

                                display: "flex",

                                alignItems: "center",

                                gap: "10px",

                                padding: "12px",

                                marginBottom: "10px",

                                background:
                                    lembrete.fixado
                                        ? "#F5F3FF"
                                        : "#F8F9FF",

                                border:
                                    "1px solid #E8E9F3",

                                borderRadius: "12px"

                            }}

                        >

                            <button

                                type="button"

                                onClick={() =>
                                    alternarConcluido(
                                        lembrete.id
                                    )
                                }

                                style={{

                                    border: "none",

                                    background: "transparent",

                                    cursor: "pointer",

                                    fontSize: "18px"

                                }}

                            >

                                {lembrete.concluido
                                    ? "☑"
                                    : "☐"
                                }

                            </button>


                            <span

                                style={{

                                    flex: 1,

                                    textDecoration:
                                        lembrete.concluido
                                            ? "line-through"
                                            : "none",

                                    color:
                                        lembrete.concluido
                                            ? "#999"
                                            : "#333"

                                }}

                            >

                                {lembrete.texto}

                            </span>


                            <button

                                type="button"

                                onClick={() =>
                                    alternarFixado(
                                        lembrete.id
                                    )
                                }

                                title={
                                    lembrete.fixado
                                        ? "Desafixar"
                                        : "Fixar"
                                }

                                style={{

                                    border: "none",

                                    background: "transparent",

                                    cursor: "pointer",

                                    fontSize: "17px"

                                }}

                            >

                                {lembrete.fixado
                                    ? "📌"
                                    : "📍"
                                }

                            </button>


                            <button

                                type="button"

                                onClick={() =>
                                    excluirLembrete(
                                        lembrete.id
                                    )
                                }

                                title="Excluir"

                                style={{

                                    border: "none",

                                    background: "transparent",

                                    cursor: "pointer",

                                    fontSize: "17px"

                                }}

                            >

                                🗑️

                            </button>

                        </div>

                    ))

                )}

            </div>

        </div>

    );

}

export default Lembretes;