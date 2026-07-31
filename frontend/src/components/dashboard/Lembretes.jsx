import { useEffect, useState } from "react";

function Lembretes() {

    const [texto, setTexto] = useState("");

    useEffect(() => {

        const salvo = localStorage.getItem("lembretes");

        if (salvo) {

            setTexto(salvo);

        }

    }, []);

    function salvar(valor) {

        setTexto(valor);

        localStorage.setItem("lembretes", valor);

    }

    return (

        <div
            style={{
                background: "#fff",
                borderRadius: "18px",
                padding: "24px",
                boxShadow: "0 5px 20px rgba(0,0,0,.08)"
            }}
        >

            <h2>📝 Lembretes</h2>

            <br />

            <textarea

                value={texto}

                onChange={(e) => salvar(e.target.value)}

                placeholder="Escreva seus lembretes..."

                style={{
                    width: "100%",
                    height: "280px",
                    resize: "none",
                    border: "1px solid #DDD",
                    borderRadius: "12px",
                    padding: "12px",
                    fontSize: "15px",
                    fontFamily: "inherit"
                }}

            />

        </div>

    );

}

export default Lembretes;