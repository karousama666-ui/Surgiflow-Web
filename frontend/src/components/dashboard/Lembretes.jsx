import { useEffect, useState } from "react";

function Lembretes() {

    const [texto, setTexto] = useState("");

    const [lembretes, setLembretes] = useState(() => {

        const salvo = localStorage.getItem("lembretes");

        if (salvo) {

            try {

                return JSON.parse(salvo);

            } catch {

                return [];

            }

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


    const lembretesOrdenados = [...lembretes].sort(

        (a, b) => {

            if (a.fixado && !b.fixado) {

                return -1;

            }

            if (!a.fixado && b.fixado) {

                return 1;

            }

            return 0;

        }

    );


    const pendentes = lembretes.filter(
        lembrete => !lembrete.concluido
    ).length;


    return (

        <div

            style={{

                background: "#fff",

                borderRadius: "20px",

                padding: "24px",

                boxShadow:
                    "0 8px 25px rgba(0,0,0,.06)",

                height: "100%",

                boxSizing: "border-box"

            }}

        >

            {/* CABEÇALHO */}

            <div

                style={{

                    display: "flex",

                    justifyContent: "space-between",

                    alignItems: "center",

                    marginBottom: "20px"

                }}

            >

                <div>

                    <h2

                        style={{

                            margin: 0,

                            fontSize: "21px"

                        }}

                    >

                        📝 Lembretes

                    </h2>

                    <span

                        style={{

                            color: "#888",

                            fontSize: "13px"

                        }}

                    >

                        Anotações importantes

                    </span>

                </div>


                <span

                    style={{

                        background: "#EEF2FF",

                        color: "#6C63FF",

                        padding: "6px 11px",

                        borderRadius: "20px",

                        fontSize: "12px",

                        fontWeight: "600"

                    }}

                >

                    {pendentes}

                    {" "}

                    {pendentes === 1
                        ? "pendente"
                        : "pendentes"
                    }

                </span>

            </div>


            {/* CAMPO DE NOVO LEMBRETE */}

            <div

                style={{

                    display: "flex",

                    gap: "8px",

                    marginBottom: "18px"

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

                        minWidth: 0,

                        padding: "11px 13px",

                        border:
                            "1px solid #DDD",

                        borderRadius: "10px",

                        outline: "none",

                        fontSize: "13px",

                        boxSizing: "border-box"

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

                        padding: "0 14px",

                        fontWeight: "600",

                        fontSize: "13px",

                        cursor: "pointer"

                    }}

                >

                    +

                    {" "}

                    Adicionar

                </button>

            </div>


            {/* LISTA */}

            <div>

                {lembretesOrdenados.length === 0 ? (

                    <div

                        style={{

                            background: "#F8F9FF",

                            borderRadius: "14px",

                            padding: "30px 15px",

                            textAlign: "center",

                            color: "#888"

                        }}

                    >

                        <div

                            style={{

                                fontSize: "28px",

                                marginBottom: "8px"

                            }}

                        >

                            📭

                        </div>

                        <span>

                            Nenhum lembrete cadastrado.

                        </span>

                    </div>

                ) : (

                    lembretesOrdenados.map(lembrete => (

                        <div

                            key={lembrete.id}

                            style={{

                                display: "flex",

                                alignItems: "center",

                                gap: "8px",

                                padding: "11px",

                                marginBottom: "9px",

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

                                    fontSize: "17px",

                                    padding: "0"

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

                                    minWidth: 0,

                                    fontSize: "13px",

                                    lineHeight: "1.4",

                                    textDecoration:
                                        lembrete.concluido
                                            ? "line-through"
                                            : "none",

                                    color:
                                        lembrete.concluido
                                            ? "#999"
                                            : "#333",

                                    wordBreak:
                                        "break-word"

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

                                    background:
                                        "transparent",

                                    cursor: "pointer",

                                    fontSize: "15px",

                                    padding: "2px"

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

                                    background:
                                        "transparent",

                                    cursor: "pointer",

                                    fontSize: "15px",

                                    padding: "2px"

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